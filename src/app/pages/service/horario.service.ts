import { Horario } from '@/models/horario';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  async newHorario(data: any): Promise<Horario> {
    return new Promise<Horario>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(data as Horario);
    });
  }

  async updateHorario(data: any): Promise<Horario> {
    return new Promise<Horario>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(data as Horario);
    });
  }

  async getHorariosByJornada(jornadaid: number): Promise<Horario[] | null> {
    return new Promise<Horario[] | null>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyHorarios().filter(h => h.jornadaid === jornadaid) ?? null);
    });
  }

  async deleteHorario(horarioid: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  private dummyHorarios() {
    return [
      { horarioid: 1, minutos_por_unidad: 40, jornadaid: 1 },
      { horarioid: 2, minutos_por_unidad: 45, jornadaid: 2 },
      { horarioid: 3, minutos_por_unidad: 50, jornadaid: 3 },
      { horarioid: 4, minutos_por_unidad: 55, jornadaid: 1 },
    ];
  }
}
