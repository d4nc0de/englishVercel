import { HorarioCompleto } from '@/models/horario-completo';
import { Injectable } from '@angular/core';
import { JornadaService } from './jornada.service';
import { HorarioService } from './horario.service';
import { HorarioDetalleService } from './horario-detalle.service';
import { Jornada } from '@/models/jornada';

@Injectable({
  providedIn: 'root'
})
export class HorarioCompletoService {
  constructor(private jornadaService: JornadaService, private horarioService: HorarioService, private horarioDetalleService: HorarioDetalleService) { }

  async getAll(): Promise<HorarioCompleto[]> {
    return new Promise<HorarioCompleto[]>(async (resolve) => {
      const allJornadas = await this.jornadaService.getAllJornadas();
      const resultados: HorarioCompleto[] = [];
      for (const jornada of allJornadas) {
        try {
          const horarioCompleto = await this.getHorarioCompletoByJornada(jornada);
          resultados.push(horarioCompleto);
        } catch (error) {
          console.error(`Error fetching horario completo for jornada id ${jornada.jornadaid}:`, error);
        }
      }
      resolve(resultados);
    });
  }

  async getHorarioCompletoByJornadaId(jornadaid: number): Promise<HorarioCompleto> {
    return new Promise<HorarioCompleto>(async (resolve, rej) => {
      try {
        const jornada = await this.jornadaService.getJornada(jornadaid);
        if (jornada === null) return rej('No jornada found with the given id');

        const horarios = await this.horarioService.getHorariosByJornada(jornada.jornadaid);
        if (horarios === null) return rej('No horarios found for the given jornada');

        const horariosConDetalles = await Promise.all(horarios.map(async (horario) => {
          const detalles = await this.horarioDetalleService.getHorarioDetalleByHorario(horario.horarioid);
          return { horario, detalles };
        }));

        resolve({
          jornada: jornada,
          horarios: horariosConDetalles
        })
      } catch (error) {
        console.error('Error fetching horario completo:', error);
      }
    });
  }

  async getHorarioCompletoByJornada(jornada: Jornada): Promise<HorarioCompleto> {
    return new Promise<HorarioCompleto>(async (resolve, rej) => {
      try {
        const horarios = await this.horarioService.getHorariosByJornada(jornada.jornadaid);
        if (horarios === null) return rej('No horarios found for the given jornada');

        const horariosConDetalles = await Promise.all(horarios.map(async (horario) => {
          const detalles = await this.horarioDetalleService.getHorarioDetalleByHorario(horario.horarioid);
          return { horario, detalles };
        }));

        resolve({
          jornada: jornada,
          horarios: horariosConDetalles
        })
      } catch (error) {
        console.error('Error fetching horario completo:', error);
      }
    });
  }
}