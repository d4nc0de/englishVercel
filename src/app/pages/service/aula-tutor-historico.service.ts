import { AulaTutor } from '@/models/historicos/aula-tutor';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AulaTutorHistoricoService {
  async getAll(): Promise<AulaTutor[]> {
    return new Promise<AulaTutor[]>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyAulaTutors());
    });
  }

  async getActual(aulaid: number): Promise<AulaTutor> {
    return new Promise<AulaTutor>((resolve, reject) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      const historial = this.dummyAulaTutors().find(at => at.aulaid === aulaid && !at.fecha_fin);

      resolve(historial!)
    });
  }

  async updateAulaTutorHistory(aulatutorhistoricoid: number, data: any): Promise<AulaTutor> {
    return new Promise<AulaTutor>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve({
        aulatutorhistoricoid: aulatutorhistoricoid,
        ...data
      })
    });
  }

  async createAulaTutorHistory(data: any): Promise<any> {
    return new Promise<any>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(data);
    });
  }

  private dummyAulaTutors(): AulaTutor[] {
    return [
      {
        aulatutorhistoricoid: 1,
        fecha_inicio: new Date('2023-01-01'),
        motivo_cambio: 'Tutor inicial',
        tutorid: 1,
        aulaid: 1
      },
      {
        aulatutorhistoricoid: 2,
        fecha_inicio: new Date('2023-06-01'),
        motivo_cambio: 'Tutor inicial',
        tutorid: 2,
        aulaid: 2
      },
      {
        aulatutorhistoricoid: 3,
        fecha_inicio: new Date('2023-03-15'),
        motivo_cambio: 'Tutor inicial',
        tutorid: 3,
        aulaid: 3
      },
      {
        aulatutorhistoricoid: 4,
        fecha_inicio: new Date('2023-09-10'),
        motivo_cambio: 'Tutor inicial',
        tutorid: 4,
        aulaid: 4
      },
      {
        aulatutorhistoricoid: 5,
        fecha_inicio: new Date('2023-05-20'),
        motivo_cambio: 'Tutor inicial',
        tutorid: 5,
        aulaid: 5
      }
    ];
  }
}