// src/app/pages/service/aula.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Aula } from '@/models/aula';

// export interface Aula {
//   aulaid: number;
//   codigo: string;
//   nombre: string;
//   descripcion?: string | null;
//   // agrega aquí otros campos si tu API los maneja
// }

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  private baseUrl = `${environment.apiBaseUrl}/Aula`;
  // si en el env ya tienes /api incluído, déjalo así

  constructor(private http: HttpClient) {}

  async getAllAulas(): Promise<Aula[]> {
    return new Promise<Aula[]>((resolve, reject) => {
      this.http
        .get(`${this.baseUrl}/ObtenerAulasActivas`, { responseType: 'text' })
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

  async getSingleAula(id: number): Promise<Aula> {
    return new Promise<Aula>((resolve, reject) => {
      this.http
        .get(`${this.baseUrl}/ObtenerAulaPorId/${id}`, { responseType: 'text' })
        .subscribe({
          next: (resp) => resolve(JSON.parse(resp)),
          error: (err) => reject(err)
        });
    });
  }

  async newAula(body: Aula): Promise<Aula> {
    return new Promise<Aula>((resolve, reject) => {
      this.http
        .post(`${this.baseUrl}/CrearAula`, body, { responseType: 'text' })
        .subscribe({
          next: (resp) => resolve(JSON.parse(resp)),
          error: (err) => reject(err)
        });
    });
  }

  async updateSingleAula(id: number, body: Aula): Promise<Aula> {
    return new Promise<Aula>((resolve, reject) => {
      this.http
        .put(`${this.baseUrl}/ActualizarAula/${id}`, body, { responseType: 'text' })
        .subscribe({
          next: (resp) => resolve(JSON.parse(resp)),
          error: (err) => reject(err)
        });
    });
  }

  async deleteAula(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .delete(`${this.baseUrl}/InactivarAula/${id}`, { responseType: 'text' })
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });
  }

  async bulkDeleteAula(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.deleteAula(id);
    }
  }
}
