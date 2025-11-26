import { getTipoProgramaName, TipoPrograma } from '@/enums/tipo-programa';
import { CalendarioSemanalPrograma } from '@/models/calendario-semana-programa';
import { CalendarioSemanaProgramaService } from '@/pages/service/calendario-semana-programa.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-calendario',
    standalone: true,
    templateUrl: './calendario.html',
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
        ToastModule,
        DatePickerModule
    ],
    providers: [MessageService]
})
export class Calendario {
    allSemanas: CalendarioSemanalPrograma[] = [];
    semanasOutside: CalendarioSemanalPrograma[] = [];
    semanasInside: CalendarioSemanalPrograma[] = [];

    outsideExists: boolean = false;
    insideExists: boolean = false;

    outsideNSemanas: number = 0;
    insideNSemanas: number = 0;

    minDate: Date = new Date();

    fechaInicioOutside: Date = new Date();
    fechaInicioInside: Date = new Date();

    constructor(
        private calendarioService: CalendarioSemanaProgramaService,
        private messageService: MessageService
    ) { }

    async ngOnInit() {
        this.semanasOutside = await this.calendarioService.getSemanasPorPrograma(TipoPrograma.OUTSIDECLASSROOM);
        this.semanasInside = await this.calendarioService.getSemanasPorPrograma(TipoPrograma.INSIDECLASSROOM);

        if (this.semanasOutside.length > 0) this.outsideExists = true;
        if (this.semanasInside.length > 0) this.insideExists = true;

        this.fechaInicioOutside = this.nextAvailableMonday(new Date());
        this.fechaInicioInside = this.nextAvailableMonday(new Date());
    }

    canGenerateOutside(): boolean {
        return this.outsideNSemanas > 0 && this.semanasOutside.length > 0;
    }

    async generateOutside() {
        try {
            await this.calendarioService.createSemanas(this.semanasOutside);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Semanas generadas correctamente' });

            this.outsideExists = true;
        } catch (error) {
            console.error('Error generating outside weeks:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron generar las semanas' });
        }
    }

    canGenerateInside(): boolean {
        return this.insideNSemanas > 0 && this.semanasInside.length > 0;
    }

    async generateInside() {
        try {
            await this.calendarioService.createSemanas(this.semanasInside);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Semanas generadas correctamente' });

            this.insideExists = true;
        } catch (error) {
            console.error('Error generating inside weeks:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron generar las semanas' });
        }
    }

    async saveChanges() {
        try {
            //await this.calendarioService.saveComponentesNotas(this.components);

            //this.originalList = structuredClone(this.components);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Componentes guardados correctamente' });
        } catch (error) {
            console.error('Error saving components:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los componentes' });
        }
    }

    private nextAvailableMonday(date: Date): Date {
        const today = this.minDate;

        // lunes de la semana de la fecha dada
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);

        const day = d.getDay(); // 0=domingo, 1=lunes...
        const offset = day === 0 ? -6 : 1 - day;

        const mondayOfWeek = new Date(d);
        mondayOfWeek.setDate(d.getDate() + offset);
        mondayOfWeek.setHours(0, 0, 0, 0);

        // si el lunes de esa semana aun no ha pasado, devolverlo
        if (mondayOfWeek >= today) {
            return mondayOfWeek;
        }

        // si ya paso, devolver el lunes siguiente a hoy
        const dayToday = today.getDay();
        const offsetNext = dayToday === 0 ? 1 : 8 - dayToday;

        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + offsetNext);
        nextMonday.setHours(0, 0, 0, 0);

        return nextMonday;
    }

    onChangeOutsideDate(date: Date) {
        this.fechaInicioOutside = this.nextAvailableMonday(date);

        this.messageService.add({
            severity: 'info',
            summary: 'Fecha seleccionada',
            detail: `Se ha seleccionado el lunes más cercano: ${this.fechaInicioOutside.toDateString()}`,
            life: 8000
        });

        this.onChangeOutsideNumber(this.outsideNSemanas);
    }

    onChangeOutsideNumber(value: number) {
        if (!this.fechaInicioOutside) return;
        let date = new Date(this.fechaInicioOutside);
        this.semanasOutside = [];

        for (let i = 0; i < this.outsideNSemanas; i++) {
            let fin = new Date(date);
            fin.setDate(fin.getDate() + 6);

            const semanas = this.semanasOutside.concat(this.semanasInside);
            
            const id = semanas.length > 0 ? Math.max(...semanas.map(s => s.calendariosemanalprogramaid)) + 1 : 1; // TODO: ELIMINAR CUANDO EL API ESTÉ LISTO
            const newSemana: CalendarioSemanalPrograma = {
                calendariosemanalprogramaid: id,
                anio: date.getFullYear(),
                numero_semana: i + 1,
                fecha_inicio: new Date(date),
                fecha_fin: new Date(fin), // DOMINGO DE LA SEMANA MÁS PROXIMA,
                programaid: TipoPrograma.OUTSIDECLASSROOM
            };

            // PARA CADA UNA, IR AUMENTANDO LA FECHA EN 7 DÍAS
            this.semanasOutside.push(newSemana);
            date.setDate(fin.getDate() + 1);
        }
    }

    onChangeInsideDate(date: Date) {
        this.fechaInicioInside = this.nextAvailableMonday(date);

        this.messageService.add({
            severity: 'info',
            summary: 'Fecha seleccionada',
            detail: `Se ha seleccionado el lunes más cercano: ${this.fechaInicioInside.toDateString()}`,
            life: 8000
        });

        this.onChangeInsideNumber(this.insideNSemanas);
    }

    onChangeInsideNumber(value: number) {
        if (!this.fechaInicioInside) return;
        let date = new Date(this.fechaInicioInside);
        this.semanasInside = [];
        
        for (let i = 0; i < this.insideNSemanas; i++) {
            let fin = new Date(date);
            fin.setDate(fin.getDate() + 6);

            const semanas = this.semanasInside.concat(this.semanasOutside);
            const id = semanas.length > 0 ? Math.max(...semanas.map(s => s.calendariosemanalprogramaid)) + 1 : 1; // TODO: ELIMINAR CUANDO EL API ESTÉ LISTO
            const newSemana: CalendarioSemanalPrograma = {
                calendariosemanalprogramaid: id,
                anio: date.getFullYear(),
                numero_semana: i + 1,
                fecha_inicio: new Date(date),
                fecha_fin: new Date(fin), // DOMINGO DE LA SEMANA MÁS PROXIMA,
                programaid: TipoPrograma.INSIDECLASSROOM
            };

            // PARA CADA UNA, IR AUMENTANDO LA FECHA EN 7 DÍAS
            this.semanasInside.push(newSemana);
            date.setDate(date.getDate() + 7);
        }
    }

    tipoPrograma(id: number): string {
        return getTipoProgramaName(id);
    }
}