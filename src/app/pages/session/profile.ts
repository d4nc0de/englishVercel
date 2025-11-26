import { Component } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
import { Persona } from '@/models/persona';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.html',
    imports: [ButtonModule]
})
export class Profile {
    private persona: Persona | null = null;

    constructor(private sessionService: SessionService, private router: Router) {
        if (!this.sessionService.isLoggedIn()) this.router.navigate(['/auth/login']);
        else this.persona = this.sessionService.getPersona();
    };

    get completeName(): string {
        if(!this.persona) return '';
        return `${this.persona.nombres} ${this.persona.apellidos}`;
    }

    logout(): void {
        this.sessionService.logout();
        this.router.navigate(['/auth/login']);
    }
}