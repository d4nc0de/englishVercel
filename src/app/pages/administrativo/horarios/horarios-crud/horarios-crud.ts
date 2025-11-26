import { DiaSemana, getDiaSemanaName } from '@/enums/dia-semana';
import { TipoJornada } from '@/enums/tipo-jornada';
import { HorarioCompleto } from '@/models/horario-completo';
import { HorarioDetalle, isValidTime, TimeString, timeStringToMinutes } from '@/models/horario-detalle';
import { HorarioCompletoService } from '@/pages/service/horario-completo.service';
import { HorarioDetalleService } from '@/pages/service/horario-detalle.service';
import { HorarioService } from '@/pages/service/horario.service';
import { getEnumsLabels } from '@/utils/enums-labels';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ObjectUtils } from 'primeng/utils';
import { AulaHorarioHistoricoService } from '@/pages/service/aula-horario-historico.service';
import { AulaService } from '@/pages/service/aula.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-horarios-crud',
    standalone: true,
    imports: [CommonModule, ToastModule, SelectModule, FormsModule, TableModule, ButtonModule, InputTextModule, InputNumberModule],
    providers: [MessageService],
    templateUrl: './horarios-crud.html',
})

export class HorariosCrud {
    horarioChangeReason: string = '';
    needJornadaHistory: boolean = false;

    minutos_por_unidad = [40, 45, 50, 55, 60];
    expandedRows: expandedRows = {};
    isExpanded: boolean = false;

    allHorarios: HorarioCompleto[] = [];
    selectedHorarioCompleto: HorarioCompleto | null = null;
    selectedDetalles: HorarioDetalle[] = [];

    horarioMinutosSelected: number | null = null;
    horarioDescripcion: string = '';

    detalleIdHorario: number | null = null;
    detalleDiaSemana: string | null = null;
    detalleHoraInicio: TimeString | null = null;
    detalleUnidades: number | null = null;

    adminIdDetalle: number | null = null;
    adminIdHorario: number | null = null;

    diasSemana: { label: string; value: string }[] = [];

    horaInicioValida: TimeString = '06:00';
    horaFinValida: TimeString = '18:00';

    constructor(private AulaHorarioHistoricoService: AulaHorarioHistoricoService, private aulaService: AulaService, private horarioDetalleService: HorarioDetalleService, private horarioService: HorarioService, private horarioCompletoService: HorarioCompletoService, private messageService: MessageService) {
        this.diasSemana = getEnumsLabels(DiaSemana, getDiaSemanaName).splice(0, 6);
    }

    successMessage(summary: string, detail: string) {
        this.messageService.add({ severity: 'success', summary: summary, detail: detail });
    }

    errorMessage(summary: string, detail: string) {
        this.messageService.add({ severity: 'error', summary: summary, detail: detail });
    }

    loadHorarioInfo() {
        if (this.adminIdHorario === null) return;

        const selectedHorario = this.selectedHorarioCompleto?.horarios.find(
            h => h.horario.horarioid === this.adminIdHorario
        )?.horario;

        this.horarioMinutosSelected = selectedHorario?.minutos_por_unidad ?? null;
        this.horarioDescripcion = selectedHorario?.descripcion ?? '';
    }
    loadDetalleInfo() {
        if (this.adminIdDetalle === null) return;

        const selectedDetalle = this.selectedHorarioCompleto?.horarios
            .find(h => h.horario.horarioid === this.detalleIdHorario)?.detalles
            .find(d => d.horariodetalleid === this.adminIdDetalle);

        this.detalleDiaSemana = String(selectedDetalle?.dia_semana) ?? null;
        this.detalleHoraInicio = selectedDetalle?.hora_inicio ?? null;
    }

    updateAvailableDetalles() {
        if (!this.selectedHorarioCompleto || this.detalleIdHorario == null) {
            this.selectedDetalles = [];
            return;
        }

        // actualizar rangos validos
        switch (this.selectedHorarioCompleto.jornada.codigo) {
            case TipoJornada.MATUTINA:
                this.horaInicioValida = '06:00';
                this.horaFinValida = '14:00';
                break;

            case TipoJornada.TARDE:
                this.horaInicioValida = '14:00';
                this.horaFinValida = '18:00';
                break;

            default:
                this.horaInicioValida = '06:00';
                this.horaFinValida = '18:00';
                break;
        }


        this.selectedDetalles = this.selectedHorarioCompleto.horarios.find(
            h => h.horario.horarioid === this.detalleIdHorario
        )?.detalles ?? [];
    }

