// src/app/pages/service/institucion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Institucion } from '@/models/institucion';

// export interface Institucion {
//   institucionid: number;
//   codigo: string;
//   nombre: string;
//   direccion?: string | null;
//   // agrega aquí otros campos si tu API los maneja
// }

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {
  private baseUrl = `${environment.apiBaseUrl}/Institucion`;
  // si en environment ya tienes /api, déjalo así

  constructor(private http: HttpClient) {}

  async getAllInstituciones(): Promise<Institucion[]> {
    return new Promise<Institucion[]>((resolve, reject) => {
      this.http
        .get(`${this.baseUrl}/ObtenerInstituciones`, { responseType: 'text' })
        .subscribe({
          next: (resp) => {
            try {
              resolve(JSON.parse(resp));
            } catch {
              resolve([]);
            }
          },
          error: (err) => reject(err)
        });
    });
  }

  async getSingleInstitucion(id: number): Promise<Institucion> {
    return new Promise<Institucion>((resolve, reject) => {
      this.http
        .get(`${this.baseUrl}/ObtenerInstitucionesById/${id}`, { responseType: 'text' })
        .subscribe({
          next: (resp) => resolve(JSON.parse(resp)),
          error: (err) => reject(err)
        });
    });
  }

  async newInstitucion(body: Institucion): Promise<Institucion> {
    return new Promise<Institucion>((resolve, reject) => {
      this.http
        .post(`${this.baseUrl}/CrearInstitucion`, body, { responseType: 'text' })
        .subscribe({
          next: (resp) => resolve(JSON.parse(resp)),
          error: (err) => reject(err)
        });
    });
  }

  async updateSingleInstitucion(id: number, body: Institucion): Promise<Institucion> {
    return new Promise<Institucion>((resolve, reject) => {
      this.http
        .put(`${this.baseUrl}/ActualizarInstitucion/${id}`, body, { responseType: 'text' })
        .subscribe({
          next: (resp) => resolve(JSON.parse(resp)),
          error: (err) => reject(err)
        });
    });
  }

  async deleteInstitucion(id: number): Promise<void> {
    // Ojo: en Swagger el DELETE está raro: InactivarAula/{id},
    // pero lo usamos tal cual.
    return new Promise<void>((resolve, reject) => {
      this.http
        .delete(`${this.baseUrl}/InactivarAula/${id}`, { responseType: 'text' })
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });
  }

  async bulkDeleteInstitucion(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.deleteInstitucion(id);
    }
  }
}
