import { Component } from '@angular/core';
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
import { getEnumsLabels } from '@/utils/enums-labels';
import { getTipoJornadaName, TipoJornada } from '@/enums/tipo-jornada';
import { JornadaService } from '@/pages/service/jornada.service';

@Component({
    selector: 'app-jornadas-crud',
    standalone: true,
    templateUrl: './jornadas-crud.html',
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
export class JornadasCrud extends Crud {
    override elementAdminName = 'Administrar Jornadas';
    override pluralName = 'Jornadas';
    override singularName = 'Jornada';

    jornadaTypes: { label: string; value: number }[] = [];

    constructor(private jornadaService: JornadaService, protected override messageService: MessageService, protected override confirmationService: ConfirmationService) {
        super(messageService, confirmationService);

        this.jornadaTypes = getEnumsLabels(TipoJornada, getTipoJornadaName).map((item) => ({
            label: item.label,
            value: Number(item.value)
        }));
    }

    override async setElements(): Promise<void> {
        try {
            const api = await this.jornadaService.getAllJornadas();
            this.elements.set(api);
        } catch (error) {
            console.error('Error fetching jornadas:', error);
        }
    }

    override setExportColumns(): void {
        this.cols = [
            { field: 'jornadaid', header: 'ID Jornada' },
            { field: 'codigo', header: 'Tipo Jornada' },
            { field: 'descripcion', header: 'Descripción' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.jornadaid) || [];
            await this.jornadaService.bulkDeleteJornada(idsToDelete);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => !this.selectedElements?.includes(val)));

            return true;
        } catch (error) {
            console.error('Error bulk deleting jornadas:', error);
            this.errorMessage('Hubo un error al eliminar las jornadas seleccionadas');
            return false;
        }
    }
    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            await this.jornadaService.deleteJornada(element.jornadaid);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => val.jornadaid !== element.jornadaid));

            return true;
        } catch (error) {
            console.error('Error deleting jornada:', error);

            this.errorMessage('Hubo un error al eliminar la jornada');
            return false;
        }
    }

    override requiredFields(): boolean {
        return !!this.element.codigo;
    }

    override checkConflicts(): { conflict: boolean, message: string } {
        return { conflict: false, message: '' };
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
                this.element.jornadaid = _elements.length > 0 ? Math.max(..._elements.map(e => e.jornadaid)) + 1 : 1; // TODO: Eliminar cuando el API esté listo
                const newJornada = await this.jornadaService.newJornada(this.element);

                // ACTUALIZAR VISTA
                _elements.push(newJornada);

                this.elements.set(_elements);
                this.successMessage('Jornada creada correctamente');
                return true;
            } catch (error) {
                console.error('Error creating jornada:', error);
                this.errorMessage('Hubo un error al crear la jornada');
                return false;
            }
        } else {
            try {
                // API CALL
                const editJornada = await this.jornadaService.updateSingleJornada(this.element.jornadaid, this.element);

                // ACTUALIZAR VISTA
                let i = _elements.findIndex(b => b.jornadaid === this.element.jornadaid);
                _elements[i] = editJornada;
                this.elements.set(_elements);
                this.successMessage('Jornada actualizada correctamente');
                return true;
            } catch (error) {
                console.error('Error updating jornada:', error);
                this.errorMessage('Hubo un error al actualizar la jornada');
                return false;
            }
        }
    }

    override confirmationDeleteMessage = (element: any) => `¿Seguro que quiere eliminar la jornada #${element?.jornadaid}?`;
    override confirmationBulkDeleteMessage = '¿Seguro que quiere eliminar las jornadas seleccionadas?';
    override deleteSuccessMessage = 'Jornada eliminada correctamente';
    override bulkDeleteSuccessMessage = 'Jornadas eliminadas correctamente';

    tipoJornada(value: any): string {
        return getTipoJornadaName(Number(value));
    }
}
