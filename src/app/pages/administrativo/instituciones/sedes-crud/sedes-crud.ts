import { Crud } from '@/pages/crud/crud';
import { InstitucionService } from '@/pages/service/institucion.service';
import { SedeService } from '@/pages/service/sede.service';
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
    selector: 'app-sedes-crud',
    standalone: true,
    templateUrl: './sedes-crud.html',
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
export class SedesCrud extends Crud {
    constructor(private sedesService: SedeService, private institucionService: InstitucionService, override messageService: MessageService, override confirmationService: ConfirmationService) {
        super(messageService, confirmationService);
    }

    instituciones: { name: string, institucionid: number }[] = [];

    override elementAdminName = 'Administrar Sedes';
    override pluralName = 'Sedes';
    override singularName = 'Sede';
    override confirmationDeleteMessage = (element: any) => `¿Está seguro que desea eliminar la sede "${element.nombre}"?`;
    override confirmationBulkDeleteMessage = '¿Está seguro que desea eliminar las sedes seleccionadas?';
    override bulkDeleteSuccessMessage = 'Sedes eliminadas exitosamente.';
    override deleteSuccessMessage = 'Sede eliminada exitosamente.';
    override requiredFields(): boolean {
        return this.element.nombre && this.element.nombre?.trim() !== '' &&
            this.element.direccion && this.element.direccion?.trim() !== '' &&
            this.element.institucionid !== undefined;
    }
    override checkConflicts(): { conflict: boolean; message: string; } {
        let _elements = this.elements();

        let nameConflict = _elements.some((e) => e.nombre === this.element.nombre && e.institucionid === this.element.institucionid && e.sedeid !== this.element.sedeid);
        let principalConflict = this.element.es_principal ? _elements.some((e) => e.es_principal && e.institucionid === this.element.institucionid && e.sedeid !== this.element.sedeid) : false;

        if (principalConflict) {
            return {
                conflict: true,
                message: "Ya existe una sede principal para la institución especificada."
            };
        }

        if (nameConflict) {
            return {
                conflict: true,
                message: "Ya existe una sede con este nombre para la institución especificada."
            };
        }

        return { conflict: false, message: "" };
    }

    override async setElements(): Promise<void> {
        try {
            const api = await this.sedesService.getAllSedes();
            this.elements.set(api);

            const institucionApi = await this.institucionService.getAllInstituciones();
            this.instituciones = institucionApi.map(inst => ({ name: inst.nombre, institucionid: inst.institucionid }));

            this.elements().forEach(sede => {
                const institucion = institucionApi.find(inst => inst.institucionid === sede.institucionid);
                sede.institucion_nombre = institucion ? institucion.nombre : 'N/A';
            });
        } catch (error) {
            console.error('Error fetching sedes:', error);
        }
    }

    override async saveElementLogic(): Promise<boolean> {
        let _elements = this.elements();
    
        if (this.checkConflicts().conflict) {
            this.errorMessage(this.checkConflicts().message);
            return false;
        }
    
        if (this.isNew) {
            try {
                await this.sedesService.newSede(this.element);
        
                await this.setElements(); // 👈 REFRESCAR TABLA
        
                this.successMessage('Sede creada correctamente');
                return true;
            } catch (error) {
                console.error('Error creating sede:', error);
                this.errorMessage('Hubo un error al crear la sede');
                return false;
            }
        } else {
            try {
                await this.sedesService.updateSingleSede(this.element.sedeid, this.element);
        
                await this.setElements(); // 👈 REFRESCAR TABLA
        
                this.successMessage('Sede actualizada correctamente');
                return true;
            } catch (error) {
                console.error('Error updating sede:', error);
                this.errorMessage('Hubo un error al actualizar la sede');
                return false;
            }
        }
        
    }
    

    override async deleteElementLogic(element: any): Promise<boolean> {
        try {
            await this.sedesService.deleteSede(element.sedeid);
    
            await this.setElements(); // 👈 REFRESCAR TABLA
    
            this.successMessage(this.deleteSuccessMessage);
            return true;
        } catch (error) {
            console.error('Error deleting sede:', error);
            this.errorMessage('Hubo un error al eliminar la sede');
            return false;
        }
    }
    
    
    override async deleteSelectedElementsLogic(): Promise<boolean> {
        try {
            const ids = this.selectedElements?.map(e => e.sedeid) || [];
    
            await this.sedesService.bulkDeleteSede(ids);
    
            await this.setElements(); // 👈 REFRESCAR TABLA
    
            this.successMessage(this.bulkDeleteSuccessMessage);
            return true;
        } catch (error) {
            console.error('Error bulk deleting sedes:', error);
            this.errorMessage('Hubo un error al eliminar las sedes seleccionadas');
            return false;
        }
    }
    
    

    override setExportColumns(): void {
        this.cols = [
            { field: 'sedeid', header: 'ID Sede' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'direccion', header: 'Dirección' },
            { field: 'es_principal', header: 'Es Principal' },
            { field: 'institucionid', header: 'ID Institución' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    humanBool(value: boolean): string {
        return humanBool(value);
    }
}
