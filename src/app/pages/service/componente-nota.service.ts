import { ComponenteNota } from '@/models/componente-nota';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponenteNotaService {
  async getAllComponentesNotas(): Promise<ComponenteNota[]> {
    return new Promise((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyComponents);
    });
  }

  async saveComponentesNotas(components: ComponenteNota[]): Promise<void> {
    return new Promise((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve();
    });
  }

  private dummyComponents: ComponenteNota[] = [
    { componentenotaid: 1, nombre: 'Examen Parcial', porcentaje: 30, activo: true },
    { componentenotaid: 2, nombre: 'Tareas', porcentaje: 20, activo: true },
    { componentenotaid: 3, nombre: 'Proyecto Final', porcentaje: 50, activo: true },
    { componentenotaid: 4, nombre: 'Inactivo', porcentaje: 100, activo: false }
  ];
}
