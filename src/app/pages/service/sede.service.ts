import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sede } from '@/models/sede';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private baseUrl = `${environment.apiBaseUrl}/Sede`;

  constructor(private http: HttpClient) {}

  async getAllSedes(): Promise<Sede[]> {
    return new Promise<Sede[]>((resolve, reject) => {
      this.http.get(`${this.baseUrl}/ObtenerSedesActivas`, { responseType: 'text' })
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

  async newSede(sede: Sede): Promise<Sede> {
    return new Promise<Sede>((resolve, reject) => {
      this.http.post(`${this.baseUrl}/CrearSede`, sede, { responseType: 'text' })
        .subscribe({
          next: (resp) => resolve(JSON.parse(resp)),
          error: (err) => reject(err)
        });
    });
  }

  async updateSingleSede(id: number, sede: Sede): Promise<Sede> {
    return new Promise<Sede>((resolve, reject) => {
      this.http.put(`${this.baseUrl}/ActualizarSede/${id}`, sede, { responseType: 'text' })
        .subscribe({
          next: (resp) => resolve(JSON.parse(resp)),
          error: (err) => reject(err)
        });
    });
  }

  async deleteSede(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.delete(`${this.baseUrl}/InactivarSede/${id}`, { responseType: 'text' })
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });
  }

  async bulkDeleteSede(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.deleteSede(id);
    }
  }
}
