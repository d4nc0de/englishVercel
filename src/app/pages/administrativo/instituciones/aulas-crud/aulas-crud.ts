import { getTipoProgramaName } from '@/enums/tipo-programa';
import { Crud } from '@/pages/crud/crud';
import { AulaTutorHistoricoService } from '@/pages/service/aula-tutor-historico.service';
import { AulaService } from '@/pages/service/aula.service';
import { JornadaService } from '@/pages/service/jornada.service';
import { PersonaService } from '@/pages/service/persona.service';
import { SedeService } from '@/pages/service/sede.service';
import { TutorService } from '@/pages/service/tutor.service';
import { humanBool } from '@/utils/human-bool';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-aulas-crud',
    standalone: true,
    templateUrl: './aulas-crud.html',
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
        ToggleSwitchModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class AulasCrud extends Crud {

    originalTutor: number = 0;
    needTutorHistory: boolean = false;
    tutorChangeReason: string = '';

    constructor(
        private aulasService: AulaService,
        private aulaTutorHistoryService: AulaTutorHistoricoService,
        private sedesService: SedeService,
        private tutorService: TutorService,
        private jornadasService: JornadaService,
        private personaService: PersonaService,
        override messageService: MessageService,
        override confirmationService: ConfirmationService
    ) {
        super(messageService, confirmationService);
    }

    sedes: { name: string, sedeid: number }[] = [];
    tutores: { name: string, tutorid: number }[] = [];
    jornadas: { name: string, jornadaid: number }[] = [];

    override onEdit(): void {
        this.originalTutor = this.element.tutorid;
    }

    override elementAdminName = 'Administrar Aulas';
    override pluralName = 'Aulas';
    override singularName = 'Aula';

    override confirmationDeleteMessage = (element: any) =>
        `¿Está seguro que desea eliminar el Aula #${element.aulaid} (${element.nombre})?`;
    override confirmationBulkDeleteMessage =
        '¿Está seguro que desea eliminar las aulas seleccionadas?';
    override bulkDeleteSuccessMessage = 'Aulas eliminadas exitosamente.';
    override deleteSuccessMessage = 'Aula eliminada exitosamente.';

    override requiredFields(): boolean {
        return (
            this.element.nombre && this.element.nombre?.trim() !== '' &&
            this.element.grado !== undefined &&
            this.element.sedeid !== undefined &&
            this.element.tutorid !== undefined &&
            this.element.jornadaid !== undefined)

        // const tutorHistoryRequirement = this.needTutorHistory ? this.tutorChangeReason && this.tutorChangeReason.trim() !== '' : true;
        
        // return basicRequirements && tutorHistoryRequirement;
    }

    override checkConflicts(): { conflict: boolean; message: string } {
        const _elements = this.elements();

        return {
            conflict: _elements.some(
                (e) =>
                    e.nombre === this.element.nombre &&
                    e.sedeid === this.element.sedeid &&
                    e.aulaid !== this.element.aulaid
            ),
            message: 'Ya existe un aula con este nombre para la sede seleccionada.'
        };
    }

    override async setElements(): Promise<void> {
        try {
            const api = await this.aulasService.getAllAulas();
            this.elements.set(api);

            const sedeApi = await this.sedesService.getAllSedes();
            this.sedes = sedeApi.map((inst) => ({ name: inst.nombre, sedeid: inst.sedeid }));

            const tutorApi = await this.tutorService.getAllTutores();
            this.tutores = await Promise.all(
                tutorApi.map(async (tut) => {
                    try {
                        const tutorPersona = await this.personaService.getSinglePersona(tut.personaid);
                        return {
                            name: `${tutorPersona.nombres} ${tutorPersona.apellidos}`,
                            tutorid: Number(tut.tutorid)
                        };
                    } catch (error) {
                        console.error('Error fetching persona for tutor:', error);
                        return { name: 'N/A', tutorid: Number(tut.tutorid) };
                    }
                })
            );

            this.elements().forEach((aula) => {
                const sede = sedeApi.find((inst) => inst.sedeid === aula.sedeid);
                aula.sede_nombre = sede ? sede.nombre : 'N/A';
                aula.tutor_nombre =
                    this.tutores.find((tut) => tut.tutorid === Number(aula.tutorid))?.name || 'N/A';
            });
        } catch (error) {
            console.error('Error fetching aulas:', error);
        }
    }

    override async saveElementLogic(): Promise<boolean> {
        if (this.checkConflicts().conflict) {
            this.errorMessage(this.checkConflicts().message);
            return false;
        }

        try {
            if (this.isNew) {
                // POST /api/Aula/CrearAula
                await this.aulasService.newAula(this.element);
                await this.setElements();
                this.successMessage('Aula creada correctamente');
            } else {
                // PUT /api/Aula/ActualizarAula/{id}
                await this.aulasService.updateSingleAula(this.element.aulaid, this.element);
                await this.setElements();
                this.successMessage('Aula actualizada correctamente');
            }

            return true;
        } catch (error) {
            console.error('Error saving aula:', error);
            this.errorMessage(
                this.isNew
                    ? 'Hubo un error al crear el aula'
                    : 'Hubo un error al actualizar el aula'
            );
            return false;
        }
    }

    onTutorChange(newTutorId: number): void {
        if(this.isNew) return;

        if(newTutorId !== this.originalTutor) {
            this.needTutorHistory = true;
        } else {
            this.needTutorHistory = false;
        }
    }

    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            // DELETE /api/Aula/InactivarAula/{id}
            await this.aulasService.deleteAula(element.aulaid);

            await this.setElements();
            this.successMessage(this.deleteSuccessMessage);
            return true;
        } catch (error) {
            console.error('Error deleting aula:', error);
            this.errorMessage('Hubo un error al eliminar el aula');
            return false;
        }
    }

    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.aulaid) || [];

            await this.aulasService.bulkDeleteAula(idsToDelete);

            await this.setElements();
            this.successMessage(this.bulkDeleteSuccessMessage);
            return true;
        } catch (error) {
            console.error('Error bulk deleting aulas:', error);
            this.errorMessage('Hubo un error al eliminar las aulas seleccionadas');
            return false;
        }
    }

    override setExportColumns(): void {
        this.cols = [
            { field: 'aulaid', header: 'ID Aula' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'grado', header: 'Grado' },
            { field: 'cupo_maximo', header: 'Cupo Máximo' },
            { field: 'activo', header: 'Activo' },
            { field: 'sedeid', header: 'ID Sede' },
            { field: 'programaid', header: 'ID Programa' },
            { field: 'jornadaid', header: 'ID Jornada' },
            { field: 'tutorid', header: 'ID Tutor' }
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    humanBool(value: boolean): string {
        return humanBool(value);
    }

    programName(value: number): string {
        return getTipoProgramaName(value);
    }
}
