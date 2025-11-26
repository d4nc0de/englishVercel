import { ComponenteNota } from '@/models/componente-nota';
import { ComponenteNotaService } from '@/pages/service/componente-nota.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-componentes-crud',
    standalone: true,
    templateUrl: './componentes-crud.html',
    imports: [
        CommonModule,
        TableModule,
        InputTextModule,
        FormsModule,
        CheckboxModule,
        ButtonModule,
        FloatLabelModule,
        InputNumberModule,
        MessageModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class ComponentesCrud {
    originalList: ComponenteNota[] = [];

    components: ComponenteNota[] = [];
    numberOfComponents: number = 0;
    totalPercentage: number = 0;

    constructor(
        private componenteNotaService: ComponenteNotaService,
        private messageService: MessageService
    ) { }

    async ngOnInit() {
        this.originalList = await this.componenteNotaService.getAllComponentesNotas();
        this.components = structuredClone(this.originalList);
        this.numberOfComponents = this.components.length;
        this.totalPercentage = this.getTotalPercentage();
    }

    canSave(): boolean {
        return this.totalPercentage === 100 &&
            this.components.every(comp => comp.nombre.trim().length > 0) &&
            this.components.every(comp => comp.porcentaje > 0);
    }

    async saveChanges() {
        try {
            await this.componenteNotaService.saveComponentesNotas(this.components);

            this.originalList = structuredClone(this.components);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Componentes guardados correctamente' });
        } catch (error) {
            console.error('Error saving components:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los componentes' });
        }
    }

    getTotalPercentage(): number {
        const total = this.components.reduce(
            (sum, comp) => comp.activo ? sum + comp.porcentaje : sum,
            0
        );
        this.totalPercentage = parseFloat(total.toFixed(2));
        return this.totalPercentage;
    }

    onChangeNumber(value: number) {
        const currentLength = this.components.length;
        if (this.numberOfComponents > currentLength) {
            for (let i = currentLength; i < this.numberOfComponents; i++) {
                let id = this.originalList.length > 0 ? Math.max(...this.originalList.map(c => c.componentenotaid)) + 1 : 1;
                let existing = this.originalList[i];
                if (existing) {
                    this.components.push(structuredClone(existing));
                    continue;
                } else {
                    id = this.components.length > 0 ? Math.max(...this.components.map(c => c.componentenotaid)) + 1 : 1;
                }

                this.components.push({
                    componentenotaid: id,
                    nombre: '',
                    porcentaje: 0.01,
                    activo: true
                });
            }
        } else if (this.numberOfComponents < currentLength) {
            this.components.splice(this.numberOfComponents);
        }

        this.totalPercentage = this.getTotalPercentage();
    }
}