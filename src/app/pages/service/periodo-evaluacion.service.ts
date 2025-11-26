import { PeriodoEvaluacion } from '@/models/periodo-evaluacion';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeriodoEvaluacionService {
  async bulkDeletePeriodoEvaluacion(ids: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  async deletePeriodoEvaluacion(id: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  async getAllPeriodosEvaluacion(): Promise<PeriodoEvaluacion[]> {
    return new Promise<PeriodoEvaluacion[]>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyPeriodosEvaluacion());
    });
  }

  async newPeriodoEvaluacion(data: any): Promise<PeriodoEvaluacion> {
    return new Promise<PeriodoEvaluacion>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(data as PeriodoEvaluacion);
    });
  }

  async updateSinglePeriodoEvaluacion(id: number, data: any): Promise<PeriodoEvaluacion> {
    return new Promise<PeriodoEvaluacion>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(data as PeriodoEvaluacion);
    });
  }

  private dummyPeriodosEvaluacion(): PeriodoEvaluacion[] {
    return [
      { periodoevaluacionid: 1, nombre: 'Primer Periodo', fecha_inicio: new Date('2024-01-01'), fecha_fin: new Date('2024-03-31'), orden: 1 },
      { periodoevaluacionid: 2, nombre: 'Segundo Periodo', fecha_inicio: new Date('2024-04-01'), fecha_fin: new Date('2024-06-30'), orden: 2 },
      { periodoevaluacionid: 3, nombre: 'Tercer Periodo', fecha_inicio: new Date('2024-07-01'), fecha_fin: new Date('2024-09-30'), orden: 3 },
      { periodoevaluacionid: 4, nombre: 'Cuarto Periodo', fecha_inicio: new Date('2024-10-01'), fecha_fin: new Date('2024-12-31'), orden: 4 }
    ];
  }

}
