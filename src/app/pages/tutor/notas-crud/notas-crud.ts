import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { Estudiante } from '@/models/estudiante';
import { NotaEstudianteService } from '@/pages/service/nota-estudiante.service';
import { ComponenteNotaService } from '@/pages/service/componente-nota.service';
import { PeriodoEvaluacionService } from '@/pages/service/periodo-evaluacion.service';

@Component({
    selector: 'app-notas-crud',
    standalone: true,
    templateUrl: './notas-crud.html',
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
export class NotasCrud extends Crud {
    @Input() estudiante: Estudiante | null = null;

    override elementAdminName = 'Administrar Notas';
    override pluralName = 'Notas';
    override singularName = 'Nota';

    componenteTypes: { label: string; value: number }[] = [];
    periodos: { label: string; value: number }[] = [];

    constructor(
        private componenteService: ComponenteNotaService,
        private notaEstudianteService: NotaEstudianteService,
        private periodoService: PeriodoEvaluacionService,
        protected override messageService: MessageService,
        protected override confirmationService: ConfirmationService
    ) {
        super(messageService, confirmationService);
    }


    override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        try {
            this.componenteTypes = (await this.componenteService.getAllComponentesNotas())
                .filter(c => c.activo)
                .map(c => ({ label: `${c.nombre} (${c.porcentaje}%)`, value: c.componentenotaid }));

            this.setElements();
        } catch (error) {
            console.error('Error fetching componentes de nota:', error);
        }

        try {
            this.periodos = (await this.periodoService.getAllPeriodosEvaluacion())
                .map(p => ({ label: p.nombre, value: p.periodoevaluacionid }));

            this.setElements();
        } catch (error) {
            console.error('Error fetching periodos de evaluacion:', error);
        }

    }

    ngOnChanges() {
        this.setElements();
    }


    override async setElements(): Promise<void> {
        try {
            const api = await this.notaEstudianteService.getNotasEstudiante(this.estudiante!.estudianteid);
            let _elements = api.map((item: any) => ({ ...item, componentename: this.getComponente(item.componentenotaid), periodoname: this.getPeriodo(item.periodoevaluacionid) }));
            this.elements.set(_elements);
        } catch (error) {
            console.error('Error fetching jornadas:', error);
        }
    }

    override setExportColumns(): void {
        this.cols = [
            { field: 'notaid', header: 'ID' },
            { field: 'valor', header: 'Valor' },
            { field: 'estado', header: 'Estado' },
            { field: 'componentename', header: 'Componente' },
            { field: 'periodoname', header: 'Periodo' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.notaid) || [];
            await this.notaEstudianteService.bulkDeleteNotaEstudiante(idsToDelete);

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
            await this.notaEstudianteService.deleteNotaEstudiante(element.notaid);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => val.notaid !== element.notaid));

            return true;
        } catch (error) {
            console.error('Error deleting nota:', error);

            this.errorMessage('Hubo un error al eliminar la nota');
            return false;
        }
    }

    override requiredFields(): boolean {
        return this.element.componentenotaid && this.element.valor;
    }

    override checkConflicts(): { conflict: boolean, message: string } {
        let _elements = this.elements();

        return {
            conflict: _elements.some((e) => e.numero_documento === Number(this.element.numero_documento) && e.personaid !== this.element.personaid),
            message: "Ya existe una persona con este número de documento"
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
                this.element.notaid = _elements.length > 0 ? Math.max(..._elements.map(e => e.notaid)) + 1 : 1; // TODO: Eliminar cuando el API esté listo
                const newNota = await this.notaEstudianteService.newNotaEstudiante(this.element);

                // ACTUALIZAR VISTA
                _elements.push({
                    ...newNota,
                    componentename: this.getComponente(newNota.componentenotaid),
                    periodoname: this.getPeriodo(newNota.periodoevaluacionid)
                });

                this.elements.set(_elements);
                this.successMessage('Nota creada correctamente');
                return true;
            } catch (error) {
                console.error('Error creating nota:', error);
                this.errorMessage('Hubo un error al crear la nota');
                return false;
            }
        } else {
            try {
                // API CALL
                const editNota = await this.notaEstudianteService.updateSingleNotaEstudiante(this.element.notaid, this.element);

                // ACTUALIZAR VISTA
                let i = _elements.findIndex(b => b.notaid === this.element.notaid);
                _elements[i] = {
                    ...editNota,
                    componentename: this.getComponente(editNota.componentenotaid),
                    periodoname: this.getPeriodo(editNota.periodoevaluacionid)
                };
                
                this.elements.set(_elements);
                this.successMessage('Nota actualizada correctamente');
                return true;
            } catch (error) {
                console.error('Error updating nota:', error);
                this.errorMessage('Hubo un error al actualizar la nota');
                return false;
            }
        }
    }

    override confirmationDeleteMessage = (element: any) => `¿Seguro que quiere eliminar la nota #${element?.notaid}?`;
    override confirmationBulkDeleteMessage = '¿Seguro que quiere eliminar las notas seleccionadas?';
    override deleteSuccessMessage = 'Nota eliminada correctamente';
    override bulkDeleteSuccessMessage = 'Notas eliminadas correctamente';

    getComponente(id: number): string {
        return this.componenteTypes.find(c => c.value === id)?.label || 'Desconocido';
    }

    getPeriodo(id: number): string {
        return this.periodos.find(p => p.value === id)?.label || 'Desconocido';
    }
}
