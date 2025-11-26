import { Sexo } from '@/enums/sexo';
import { TipoDocumento } from '@/enums/tipo-documento';
import { Estudiante } from '@/models/estudiante';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  async newEstudiante(estudiante: any): Promise<Estudiante> {
    return new Promise<Estudiante>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(estudiante as Estudiante);
    });
  }

  async getAllEstudiantes(): Promise<Estudiante[]> {
    return new Promise<Estudiante[]>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyEstudiantes());
    });
  }

  async updateSingleEstudiante(id: number, estudiante: any): Promise<Estudiante> {
    return new Promise<Estudiante>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(estudiante as Estudiante);
    });
  }

  async deleteEstudiante(id: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  async bulkDeleteEstudiante(ids: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API

      resolve();
    });
  }

  private dummyEstudiantes(): Estudiante[] {
    return [
      {
        estudianteid: 1,
        numero_documento: '12345678',
        nombres: 'Juan',
        apellidos: 'Pérez',
        fecha_nacimiento: new Date('2000-01-01'),
        sexo: Sexo.Masculino,
        activo: true,
        tipodocumentoid: TipoDocumento.CC,
        aulaid: 1
      },
      {
        estudianteid: 2,
        numero_documento: '87654321',
        nombres: 'Ana',
        apellidos: 'Gómez',
        fecha_nacimiento: new Date('2001-02-02'),
        sexo: Sexo.Femenino,
        activo: true,
        tipodocumentoid: TipoDocumento.CC,
        aulaid: 2
      },
      {
        estudianteid: 3,
        numero_documento: '11223344',
        nombres: 'Luis',
        apellidos: 'Martínez',
        fecha_nacimiento: new Date('2002-03-03'),
        sexo: Sexo.Masculino,
        activo: true,
        tipodocumentoid: TipoDocumento.CC,
        aulaid: 3
      },
      {
        estudianteid: 4,
        numero_documento: '44332211',
        nombres: 'María',
        apellidos: 'López',
        fecha_nacimiento: new Date('2003-04-04'),
        sexo: Sexo.Femenino,
        activo: true,
        tipodocumentoid: TipoDocumento.CC,
        aulaid: 4
      },

      // ----- NUEVOS ESTUDIANTES DEL MISMO AULA (aulaid: 1) -----

      {
        estudianteid: 5,
        numero_documento: '99887766',
        nombres: 'Carlos',
        apellidos: 'Ramírez',
        fecha_nacimiento: new Date('2001-05-10'),
        sexo: Sexo.Masculino,
        activo: true,
        tipodocumentoid: TipoDocumento.CC,
        aulaid: 1
      },
      {
        estudianteid: 6,
        numero_documento: '55443322',
        nombres: 'Valentina',
        apellidos: 'Hernández',
        fecha_nacimiento: new Date('2002-06-15'),
        sexo: Sexo.Femenino,
        activo: true,
        tipodocumentoid: TipoDocumento.CC,
        aulaid: 1
      },
      {
        estudianteid: 7,
        numero_documento: '66778899',
        nombres: 'Miguel',
        apellidos: 'Torres',
        fecha_nacimiento: new Date('2003-07-20'),
        sexo: Sexo.Masculino,
        activo: true,
        tipodocumentoid: TipoDocumento.CC,
        aulaid: 1
      }
    ]
  }


}
