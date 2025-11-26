import { CalendarioSemanalPrograma } from '@/models/calendario-semana-programa';
import { SesionClase } from '@/models/sesion-clase';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SesionClaseService {
  async getSesionClaseBySemana(semana: CalendarioSemanalPrograma, dia_semana: number): Promise<SesionClase | null> {
    return new Promise<SesionClase | null>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummySesionesClases().find(s =>
        s.calendariosemanalprogramaid === semana.calendariosemanalprogramaid &&
        s.dia_semana === dia_semana) ?? null);
    });
  }

  async createSesionClase(data: any): Promise<SesionClase> {
    return new Promise<SesionClase>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(data as SesionClase);
    });
  }

  async updateSesionClase(sesionclaseid: number, data: any): Promise<SesionClase> {
    return new Promise<SesionClase>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(data as SesionClase);
    })
  }

  private dummySesionesClases(): SesionClase[] {
    return [
      {
        sesionclaseid: 1,
        fecha_real: new Date(),
        dia_semana: 1,
        hora_inicio: new Date(),
        hora_fin: new Date(),
        clase_dictada: true,
        minutos_dictados: 60,
        es_reposicion: false,
        estado: 'activo',
        tutorid: 1,
        aulaid: 1,
        calendariosemanalprogramaid: 1
      }
    ];
  }
}
