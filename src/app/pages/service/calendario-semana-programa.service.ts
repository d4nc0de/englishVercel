import { TipoPrograma } from '@/enums/tipo-programa';
import { CalendarioSemanalPrograma } from '@/models/calendario-semana-programa';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarioSemanaProgramaService {

  async getSemanasPorPrograma(programaid: TipoPrograma): Promise<CalendarioSemanalPrograma[]> {
    return new Promise((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      const semanas = this.dummySemanas.filter(semana => semana.programaid === programaid);
      resolve(semanas);
    });
  }

  async getSemanaByDate(date: Date, programaid: TipoPrograma): Promise<CalendarioSemanalPrograma | null> {
    return new Promise(async (resolve) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      const semanas = await this.getSemanasPorPrograma(programaid);

      resolve(semanas.find(semana => {
        return semana.programaid === programaid &&
          date >= semana.fecha_inicio &&
          date <= semana.fecha_fin
      }) || null);
    })
  }

  async createSemanas(semanas: CalendarioSemanalPrograma[]): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  private dummySemanas: CalendarioSemanalPrograma[] = [
    { calendariosemanalprogramaid: 1, anio: 2024, numero_semana: 1, fecha_inicio: new Date('2025-11-24'), fecha_fin: new Date('2025-11-30'), programaid: TipoPrograma.OUTSIDECLASSROOM },
    { calendariosemanalprogramaid: 2, anio: 2024, numero_semana: 2, fecha_inicio: new Date('2025-12-01'), fecha_fin: new Date('2025-12-07'), programaid: TipoPrograma.OUTSIDECLASSROOM },
    /* { calendariosemanalprogramaid: 3, anio: 2024, numero_semana: 1, fecha_inicio: new Date('2024-01-15'), fecha_fin: new Date('2024-01-21'), programaid: TipoPrograma.INSIDECLASSROOM }, */
  ]
}
