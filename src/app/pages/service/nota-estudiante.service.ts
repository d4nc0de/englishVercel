import { Injectable } from '@angular/core';
import { NotaEstudiante } from '@/models/nota-estudiante';

@Injectable({
    providedIn: 'root'
})
export class NotaEstudianteService {
    async getNotasEstudiante(estudianteid: number): Promise<NotaEstudiante[]> {
        return new Promise((resolve) => {
            // TODO: CALL API
            console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

            resolve(this.dummyNotas().filter(n => n.estudianteid === estudianteid));
        });
    }

    async bulkDeleteNotaEstudiante(ids_nota: number[]): Promise<void> {
        return new Promise<void>((resolve) => {
            // TODO: CALL API
            console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

            resolve();
        });
    }

    async deleteNotaEstudiante(notaid: number): Promise<void> {
        return new Promise<void>((resolve) => {
            // TODO: CALL API
            console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
            resolve();
        });
    }

    async newNotaEstudiante(nota: NotaEstudiante): Promise<NotaEstudiante> {
        return new Promise<NotaEstudiante>((resolve) => {
            // TODO: CALL API
            console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

            resolve(nota);
        });
    }

    async updateSingleNotaEstudiante(notaid: number, nota: NotaEstudiante): Promise<NotaEstudiante> {
        return new Promise<NotaEstudiante>((resolve) => {
            // TODO: CALL API
            console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

            resolve(nota);
        });
    }

    private dummyNotas(): NotaEstudiante[] {
        return [
            { notaid: 1, valor: 85, fecha_registro: new Date(), estado: 'activo', estudianteid: 1, componentenotaid: 1, periodoevaluacionid: 1, tutorid: 1 },
            { notaid: 2, valor: 90, fecha_registro: new Date(), estado: 'activo', estudianteid: 1, componentenotaid: 2, periodoevaluacionid: 1, tutorid: 1 },
            { notaid: 3, valor: 78, fecha_registro: new Date(), estado: 'activo', estudianteid: 2, componentenotaid: 1, periodoevaluacionid: 1, tutorid: 1 },
            { notaid: 4, valor: 88, fecha_registro: new Date(), estado: 'activo', estudianteid: 2, componentenotaid: 2, periodoevaluacionid: 1, tutorid: 1 },
        ]
    }
}