    private getHoraFin(unidades: number, horaInicio: TimeString, minutosPorUnidad: number): TimeString {
        const duracionTotal = unidades * minutosPorUnidad

        const [hStr, mStr] = horaInicio.split(':')
        let horas = parseInt(hStr, 10)
        let minutos = parseInt(mStr, 10)

        // sumar los minutos totales
        minutos += duracionTotal

        // normalizar
        horas += Math.floor(minutos / 60)
        minutos = minutos % 60

        // formatear HH:MM
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}` as TimeString;
    }

    private overlaps(): boolean {
        if (!this.selectedHorarioCompleto || this.detalleIdHorario == null) {
            return false;
        }

        const detalles = this.selectedHorarioCompleto.horarios.find(
            h => h.horario.horarioid === this.detalleIdHorario
        )?.detalles ?? [];

        const newInicio = this.detalleHoraInicio as TimeString;
        const newFin = this.getHoraFin(
            Number(this.detalleUnidades),
            newInicio,
            this.selectedHorarioCompleto.horarios.find(
                h => h.horario.horarioid === this.detalleIdHorario
            )?.horario.minutos_por_unidad as number
        );

        const newInicioMinutes = timeStringToMinutes(newInicio);
        const newFinMinutes = timeStringToMinutes(newFin);

        for (let detalle of detalles) {
            if (this.adminIdDetalle !== null && detalle.horariodetalleid === this.adminIdDetalle) {
                continue; // saltar el detalle que se está editando
            }
            if (detalle.dia_semana === Number(this.detalleDiaSemana)) {
                const existingInicio = timeStringToMinutes(detalle.hora_inicio);
                const existingFin = timeStringToMinutes(detalle.hora_fin);
                if (!(newFinMinutes <= existingInicio || newInicioMinutes >= existingFin)) {
                    return true; // hay superposición
                }
            }
        }
        return false;
    }

    private isInRange(
        hora: TimeString,
        inicio: TimeString,
        fin: TimeString
    ): boolean {
        const h = timeStringToMinutes(hora)
        const i = timeStringToMinutes(inicio)
        const f = timeStringToMinutes(fin)

        return h >= i && h <= f
    }

    async manageDetalle() {
        let horario = this.selectedHorarioCompleto?.horarios.find(
            h => h.horario.horarioid === this.detalleIdHorario
        )?.horario;

        if (!this.detalleValid() || !this.selectedHorarioCompleto || !horario) {
            this.errorMessage('Formulario inválido', 'Complete los campos requeridos.');
            return;
        }

        if (this.overlaps()) {
            this.errorMessage('Horario inválido', 'El detalle se superpone con otro existente.');
            return;
        }

        const horaFinal = this.getHoraFin(
            Number(this.detalleUnidades),
            this.detalleHoraInicio as TimeString,
            horario?.minutos_por_unidad as number
        );

        if (!this.isInRange(horaFinal, this.horaInicioValida, this.horaFinValida)) {
            this.errorMessage('Horario inválido', `El horario final ${horaFinal} está fuera del rango permitido (${this.horaInicioValida} - ${this.horaFinValida}).`);
            return;
        }

        if (!this.isInRange(this.detalleHoraInicio as TimeString, this.horaInicioValida, this.horaFinValida)) {
            this.errorMessage('Horario inválido', `El horario de inicio ${this.detalleHoraInicio} está fuera del rango permitido (${this.horaInicioValida} - ${this.horaFinValida}).`);
            return;
        }

        if (this.adminIdDetalle !== null) {
            // EDITAR DETALLE

            try {
                const detalleApi = await this.horarioDetalleService.updateHorarioDetalle({
                    horariodetalleid: this.adminIdDetalle,
                    horarioid: this.detalleIdHorario as number,
                    dia_semana: Number(this.detalleDiaSemana),
                    hora_inicio: this.detalleHoraInicio,
                    hora_fin: horaFinal,
                    unidades: Number(this.detalleUnidades)
                });

                // ACTUALIZAR VISTA
                this.selectedHorarioCompleto = {
                    ...this.selectedHorarioCompleto,
                    horarios: this.selectedHorarioCompleto.horarios.map(h => {
                        if (h.horario.horarioid === this.detalleIdHorario) {
                            return {
                                ...h,
                                detalles: h.detalles.map(d => {
                                    if (d.horariodetalleid === this.adminIdDetalle) {
                                        return detalleApi;
                                    }
                                    return d;
                                })
                            };
                        }
                        return h;
                    })
                };
            } catch (error) {
                this.errorMessage('Error al actualizar detalle', 'No se pudo editar el detalle.');
                return;
            }

        } else {
            // NUEVO DETALLE
            try {
                const detalleApi = await this.horarioDetalleService.newHorarioDetalle({
                    horariodetalleid: this.allHorarios.length > 0 ? Math.max(
                        ...this.allHorarios.flatMap(h => h.horarios).flatMap(hor => hor.detalles).map(d => d.horariodetalleid) ?? [0]
                    ) + 1 : 1, // TODO: Simulación de ID
                    horarioid: this.detalleIdHorario as number,
                    dia_semana: Number(this.detalleDiaSemana),
                    hora_inicio: this.detalleHoraInicio,
                    hora_fin: horaFinal,
                    unidades: Number(this.detalleUnidades)
                });

                // ACTUALIZAR VISTA
                this.selectedHorarioCompleto = {
                    ...this.selectedHorarioCompleto,
                    horarios: this.selectedHorarioCompleto.horarios.map(h => {
                        if (h.horario.horarioid === this.detalleIdHorario) {
                            return {
                                ...h,
                                detalles: [...h.detalles, detalleApi]
                            };
                        }
                        return h;
                    })
                };

                this.successMessage('Detalle creado', 'El nuevo detalle ha sido creado correctamente.');
            } catch (error) {
                this.errorMessage('Error al crear detalle', 'No se pudo crear el nuevo detalle.');
                return;
            }
        }
    }

    async manageHorario() {
        if (!this.horarioValid() || !this.selectedHorarioCompleto) {
            this.errorMessage('Formulario inválido', 'Complete los campos requeridos.');
            return;
        }

        if (this.adminIdHorario !== null) {
            // EDITAR HORARIO
            try {
                let i = this.selectedHorarioCompleto.horarios.findIndex(
                    h => h.horario.horarioid === this.adminIdHorario
                );

                const horarioApi = await this.horarioService.updateHorario({
                    horarioid: this.adminIdHorario,
                    minutos_por_unidad: this.horarioMinutosSelected as number,
                    descripcion: this.horarioDescripcion,
                    jornadaid: this.selectedHorarioCompleto.jornada.jornadaid as number
                });

                // ACTUALIZAR VISTA
                if (i !== undefined && i !== -1) {
                    const updatedHorarios = [...this.selectedHorarioCompleto.horarios];
                    updatedHorarios[i] = {
                        ...updatedHorarios[i],
                        horario: horarioApi
                    };
                    this.selectedHorarioCompleto = {
                        ...this.selectedHorarioCompleto,
                        horarios: updatedHorarios
                    };
                }
            } catch (error) {
                this.errorMessage('Error al actualizar horario', 'No se pudo editar el horario.');
                return;
            }
        } else {
            // NUEVO HORARIO
            try {
                const horarioApi = await this.horarioService.newHorario({
                    horarioid: this.allHorarios.length > 0 ? Math.max(
                        ...this.allHorarios.map(h => h.horarios.map(hor => hor.horario.horarioid)).flat() ?? [0]
                    ) + 1 : 1, // TODO: Simulación de ID
                    minutos_por_unidad: this.horarioMinutosSelected as number,
                    descripcion: this.horarioDescripcion,
                    jornadaid: this.selectedHorarioCompleto.jornada.jornadaid as number
                });

                // ACTUALIZAR VISTA
                this.selectedHorarioCompleto = {
                    jornada: this.selectedHorarioCompleto.jornada,
                    horarios: [...this.selectedHorarioCompleto?.horarios!, { horario: horarioApi, detalles: [] }]
                }

                await this.loadAllHorarios();

                this.successMessage('Horario creado', 'El nuevo horario ha sido creado correctamente.');
            } catch (error) {
                this.errorMessage('Error al crear horario', 'No se pudo crear el nuevo horario.');
                return;
            }
        }
    }

    async deleteHorario() {
        try {
            await this.horarioService.deleteHorario(this.adminIdHorario as number);
            // ACTUALIZAR VISTA
            this.selectedHorarioCompleto = {
                ...this.selectedHorarioCompleto!,
                horarios: this.selectedHorarioCompleto!.horarios.filter(
                    h => h.horario.horarioid !== this.adminIdHorario
                )
            };

        } catch (error) {
            this.errorMessage('Error al eliminar horario', 'No se pudo eliminar el horario.');
            return;
        }
    }
    async deleteDetalle() {
        try {
            await this.horarioDetalleService.deleteHorarioDetalle(this.adminIdDetalle as number);

            // ACTUALIZAR VISTA
            this.selectedHorarioCompleto = {
                ...this.selectedHorarioCompleto!,
                horarios: this.selectedHorarioCompleto!.horarios.map(h => {
                    if (h.horario.horarioid === this.detalleIdHorario) {
                        return {
                            ...h,
                            detalles: h.detalles.filter(d => d.horariodetalleid !== this.adminIdDetalle)
                        };
                    }
                    return h;
                })
            };
        } catch (error) {
            this.errorMessage('Error al eliminar detalle', 'No se pudo eliminar el detalle.');
            return;
        }
    }

    horarioValid(): boolean {
        if (!this.selectedHorarioCompleto) return false;
        if (this.horarioMinutosSelected === null) return false;
        if (this.horarioChangeReason.trim().length === 0 && this.adminIdHorario) return false;
        return true;
    }

    detalleValidDelete(): boolean {
        if (!this.selectedHorarioCompleto) return false;
        if (this.detalleIdHorario === null) return false;
        if (this.detalleDiaSemana === null) return false;
        if (this.detalleHoraInicio === null || !isValidTime(this.detalleHoraInicio)) return false;
        if (this.horarioChangeReason.trim().length === 0 && this.adminIdDetalle) return false;
        return true;
    }

    detalleValid(): boolean {
        if (!this.selectedHorarioCompleto) return false;
        if (this.detalleIdHorario === null) return false;
        if (this.detalleDiaSemana === null) return false;
        if (this.detalleHoraInicio === null || !isValidTime(this.detalleHoraInicio)) return false;
        if (this.detalleUnidades === null || isNaN(Number(this.detalleUnidades))) return false;
        if (this.horarioChangeReason.trim().length === 0 && this.adminIdDetalle) return false;
        return true;
    }

    async ngOnInit() {
        await this.loadAllHorarios();
    }

    private async loadAllHorarios() {
        this.allHorarios = await this.horarioCompletoService.getAll();

        this.allHorarios = this.allHorarios.map(h => ({
            ...h,
            label: `Jornada #${h.jornada.jornadaid} — ${h.jornada.descripcion ?? "Sin descripción"}`
        }));
    }


    expandAll() {
        if (ObjectUtils.isEmpty(this.expandedRows)) {
            const rows = this.selectedHorarioCompleto?.horarios ?? [];
            this.expandedRows = rows.reduce(
                (acc, p) => {
                    const id = (p as any)?.horario?.horarioid ?? (p as any)?.horarioid;
                    if (id !== undefined && id !== null) {
                        acc[id] = true;
                    }
                    return acc;
                },
                {} as { [key: string]: boolean }
            );
            this.isExpanded = true;
        } else {
            this.collapseAll();
        }

    }

    collapseAll() {
        this.expandedRows = {};
        this.isExpanded = false;
    }

    humanDay(value: any) {
        return getDiaSemanaName(Number(value));
    }

    async createHistory() {
        let aula = (await this.aulaService.getAllAulas()).find(a => this.selectedHorarioCompleto?.jornada.jornadaid === a.jornadaid);
        if(!aula) return
        let allHistories = await this.AulaHorarioHistoricoService.getAll();
        let existingHistory = await this.AulaHorarioHistoricoService.getActual(aula.aulaid);
        
        await this.AulaHorarioHistoricoService.updateAulaHorarioHistory(existingHistory.aulajornadahistoricoid, {
            fecha_fin: new Date(),
            motivo_cambio: this.horarioChangeReason
        });

        await this.AulaHorarioHistoricoService.createAulaHorarioHistory({
            aulajornadahistoricoid: allHistories.length > 0 ? Math.max(...allHistories.map(h => h.aulajornadahistoricoid)) + 1 : 1, // TODO: Eliminar cuando el API esté listo
            aulaid: aula.aulaid,
            jornadaid: this.selectedHorarioCompleto?.jornada.jornadaid,
            fecha_inicio: new Date(),
            motivo_cambio: this.horarioChangeReason
        });

        this.horarioChangeReason = '';
    }

}