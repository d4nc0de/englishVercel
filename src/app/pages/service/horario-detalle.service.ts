import { HorarioDetalle } from '@/models/horario-detalle';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HorarioDetalleService {
  async newHorarioDetalle(data: any): Promise<HorarioDetalle> {
    return new Promise<HorarioDetalle>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(data as HorarioDetalle);
    })
  }

  async updateHorarioDetalle(data: any): Promise<HorarioDetalle> {
    return new Promise<HorarioDetalle>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(data as HorarioDetalle);
    });
  }

  async getHorarioDetalleByHorario(horarioid: number): Promise<HorarioDetalle[]> {
    return new Promise<HorarioDetalle[]>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(this.dummyHorarioDetalles().filter(detalle => detalle.horarioid === horarioid));
    });
  }

  async deleteHorarioDetalle(horariodetalleid: number): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve();
    });
  }

  private dummyHorarioDetalles(): HorarioDetalle[] {
    return [
      { horariodetalleid: 1, dia_semana: 1, horarioid: 1, hora_inicio: "08:00", hora_fin: "09:00", unidades: 1 },
      { horariodetalleid: 7, dia_semana: 1, horarioid: 1, hora_inicio: "10:00", hora_fin: "11:00", unidades: 1 },
      { horariodetalleid: 2, dia_semana: 2, horarioid: 1, hora_inicio: "09:00", hora_fin: "10:00", unidades: 1 },
      { horariodetalleid: 3, dia_semana: 3, horarioid: 2, hora_inicio: "14:00", hora_fin: "15:00", unidades: 1 },
      { horariodetalleid: 4, dia_semana: 4, horarioid: 2, hora_inicio: "14:00", hora_fin: "15:00", unidades: 1 },
      { horariodetalleid: 5, dia_semana: 5, horarioid: 3, hora_inicio: "10:00", hora_fin: "11:00", unidades: 1 },
      { horariodetalleid: 6, dia_semana: 5, horarioid: 4, hora_inicio: "10:00", hora_fin: "11:00", unidades: 1 }
    ];
  }
}
