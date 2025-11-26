import { Crud } from '@/pages/crud/crud';
import { InstitucionService } from '@/pages/service/institucion.service';
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
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-instituciones-crud',
    standalone: true,
    templateUrl: './instituciones-crud.html',
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
export class InstitucionesCrud extends Crud {
    constructor(private institucionService: InstitucionService, override messageService: MessageService, override confirmationService: ConfirmationService) {
        super(messageService, confirmationService);
    }

    override elementAdminName = 'Administrar Instituciones';
    override pluralName = 'Instituciones';
    override singularName = 'Institución';
    override confirmationDeleteMessage = (element: any) => `¿Está seguro que desea eliminar la institución "${element.nombre}"?`;
    override confirmationBulkDeleteMessage = '¿Está seguro que desea eliminar las instituciones seleccionadas?';
    override bulkDeleteSuccessMessage = 'Instituciones eliminadas exitosamente.';
    override deleteSuccessMessage = 'Institución eliminada exitosamente.';
    override requiredFields(): boolean {
        return this.element.codigo && this.element.codigo?.trim() !== '' &&
            this.element.nombre && this.element.nombre?.trim() !== '';
    }
    override checkConflicts(): { conflict: boolean; message: string; } {
        let _elements = this.elements();

        return {
            conflict: _elements.some((e) => e.codigo === this.element.codigo && e.institucionid !== this.element.institucionid),
            message: "Ya existe una institución con este código"
        };
    }

    override async setElements(): Promise<void> {
        try {
            const api = await this.institucionService.getAllInstituciones();
            this.elements.set(api);
        } catch (error) {
            console.error('Error fetching instituciones:', error);
        }
    }

    override async saveElementLogic(): Promise<boolean> {
        if (this.checkConflicts().conflict) {
            this.errorMessage(this.checkConflicts().message);
            return false;
        }
    
        try {
            if (this.isNew) {
                // POST /CrearInstitucion
                await this.institucionService.newInstitucion(this.element);
    
                await this.setElements(); // refrescar desde backend
                this.successMessage('Institución creada correctamente');
                return true;
            } else {
                // PUT /ActualizarInstitucion/{id}
                await this.institucionService.updateSingleInstitucion(
                    this.element.institucionid,
                    this.element
                );
    
                await this.setElements(); // refrescar desde backend
                this.successMessage('Institución actualizada correctamente');
                return true;
            }
        } catch (error) {
            console.error('Error saving institución:', error);
            this.errorMessage(
                this.isNew
                    ? 'Hubo un error al crear la institución'
                    : 'Hubo un error al actualizar la institución'
            );
            return false;
        }
    }
    

    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const idsToDelete = this.selectedElements?.map((e) => e.institucionid) || [];
    
            await this.institucionService.bulkDeleteInstitucion(idsToDelete);
    
            await this.setElements(); // refrescar lista
            this.successMessage(this.bulkDeleteSuccessMessage);
            return true;
        } catch (error) {
            console.error('Error bulk deleting instituciones:', error);
            this.errorMessage('Hubo un error al eliminar las instituciones seleccionadas');
            return false;
        }
    }
    

    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            await this.institucionService.deleteInstitucion(element.institucionid);
    
            await this.setElements(); // refrescar lista
            this.successMessage(this.deleteSuccessMessage);
            return true;
        } catch (error) {
            console.error('Error deleting institución:', error);
            this.errorMessage('Hubo un error al eliminar la institución');
            return false;
        }
    }
    

    override setExportColumns(): void {
        this.cols = [
            { field: 'institucionid', header: 'ID Institución' },
            { field: 'codigo', header: 'Código' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'direccion', header: 'Dirección' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

}