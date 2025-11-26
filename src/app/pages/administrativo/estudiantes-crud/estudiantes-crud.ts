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
import { SessionService } from '@/pages/service/session.service';
import { getUserRoleName } from '@/enums/user-role';
import { getTipoDocumentoName, TipoDocumento } from '@/enums/tipo-documento';
import { getEnumsLabels } from '@/utils/enums-labels';
import { EstudianteService } from '@/pages/service/estudiante.service';
import { humanBool } from '@/utils/human-bool';
import { getSexoName, Sexo } from '@/enums/sexo';
import { DatePickerModule } from 'primeng/datepicker';
import { AulaService } from '@/pages/service/aula.service';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-estudiantes-crud',
    standalone: true,
    templateUrl: './estudiantes-crud.html',
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
        ConfirmDialogModule,
        DatePickerModule,
        CheckboxModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class EstudiantesCrud extends Crud {
    override elementAdminName = 'Administrar Estudiantes';
    override pluralName = 'Estudiantes';
    override singularName = 'Estudiante';

    @ViewChild('docCtrl') docCtrl!: NgModel;

    documentTypes: { label: string; value: number }[] = [];
    availableRoles: { label: string; value: number }[] = [];
    sexTypes: { label: string; value: string }[] = [];
    aulas: { label: string; value: number }[] = [];

    constructor(private sessionService: SessionService, private aulaService: AulaService, private estudianteService: EstudianteService, protected override messageService: MessageService, protected override confirmationService: ConfirmationService) {
        super(messageService, confirmationService);

        this.documentTypes = getEnumsLabels(TipoDocumento, getTipoDocumentoName).map((item) => ({
            label: item.label,
            value: Number(item.value)
        }));

        this.sexTypes = getEnumsLabels(Sexo, getSexoName)
    }

    override async setElements(): Promise<void> {
        try {
            const aulasApi = await this.aulaService.getAllAulas();
            this.aulas = aulasApi.map(aula => ({ label: aula.nombre, value: aula.aulaid }));
        } catch (error) {
            console.error('Error fetching aulas:', error);
        }
        try {
            const estudiantesApi = await this.estudianteService.getAllEstudiantes();
            this.elements.set(estudiantesApi);
        } catch (error) {
            console.error('Error fetching estudiantes:', error);
        }
    }

    override setExportColumns(): void {
        this.cols = [
            { field: 'estudianteid', header: 'ID' },
            { field: 'aulaid', header: 'Aula' },
            { field: 'nombres', header: 'Nombres' },
            { field: 'apellidos', header: 'Apellidos' },
            { field: 'fecha_nacimiento', header: 'Fecha de nacimiento' },
            { field: 'tipodocumentoid', header: 'Tipo de documento' },
            { field: 'numero_documento', header: 'Número de documento' },
            { field: 'sexo', header: 'Sexo' },
            { field: 'activo', header: 'Activo' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.estudianteid) || [];
            await this.estudianteService.bulkDeleteEstudiante(idsToDelete);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => !this.selectedElements?.includes(val)));

            return true;
        } catch (error) {
            console.error('Error bulk deleting estudiantes:', error);
            this.errorMessage('Hubo un error al eliminar los estudiantes seleccionados');
            return false;
        }
    }
    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            await this.estudianteService.deleteEstudiante(element.estudianteid);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => val.estudianteid !== element.estudianteid));

            return true;
        } catch (error) {
            console.error('Error deleting estudiante:', error);

            this.errorMessage('Hubo un error al eliminar el estudiante');
            return false;
        }
    }

    override requiredFields(): boolean {
        console.log(this.element);
        return this.element.tipodocumentoid !== undefined && this.element.numero_documento !== undefined &&
            this.element.nombres && this.element.nombres?.trim() !== '' &&
            this.element.apellidos && this.element.apellidos?.trim() !== '' &&
            this.element.fecha_nacimiento !== undefined && this.element.activo !== undefined &&
            this.element.aulaid !== undefined;
    }

    override checkConflicts(): { conflict: boolean, message: string } {
        let _elements = this.elements();

        return {
            conflict: _elements.some((e) => e.numero_documento === Number(this.element.numero_documento) && e.estudianteid !== this.element.estudianteid),
            message: "Ya existe un estudiante con este número de documento"
        };
    }

    saveEstudiante(docCtrl: NgModel) {
        if(docCtrl.invalid) {
            this.errorMessage('El formato del número de documento es inválido.');
            return;
        }

        this.saveElement();
    }

    override onEdit(): void {
        console.log(this.element);
    }

    override async saveElementLogic(): Promise<boolean> {
        let _elements = this.elements();

        console.log(this.element);

        // revisar si existe antes de intentar hacer el API call
        if (this.checkConflicts().conflict) {
            this.errorMessage(this.checkConflicts().message);
            return false;
        }

        if (this.isNew) {
            try {
                // API CALL
                this.element.estudianteid = _elements.length > 0 ? Math.max(..._elements.map(e => e.estudianteid)) + 1 : 1; // TODO: Eliminar cuando el API esté listo
                const newEstudiante = await this.estudianteService.newEstudiante(this.element);

                // ACTUALIZAR VISTA
                _elements.push(newEstudiante);

                this.elements.set(_elements);
                this.successMessage('Estudiante creado correctamente');
                return true;
            } catch (error) {
                console.error('Error creating estudiante:', error);
                this.errorMessage('Hubo un error al crear el estudiante');
                return false;
            }
        } else {
            try {
                // API CALL
                const editEstudiante = await this.estudianteService.updateSingleEstudiante(this.element.estudianteid, this.element);

                // ACTUALIZAR VISTA
                let i = _elements.findIndex(b => b.estudianteid === this.element.estudianteid);
                _elements[i] = editEstudiante;
                this.elements.set(_elements);
                this.successMessage('Estudiante actualizado correctamente');
                return true;
            } catch (error) {
                console.error('Error updating estudiante:', error);
                this.errorMessage('Hubo un error al actualizar el estudiante');
                return false;
            }
        }
    }

    override confirmationDeleteMessage = (element: any) => `¿Seguro que quiere eliminar a ${element?.nombres} ${element?.apellidos}?`;
    override confirmationBulkDeleteMessage = '¿Seguro que quiere eliminar los estudiantes seleccionados?';
    override deleteSuccessMessage = 'Estudiante eliminado correctamente';
    override bulkDeleteSuccessMessage = 'Estudiantes eliminados correctamente';

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
            // Seleccionar solo los que NO estan deshabilitados
            this.selectedElements = this.elements().filter(e => !this.isSame(e));
        } else {
            // Deseleccionar todo
            this.selectedElements = [];
        }
    }

    isSame(element: any): boolean {
        return element.personaid === this.sessionService.getPersona()!.personaid;
    }

    sexoName(value: any): string {
        return getSexoName(value);
    }

    humanBool(value: boolean): string {
        return humanBool(value);
    }

    getAula(aulaid: number): string {
        const aula = this.aulas.find(a => a.value === aulaid);
        return aula ? aula.label : 'Desconocida';
    }
}
