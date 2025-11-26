import { RazonClase } from '@/models/razon-clase';
import { RazonEstudiante } from '@/models/razon-estudiante';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RazonService {
  async getAllEstudiantes(): Promise<RazonEstudiante[]> {
    return new Promise<RazonEstudiante[]>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyRazonesEstudiantes);
    });
  }

  async getAllClases(): Promise<RazonClase[]> {
    return new Promise<RazonClase[]>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyRazonesClases);
    });
  }

  async newRazonEstudiante(razon: RazonEstudiante): Promise<RazonEstudiante> {
    return new Promise<RazonEstudiante>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(razon);
    });
  }

  async newRazonClase(razon: RazonClase): Promise<RazonClase> {
    return new Promise<RazonClase>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(razon);
    });
  }

  async updateSingleRazonEstudiante(motivoinasistenciaestudianteid: number, data: any): Promise<RazonEstudiante> {
    return new Promise<RazonEstudiante>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve({
        motivoinasistenciaestudianteid: motivoinasistenciaestudianteid,
        ...data
      } as RazonEstudiante);
    });
  }

  async updateSingleRazonClase(motivonoclaseid: number, data: any): Promise<RazonClase> {
    return new Promise<RazonClase>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve({
        motivonoclaseid: motivonoclaseid,
        ...data
      } as RazonClase);
    });
  }

  async deleteRazonEstudiante(motivoinasistenciaestudianteid: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  async deleteRazonClase(motivonoclaseid: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  async bulkDeleteRazones(idsEstudiantes: number[], idsClases: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL APIs
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  private dummyRazonesEstudiantes: RazonEstudiante[] = [
    {
      motivoinasistenciaestudianteid: 1,
      codigo: 'RAZ001',
      descripcion: 'Enfermedad'
    },
    {
      motivoinasistenciaestudianteid: 2,
      codigo: 'RAZ002',
      descripcion: 'Problemas familiares'
    }
  ];

  private dummyRazonesClases: RazonClase[] = [
    {
      motivonoclaseid: 1,
      codigo: 'CL001',
      descripcion: 'Mantenimiento del aula',
      permite_reposicion: true
    },
    {
      motivonoclaseid: 2,
      codigo: 'CL002',
      descripcion: 'Falta de profesor',
      permite_reposicion: false
    }
  ]
}
