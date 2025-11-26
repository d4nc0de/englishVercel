import { AsistenciaEstudiante } from '@/models/asistencia-estudiante';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaEstudianteService {
  async getAllAsistenciasEstudiantes(): Promise<AsistenciaEstudiante[]> {
    return new Promise<AsistenciaEstudiante[]>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(this.dummyAsistenciasEstudiantes());
    });
  }

  async getAsistenciasBySesionClase(sesionclaseid: number): Promise<AsistenciaEstudiante[]> {
    const asistencias = await this.getAllAsistenciasEstudiantes();
    return asistencias.filter(a => a.sesionclaseid === sesionclaseid);
  }

  async bulkUpdateAsistenciasEstudiantes(asistencias: AsistenciaEstudiante[]): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const nuevas = asistencias.filter(a => !a.asistenciaestudianteid || a.asistenciaestudianteid === 0);

      try {
        await this.bulkCreateAsistenciasEstudiantes(nuevas);
      } catch (error) {
        console.log("error al crear asistencias nuevas");
      }

      const existentes = asistencias.filter(a => a.asistenciaestudianteid && a.asistenciaestudianteid > 0);

      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  async bulkCreateAsistenciasEstudiantes(asistencias: AsistenciaEstudiante[]): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    })
  }

  private dummyAsistenciasEstudiantes(): AsistenciaEstudiante[] {
    return [
      {
        asistenciaestudianteid: 1,
        asistio: false,
        justificada: false,
        estado: 'activo',
        sesionclaseid: 1,
        estudianteid: 1,
        motivoinasistenciaestudianteid: 1
      }
    ];
  }
}
