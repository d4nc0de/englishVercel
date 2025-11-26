import { Tutor } from '@/models/tutor';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  async newTutor(data: any): Promise<Tutor> {
    return new Promise<Tutor>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(data as Tutor);
    });
  }

  async getAllTutores(): Promise<Tutor[]> {
    return new Promise<Tutor[]>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(this.dummyTutores());
    })
  };

  async updateSingleTutor(tutorid: number, data: any): Promise<Tutor> {
    return new Promise<Tutor>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      let sede: Tutor = {
        tutorid: tutorid,
        ...data
      }
      resolve(sede);
    });
  }

  async deleteTutor(tutorid: number): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve();
    });
  }

  async bulkDeleteTutor(ids_tutor: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve();
    });
  }

  async getTutorByPersona(personaid: number): Promise<Tutor | null> {
    const tutores = await this.getAllTutores();
    return tutores.find(t => t.personaid === personaid) || null;
  }


  private dummyTutores(): Tutor[] {
    return [
      { tutorid: 1, personaid: 2 },
      { tutorid: 2, personaid: 4 },
      { tutorid: 3, personaid: 7 },
      { tutorid: 4, personaid: 8 },
      { tutorid: 5, personaid: 9 }
    ];
  }
}
