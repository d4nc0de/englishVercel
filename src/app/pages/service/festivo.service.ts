import { Festivo } from '@/models/festivo';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FestivoService {
  async getAllFestivos(): Promise<Festivo[]> {
    return new Promise<Festivo[]>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyFestivos);
    });
  }

  async newFestivo(festivo: Festivo): Promise<Festivo> {
    return new Promise<Festivo>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(festivo);
    })
  }

  async updateSingleFestivo(festivoid: number, festivo: Festivo): Promise<Festivo> {
    return new Promise<Festivo>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(festivo);
    });
  }

  async deleteFestivo(festivoid: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });

  }
  async bulkDeleteFestivo(ids_festivo: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  private dummyFestivos: Festivo[] = [
    { festivoid: 1, fecha: new Date('2025-01-01'), nombre: 'Año Nuevo' },
    { festivoid: 2, fecha: new Date('2025-12-25'), nombre: 'Navidad' }
  ];
}
