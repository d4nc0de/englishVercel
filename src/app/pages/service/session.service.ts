import { UserRole } from '@/enums/user-role';
import { Persona } from '@/models/persona';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Usuario } from '@/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private user: Usuario | null = null;
  private persona: Persona | null = null;
  private access_token: string | null = null;

  constructor(private userService: UserService) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.setStoredUser(JSON.parse(storedUser));
    }
  }

  // 🔹 LOGIN COMPLETO (Supabase + API .NET)
  async apiUser(correo: string, password: string): Promise<boolean> {
    try {
      const apiResponse = await this.userService.login(correo, password);

      // Guardar user + token
      this.access_token = apiResponse.access_token;
      this.user = apiResponse.user;

      if (!this.user) {
        this.clearSession();
        return false;
      }

      // 🔹 Consumimos tu API .NET
      const persona = await this.userService.getPersonaPorUsuarioId(this.user.id);

      if (!persona) {
        // ❌ Usuario sin persona → login inválido
        this.clearSession();
        return false;
      }

      // Guardamos todo
      this.persona = persona;

      localStorage.setItem("user", JSON.stringify(apiResponse));
      localStorage.setItem("persona", JSON.stringify(persona));

      return true;

    } catch (error) {
      console.error("Error en login:", error);
      this.clearSession();
      return false;
    }
  }

  // 🔹 Cuando ya hay user en storage —recarga de página—
  private setStoredUser(apiResponse: any) {
    this.access_token = apiResponse.access_token;
    this.user = apiResponse.user;

    const storedPersona = localStorage.getItem('persona');
    if (storedPersona) {
      this.persona = JSON.parse(storedPersona);
    }
  }

  private clearSession() {
    this.user = null;
    this.persona = null;
    this.access_token = null;

    localStorage.removeItem("user");
    localStorage.removeItem("persona");
  }

  getUser(): Usuario | null {
    return this.user;
  }

  getPersona(): Persona | null {
    return this.persona;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  logout(): void {
    this.clearSession();
  }

  isAdmin(): boolean {
    const persona = this.persona ?? JSON.parse(localStorage.getItem('persona') || '{}');
    return  persona?.rolid === UserRole.ADMINISTRATIVO;
  }

  isTutor(): boolean {
    const persona = this.persona ?? JSON.parse(localStorage.getItem('persona') || '{}');
    return persona?.rolid === UserRole.TUTOR
  }

  isSuperAdmin(): boolean {
    const persona = this.persona ?? JSON.parse(localStorage.getItem('persona') || '{}');
    return persona?.rolid === UserRole.ADMINISTRADOR;
  }
}
