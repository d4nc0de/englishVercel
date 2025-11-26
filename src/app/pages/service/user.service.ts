import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '@/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  authHeaders = {
    headers: {
      'apikey': environment.key,
      'Content-Type': 'application/json'
    }
  };

  private apiBaseUrl = environment.apiBaseUrl;

  // 🔹 LISTA DE USUARIOS DESDE TU BACKEND
  async getAllUsuarios(): Promise<Usuario[]> {
    return new Promise<Usuario[]>((resolve, reject) => {
      this.http
        .get<Usuario[]>(`${this.apiBaseUrl}/User/ObtenerUsuariosActivas`)
        .subscribe({
          next: (res) => resolve(res),
          error: (err) => reject(err)
        });
    });
  }

  async deleteUsuario(id: string): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve();
    })
  }

  async bulkDeleteUsuarios(ids: string[]): Promise<void> {
    return new Promise<void>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve();
    })
  }

  async updateSingleUsuario(id: string, usuario: Usuario): Promise<Usuario> {
    return new Promise<Usuario>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");
      resolve(usuario);
    })
  }

  async signup(correo: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post(`${environment.endpoint}/auth/v1/signup`, {
        email: correo,
        password: password
      }, this.authHeaders).subscribe(r => {
        resolve(r);
      })
    })
  }

  async login(correo: string, password: string): Promise<any> {
    return new Promise<any>((resolve) => {
      this.http.post(`${environment.endpoint}/auth/v1/token?grant_type=password`,
        {
          email: correo,
          password: password
        }, this.authHeaders).subscribe(r => {
          resolve(r);
        })
    })
  }

  async getPersonaPorUsuarioId(usuarioId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get(
        `${this.apiBaseUrl}/Persona/ObtenerPersonaPorUsuarioId/${usuarioId}`
      ).subscribe({
        next: r => resolve(r),
        error: err => reject(err)
      });
    });
  }
}