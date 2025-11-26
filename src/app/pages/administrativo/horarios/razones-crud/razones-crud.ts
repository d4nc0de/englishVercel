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
import { DatePickerModule } from 'primeng/datepicker';
import { RazonService } from '@/pages/service/razon.service';
import { getTipoRazonName, TipoRazon } from '@/enums/tipo-razon';
import { humanBool } from '@/utils/human-bool';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-razones-crud',
    standalone: true,
    templateUrl: './razones-crud.html',
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
export class RazonesCrud extends Crud {
    override elementAdminName = 'Administrar Razones de inasistencia';
    override pluralName = 'Razones de inasistencia';
    override singularName = 'Razón de inasistencia';

    razonesTypes: { label: string; value: number }[] = [];

    constructor(private razonService: RazonService, protected override messageService: MessageService, protected override confirmationService: ConfirmationService) {
        super(messageService, confirmationService);

        this.razonesTypes = getEnumsLabels(TipoRazon, getTipoRazonName).map((item) => ({
            label: item.label,
            value: Number(item.value)
        }));
    }

    override async setElements(): Promise<void> {
        try {
            const razonesEstudiantes = await this.razonService.getAllEstudiantes();
            const razonesClases = await this.razonService.getAllClases();

            const estudiantesWithType = razonesEstudiantes.map((r: any) => ({ ...r, type: TipoRazon.ESTUDIANTE, unique_id: r.motivoinasistenciaestudianteid + "-" + TipoRazon.ESTUDIANTE }));
            const clasesWithType = razonesClases.map((r: any) => ({ ...r, type: TipoRazon.CLASE, unique_id: r.motivonoclaseid + "-" + TipoRazon.CLASE }));

            const api = [...estudiantesWithType, ...clasesWithType];

            console.log(api);

            this.elements.set(api);
        } catch (error) {
            console.error('Error fetching festivos:', error);
        }
    }

    override setExportColumns(): void {
        this.cols = [
            { field: 'type', header: 'Tipo' },
            { field: 'codigo', header: 'Código' },
            { field: 'descripcion', header: 'Descripción' },
            { field: 'permite_reposicion', header: 'Permite reposición' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsEstudiantesToDelete = this.selectedElements
                ?.filter(e => e.type === TipoRazon.ESTUDIANTE)
                .map((e) => e.motivoinasistenciaestudianteid) || [];
            const idsClasesToDelete = this.selectedElements
                ?.filter(e => e.type === TipoRazon.CLASE)
                .map((e) => e.motivonoclaseid) || [];


            await this.razonService.bulkDeleteRazones(idsEstudiantesToDelete, idsClasesToDelete);

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter((val) => !this.selectedElements?.includes(val)));

            return true;
        } catch (error) {
            console.error('Error bulk deleting razones:', error);
            this.errorMessage('Hubo un error al eliminar las razones seleccionadas');
            return false;
        }
    }
    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            if (element.type === TipoRazon.ESTUDIANTE) {
                await this.razonService.deleteRazonEstudiante(element.motivoinasistenciaestudianteid);
            } else if (element.type === TipoRazon.CLASE) {
                await this.razonService.deleteRazonClase(element.motivonoclaseid);
            }

            // ACTUALIZAR VISTA
            this.elements.set(this.elements().filter(
                (val) => element.type === TipoRazon.ESTUDIANTE ?
                    val.motivoinasistenciaestudianteid !== element.motivoinasistenciaestudianteid :
                    val.motivonoclaseid !== element.motivonoclaseid
            ));

