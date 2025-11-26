import { TipoJornada } from '@/enums/tipo-jornada';
import { Jornada } from '@/models/jornada';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JornadaService {
  async getAllJornadas(): Promise<Jornada[]> {
    return new Promise<Jornada[]>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(this.dummyJornadas());
    });
  }

  async getJornada(jornadaid: number): Promise<Jornada | null> {
    return new Promise<Jornada | null>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(this.dummyJornadas().find(j => j.jornadaid === jornadaid) ?? null);
    });
  }

  async newJornada(jornada: Jornada): Promise<Jornada> {
    return new Promise<Jornada>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(jornada);
    });
  }

  async updateSingleJornada(jornadaid: number, jornada: Jornada): Promise<Jornada> {
    return new Promise<Jornada>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(jornada);
    });
  }

  async bulkDeleteJornada(ids_jornada: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve();
    });
  }

  async deleteJornada(jornadaid: number): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve();
    });
  }

  private dummyJornadas(): Jornada[] {
    return [
      { jornadaid: 1, codigo: TipoJornada.MATUTINA, descripcion: 'Mañana' },
      { jornadaid: 2, codigo: TipoJornada.TARDE, descripcion: 'Tarde' },
      { jornadaid: 3, codigo: TipoJornada.MIXTA, descripcion: 'Mixta' }
    ];
  }
}
