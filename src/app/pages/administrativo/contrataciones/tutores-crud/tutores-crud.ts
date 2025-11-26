import { Component, signal, ViewChild } from '@angular/core';
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
import { TutorService } from '@/pages/service/tutor.service';
import { Persona } from '@/models/persona';

@Component({
    selector: 'app-tutores-crud',
    standalone: true,
    templateUrl: './tutores-crud.html',
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
export class TutoresCrud extends Crud {
    override elementAdminName = 'Administrar Tutores';
    override pluralName = 'Tutores';
    override singularName = 'Tutor';

    tutores = signal<any[]>([]);
    allPersonas: Persona[] = [];

    @ViewChild('docCtrl') docCtrl!: NgModel;

    constructor(private tutorService: TutorService, private personaService: PersonaService, protected override messageService: MessageService, protected override confirmationService: ConfirmationService) {
        super(messageService, confirmationService);
    }

    override async setElements(): Promise<void> {
        if (this.allPersonas.length === 0) {
            try {
                this.allPersonas = await this.personaService.getAllPersonas();
                this.allPersonas = this.allPersonas.map(p => ({
                    ...p,
                    label: `${p.nombres} ${p.apellidos} - ${p.numero_documento}`
                }));
            } catch (error) {
                console.error('Error fetching personas:', error);
            }
        }

        try {
            const tutoresApi = await this.tutorService.getAllTutores();
            this.elements.set(tutoresApi);
            this.mapPersonas();
        } catch (error) {
            console.error('Error fetching personas:', error);
        }
    }

    private mapPersonas() {
        this.elements().map(tutor => {
            this.personaService.getSinglePersona(tutor.personaid).then(persona => {
                if (persona) tutor.persona = persona;
            });
        });
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

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.personaid) || [];
            await this.personaService.bulkDeletePersona(idsToDelete);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => !this.selectedElements?.includes(val)));

            return true;
        } catch (error) {
            console.error('Error bulk deleting personas:', error);
            this.errorMessage('Hubo un error al eliminar las personas seleccionadas');
            return false;
        }
    }
    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            await this.personaService.deletePersona(element.personaid);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => val.personaid !== element.personaid));

            return true;
        } catch (error) {
            console.error('Error deleting persona:', error);

            this.errorMessage('Hubo un error al eliminar la persona');
            return false;
        }
    }

    override requiredFields(): boolean {
        return this.element.personaid !== undefined;
    }

    override checkConflicts(): { conflict: boolean, message: string } {
        let _elements = this.elements();

        return {
            conflict: _elements.some((e) => e.personaid === this.element.personaid && e.tutorid !== this.element.tutorid),
            message: "Ya existe un tutor con esta persona asignada."
        };
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
                this.element.tutorid = _elements.length > 0 ? Math.max(..._elements.map(e => e.tutorid)) + 1 : 1; // TODO: Eliminar cuando el API esté listo
                const newTutor = await this.tutorService.newTutor(this.element);

                // ACTUALIZAR VISTA
                _elements.push({
                    ...newTutor,
                    persona: this.allPersonas.find(p => p.personaid === newTutor.personaid)
                });

                this.elements.set(_elements);
                this.successMessage('Tutor creado correctamente');
                return true;
            } catch (error) {
                console.error('Error creating tutor:', error);
                this.errorMessage('Hubo un error al crear el tutor');
                return false;
            }
        } else {
            try {
                // API CALL
                const editTutor = await this.tutorService.updateSingleTutor(this.element.tutorid, this.element);

                // ACTUALIZAR VISTA
                let i = _elements.findIndex(b => b.tutorid === this.element.tutorid);
                _elements[i] = {
                    ...editTutor,
                    persona: this.allPersonas.find(p => p.personaid === editTutor.personaid)
                };

                this.elements.set(_elements);
                this.successMessage('Tutor actualizado correctamente');
                return true;
            } catch (error) {
                console.error('Error updating tutor:', error);
                this.errorMessage('Hubo un error al actualizar el tutor');
                return false;
            }
        }
    }

    override confirmationDeleteMessage = (element: any) => `¿Seguro que quiere eliminar el tutor ${element.tutorid}?`;
    override confirmationBulkDeleteMessage = '¿Seguro que quiere eliminar los tutores seleccionados?';
    override deleteSuccessMessage = 'Tutor eliminado correctamente';
    override bulkDeleteSuccessMessage = 'Tutores eliminados correctamente';
}
