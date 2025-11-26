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
import { FestivoService } from '@/pages/service/festivo.service';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-festivos-crud',
    standalone: true,
    templateUrl: './festivos-crud.html',
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
        DatePickerModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class FestivosCrud extends Crud {
    override elementAdminName = 'Administrar Festivos';
    override pluralName = 'Festivos';
    override singularName = 'Festivo';

    jornadaTypes: { label: string; value: number }[] = [];

    constructor(private festivoService: FestivoService, protected override messageService: MessageService, protected override confirmationService: ConfirmationService) {
        super(messageService, confirmationService);

        this.jornadaTypes = getEnumsLabels(TipoJornada, getTipoJornadaName).map((item) => ({
            label: item.label,
            value: Number(item.value)
        }));
    }

    override async setElements(): Promise<void> {
        try {
            const api = await this.festivoService.getAllFestivos();
            this.elements.set(api);
        } catch (error) {
            console.error('Error fetching festivos:', error);
        }
    }

    override setExportColumns(): void {
        this.cols = [
            { field: 'festivoid', header: 'ID' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'fecha', header: 'Fecha' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.festivoid) || [];
            await this.festivoService.bulkDeleteFestivo(idsToDelete);

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
            await this.festivoService.deleteFestivo(element.festivoid);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => val.festivoid !== element.festivoid));

            return true;
        } catch (error) {
            console.error('Error deleting persona:', error);

            this.errorMessage('Hubo un error al eliminar la persona');
            return false;
        }
    }

    override requiredFields(): boolean {
        return this.element.nombre !== undefined && this.element.fecha !== undefined;
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
                this.element.festivoid = _elements.length > 0 ? Math.max(..._elements.map(e => e.festivoid)) + 1 : 1; // TODO: Eliminar cuando el API esté listo
                const newFestivo = await this.festivoService.newFestivo(this.element);

                // ACTUALIZAR VISTA
                _elements.push(newFestivo);

                this.elements.set(_elements);
                this.successMessage('Festivo creado correctamente');
                return true;
            } catch (error) {
                console.error('Error creating festivo:', error);
                this.errorMessage('Hubo un error al crear el festivo');
                return false;
            }
        } else {
            try {
                // API CALL
                const editFestivo = await this.festivoService.updateSingleFestivo(this.element.festivoid, this.element);

                // ACTUALIZAR VISTA
                let i = _elements.findIndex(b => b.festivoid === this.element.festivoid);
                _elements[i] = editFestivo;
                this.elements.set(_elements);
                this.successMessage('Festivo actualizado correctamente');
                return true;
            } catch (error) {
                console.error('Error updating festivo:', error);
                this.errorMessage('Hubo un error al actualizar el festivo');
                return false;
            }
        }
    }

    override confirmationDeleteMessage = (element: any) => `¿Seguro que quiere eliminar el festivo #${element?.festivoid} (${element?.nombre})?`;
    override confirmationBulkDeleteMessage = '¿Seguro que quiere eliminar los festivos seleccionados?';
    override deleteSuccessMessage = 'Festivo eliminado correctamente';
    override bulkDeleteSuccessMessage = 'Festivos eliminados correctamente';
}