            return true;
        } catch (error) {
            console.error('Error deleting persona:', error);

            this.errorMessage('Hubo un error al eliminar la persona');
            return false;
        }
    }

    override requiredFields(): boolean {
        return this.element.codigo !== undefined && this.element.descripcion !== undefined;
    }

    override checkConflicts(): { conflict: boolean, message: string } {
        let _elements = this.elements();

        return {
            conflict: _elements.some((e) => e.codigo === this.element.codigo && (this.element.type === TipoRazon.ESTUDIANTE ? e.motivoinasistenciaestudianteid !== this.element.motivoinasistenciaestudianteid : e.motivonoclaseid !== this.element.motivonoclaseid)),
            message: "Ya existe una razón con este código"
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
            // API CALL
            let newRazon;

            switch (this.element.type) {
                case TipoRazon.ESTUDIANTE: {
                    let estudiantesElements = _elements.filter(e => e.type === TipoRazon.ESTUDIANTE);
                    this.element.motivoinasistenciaestudianteid = estudiantesElements.length > 0 ? Math.max(...estudiantesElements.map(e => e.motivoinasistenciaestudianteid)) + 1 : 1; // TODO: Eliminar cuando el API esté listo

                    try {
                        newRazon = await this.razonService.newRazonEstudiante({
                            motivoinasistenciaestudianteid: this.element.motivoinasistenciaestudianteid,
                            codigo: this.element.codigo,
                            descripcion: this.element.descripcion
                        });

                        newRazon = { ...newRazon, type: TipoRazon.ESTUDIANTE, unique_id: newRazon.motivoinasistenciaestudianteid + "-" + TipoRazon.ESTUDIANTE };
                    } catch (error) {
                        console.error('Error creating razón:', error);
                        this.errorMessage('Hubo un error al crear la razón');
                        return false;
                    }
                }
                    break;

                case TipoRazon.CLASE: {
                    let clasesElements = _elements.filter(e => e.type === TipoRazon.CLASE);
                    this.element.motivonoclaseid = clasesElements.length > 0 ? Math.max(...clasesElements.map(e => e.motivonoclaseid)) + 1 : 1; // TODO: Eliminar cuando el API esté listo

                    try {
                        newRazon = await this.razonService.newRazonClase({
                            motivonoclaseid: this.element.motivonoclaseid,
                            codigo: this.element.codigo,
                            descripcion: this.element.descripcion,
                            permite_reposicion: this.element.permite_reposicion
                        });

                        newRazon = { ...newRazon, type: TipoRazon.CLASE, unique_id: newRazon.motivonoclaseid + "-" + TipoRazon.CLASE };
                    } catch (error) {
                        console.error('Error creating razón:', error);
                        this.errorMessage('Hubo un error al crear la razón');
                        return false;
                    }
                }
                    break;
            }


            // ACTUALIZAR VISTA
            _elements.push(newRazon);

            this.elements.set(_elements);
            this.successMessage('Razón creada correctamente');
            return true;
        } else {
            let editRazon;

            switch (this.element.type) {
                case TipoRazon.ESTUDIANTE: {
                    try {
                        // API CALL
                        editRazon = await this.razonService.updateSingleRazonEstudiante(this.element.motivoinasistenciaestudianteid, this.element);

                        editRazon = { ...editRazon, type: TipoRazon.ESTUDIANTE, unique_id: editRazon.motivoinasistenciaestudianteid + "-" + TipoRazon.ESTUDIANTE };
                    } catch (error) {
                        console.error('Error updating razón:', error);
                        this.errorMessage('Hubo un error al actualizar la razón');
                        return false;
                    }
                }
                    break;

                case TipoRazon.CLASE: {
                    try {
                        // API CALL
                        editRazon = await this.razonService.updateSingleRazonClase(this.element.motivonoclaseid, this.element);
                        editRazon = { ...editRazon, type: TipoRazon.CLASE, unique_id: editRazon.motivonoclaseid + "-" + TipoRazon.CLASE };
                    } catch (error) {
                        console.error('Error updating razón:', error);
                        this.errorMessage('Hubo un error al actualizar la razón');
                        return false;
                    }
                }
                    break;
            }


            // ACTUALIZAR VISTA
            let i = _elements.findIndex(
                b => b.type === TipoRazon.ESTUDIANTE ?
                    b.motivoinasistenciaestudianteid === this.element.motivoinasistenciaestudianteid :
                    b.motivonoclaseid === this.element.motivonoclaseid
            );
            _elements[i] = editRazon;

            console.log(editRazon);

            this.elements.set(_elements);
            this.successMessage('Razón actualizada correctamente');
            return true;
        }
    }


    override confirmationDeleteMessage = (element: any) => `¿Seguro que quiere eliminar la razón #${element?.motivoinasistenciaestudianteid ?? element?.motivonoclaseid} (${element?.codigo})?`;
    override confirmationBulkDeleteMessage = '¿Seguro que quiere eliminar las razones seleccionadas?';
    override deleteSuccessMessage = 'Razón eliminada correctamente';
    override bulkDeleteSuccessMessage = 'Razones eliminadas correctamente';

    tipoRazon(value: any): string {
        return getTipoRazonName(Number(value));
    }

    humanBool(value: boolean): string {
        return humanBool(value);
    }

    isStudent(value: any): boolean {
        return value === TipoRazon.ESTUDIANTE;
    }
}
