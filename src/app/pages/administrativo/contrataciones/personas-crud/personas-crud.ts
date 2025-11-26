import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { Crud } from '@/pages/crud/crud';
import { PersonaService } from '@/pages/service/persona.service';
import { SessionService } from '@/pages/service/session.service';
import { getUserRoleName, UserRole } from '@/enums/user-role';
import { getTipoDocumentoName, TipoDocumento } from '@/enums/tipo-documento';
import { getEnumsLabels } from '@/utils/enums-labels';
import { UserService } from '@/pages/service/user.service';

@Component({
    selector: 'app-personas-crud',
    standalone: true,
    templateUrl: './personas-crud.html',
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class PersonasCrud extends Crud {
    override elementAdminName = 'Administrar Personas';
    override pluralName = 'Personas';
    override singularName = 'Persona';

    @ViewChild('docCtrl') docCtrl!: NgModel;

    documentTypes: { label: string; value: number }[] = [];
    availableRoles: { label: string; value: number }[] = [];

    constructor(
        private sessionService: SessionService,
        private userService: UserService,
        private personaService: PersonaService,
        protected override messageService: MessageService,
        protected override confirmationService: ConfirmationService
    ) {
        super(messageService, confirmationService);

        this.documentTypes = getEnumsLabels(TipoDocumento, getTipoDocumentoName).map((item) => ({
            label: item.label,
            value: Number(item.value)
        }));

        this.getAvailableRoles();
    }

    override onNew(): void {
        this.getAvailableRoles();
    }

    override onEdit(): void {
        this.getAvailableRoles();
    }

    getAvailableRoles() {
        this.availableRoles = getEnumsLabels(
            UserRole,
            getUserRoleName,
            (value) => {
                if (!this.sessionService.isSuperAdmin()) {
                    if (this.isNew) return value !== UserRole.ADMINISTRADOR;
                    else return true;
                }
                return true;
            }
        ).map((item) => ({
            label: item.label,
            value: Number(item.value)
        }));
    }

    // 🔹 LECTURA: Personas activas + datos básicos de usuario (correo / teléfono)
    override async setElements(): Promise<void> {
        try {
            const personasApi = await this.personaService.getAllPersonas();
            const userApi = await this.userService.getAllUsuarios();

            this.elements.set(personasApi);

            // this.elements().forEach((persona: any) => {
            //     const usuario = userApi.find((user) => user.id === persona.usuarioid);
            //     persona['correo'] = usuario?.email || 'Usuario sin asignar';
            //     persona['telefono'] = usuario?.phone || 'Usuario sin asignar';
            // });
        } catch (error) {
            console.error('Error fetching personas:', error);
            this.errorMessage('Hubo un error al obtener las personas');
        }
    }

    override setExportColumns(): void {
        this.cols = [
            { field: 'personaid', header: 'ID Persona' },
            { field: 'tipodocumentoid_id', header: 'Tipo Documento' },
            { field: 'numero_documento', header: 'Número Documento' },
            { field: 'nombres', header: 'Nombres' },
            { field: 'apellidos', header: 'Apellidos' },
            { field: 'correo', header: 'Correo' },
            { field: 'telefono', header: 'Teléfono' },
            { field: 'activo', header: 'Activo' },
            { field: 'rolid', header: 'ID Rol' }
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    // 🔹 ELIMINACIÓN MASIVA (usa API bulkDeletePersona que a su vez hace delete uno a uno)
    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.personaid) || [];
            await this.personaService.bulkDeletePersona(idsToDelete);

            this.elements.set(
                this.elements().filter((val) => !this.selectedElements?.includes(val))
            );

            return true;
        } catch (error) {
            console.error('Error bulk deleting personas:', error);
            this.errorMessage('Hubo un error al eliminar las personas seleccionadas');
            return false;
        }
    }

    // 🔹 ELIMINACIÓN INDIVIDUAL (DELETE /InactivarPersona/{id})
    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            await this.personaService.deletePersona(element.personaid);

            this.setElements();

            return true;
        } catch (error) {
            console.error('Error deleting persona:', error);
            this.errorMessage('Hubo un error al eliminar la persona');
            return false;
        }
    }

    override requiredFields(): boolean {
        return (
            this.element.tipodocumentoid !== undefined &&
            this.element.numero_documento !== undefined &&
            this.element.nombres &&
            this.element.nombres?.trim() !== '' &&
            this.element.apellidos &&
            this.element.apellidos?.trim() !== '' &&
            this.element.rolid !== undefined
        );
    }

    override checkConflicts(): { conflict: boolean; message: string } {
        const _elements = this.elements();

        return {
            conflict: _elements.some(
                (e) =>
                    e.numero_documento === Number(this.element.numero_documento) &&
                    e.personaid !== this.element.personaid
            ),
            message: 'Ya existe una persona con este número de documento'
        };
    }

    savePersona(docCtrl: NgModel) {
        if (docCtrl.invalid) {
            this.errorMessage('El formato del número de documento es inválido.');
            return;
        }

        this.saveElement();
        this.setElements();
    }

    // 🔹 CREAR / ACTUALIZAR usando los endpoints reales
    override async saveElementLogic(): Promise<boolean> {
        const _elements = this.elements();

        // Validar conflictos en front antes de llamar API
        const conflictCheck = this.checkConflicts();
        if (conflictCheck.conflict) {
            this.errorMessage(conflictCheck.message);
            return false;
        }

        try {
            if (this.isNew) {
                // 👉 POST /api/Persona/CrearPersona
                const newPersona = await this.personaService.newPersona(this.element);

                // Actualizar listado en memoria
                _elements.push(newPersona);
                this.elements.set(_elements);

                this.successMessage('Persona creada correctamente');
                return true;
            } else {
                // 👉 PUT /api/Persona/ActualizarPersona/{id}
                const editPersona = await this.personaService.updateSinglePersona(
                    this.element.personaid,
                    this.element
                );

                // const i = _elements.findIndex(
                //     (b: any) => b.personaid === this.element.personaid
                // );
                // if (i !== -1) {
                //     _elements[i] = editPersona;
                //     this.elements.set(_elements);
                // }
                this.setElements();
                this.successMessage('Persona actualizada correctamente');
                return true;
            }
        } catch (error) {
            console.error('Error saving persona:', error);
            this.errorMessage(
                this.isNew
                    ? 'Hubo un error al crear la persona'
                    : 'Hubo un error al actualizar la persona'
            );
            return false;
        }
    }

    override confirmationDeleteMessage = (element: any) =>
        `¿Seguro que quiere eliminar a ${element?.nombres} ${element?.apellidos}?`;
    override confirmationBulkDeleteMessage =
        '¿Seguro que quiere eliminar las personas seleccionadas?';
    override deleteSuccessMessage = 'Persona eliminada correctamente';
    override bulkDeleteSuccessMessage = 'Personas eliminadas correctamente';

    tipoDocumento(value: any): string {
        return getTipoDocumentoName(Number(value));
    }

    roleName(value: any): string {
        return getUserRoleName(Number(value));
    }

    canManageRole(): boolean {
        return this.isNew || this.sessionService.isSuperAdmin();
    }

    onHeaderToggle(event: any) {
        if (event.checked) {
            this.selectedElements = this.elements().filter((e) => !this.isSame(e));
        } else {
            this.selectedElements = [];
        }
    }

    isSame(element: any): boolean {
        return element.personaid === this.sessionService.getPersona()!.personaid;
    }
}
