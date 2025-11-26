import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TipoDocumento } from '@/enums/tipo-documento';
import { UserRole } from '@/enums/user-role';
import { Persona } from '@/models/persona';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private baseUrl = `${environment.apiBaseUrl}/Persona`;

  constructor(private http: HttpClient) { }

  // POST: /api/Persona/CrearPersona
  async newPersona(data: any): Promise<Persona> {
    return new Promise<Persona>((resolve, reject) => {
      this.http.post<Persona>(`${this.baseUrl}/CrearPersona`, data)
        .subscribe({
          next: res => resolve(res),
          error: err => reject(err)
        });
    });
  }

  // GET: /api/Persona/ObtenerPersonasActivas
  async getAllPersonas(): Promise<Persona[]> {
    return new Promise<Persona[]>((resolve, reject) => {
      this.http.get<Persona[]>(`${this.baseUrl}/ObtenerPersonasActivas`)
        .subscribe({
          next: res => resolve(res),
          error: err => reject(err)
        });
    });
  }

  // Usa el mismo endpoint y filtra TUTORES (rolid === TUTOR)
  async getAllTutoresPersonas(): Promise<Persona[]> {
    const personas = await this.getAllPersonas();
    return personas.filter(p => p.rolid === UserRole.TUTOR);
  }

  // GET: /api/Persona/ObtenerPersonaPorId/{id}
  async getSinglePersona(personaid: number): Promise<Persona> {
    return new Promise<Persona>((resolve, reject) => {
      this.http.get<Persona>(`${this.baseUrl}/ObtenerPersonaPorId/${personaid}`)
        .subscribe({
          next: res => resolve(res),
          error: err => reject(err)
        });
    });
  }

  // GET: /api/Persona/ObtenerPersonaPorUsuarioId/{Usuarioid}
  // Devuelve null si la API responde 404
  async getSinglePersonaByUserId(usuarioid: string): Promise<Persona | null> {
    return new Promise<Persona | null>((resolve, reject) => {
      this.http.get<Persona>(`${this.baseUrl}/ObtenerPersonaPorUsuarioId/${usuarioid}`)
        .subscribe({
          next: res => resolve(res),
          error: err => {
            if (err.status === 404) {
              // Persona no encontrada
              resolve(null);
            } else {
              reject(err);
            }
          }
        });
    });
  }

  // PUT: /api/Persona/ActualizarPersona/{id}
  async updateSinglePersona(personaid: number, data: any): Promise<Persona> {
    return new Promise<Persona>((resolve, reject) => {
      this.http.put<Persona>(`${this.baseUrl}/ActualizarPersona/${personaid}`, data, {
        responseType: 'text' as 'json' // 👈 importante
      })
        .subscribe({
          next: res => resolve(res),
          error: err => reject(err)
        });
    });
  }

  async updatePersonaUser(personaid: number, usuarioId: string): Promise<Persona> {
    // 1. Traer la persona completa
    const persona = await this.getSinglePersona(personaid);
  
    if (!persona) {
      throw new Error('Persona no encontrada');
    }
  
    // 2. Actualizar el usuarioId (usa el nombre real que tenga tu backend)
    persona.usuarioid = usuarioId; // o persona.usuarioid, según tu modelo/DTO
  
    // 3. Usar el método que ya tienes para actualizar
    const personaActualizada = await this.updateSinglePersona(personaid, persona);
  
    return personaActualizada;
  }
  

  
  // DELETE: /api/Persona/InactivarPersona/{id}
  async deletePersona(personaid: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .delete(`${this.baseUrl}/InactivarPersona/${personaid}`, {
          responseType: 'text' as 'json' // 👈 importante
        })
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });
  }
  

  // No hay endpoint de bulk, así que hacemos varios DELETE en paralelo
  async bulkDeletePersona(ids_persona: number[]): Promise<void> {
    await Promise.all(ids_persona.map(id => this.deletePersona(id)));
  }
}
