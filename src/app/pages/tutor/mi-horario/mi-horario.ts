import { UserRole } from '@/enums/user-role';
import { Aula } from '@/models/aula';
import { HorarioCompleto } from '@/models/horario-completo';
import { Persona } from '@/models/persona';
import { Tutor } from '@/models/tutor';
import { AulaService } from '@/pages/service/aula.service';
import { HorarioCompletoService } from '@/pages/service/horario-completo.service';
import { PersonaService } from '@/pages/service/persona.service';
import { SessionService } from '@/pages/service/session.service';
import { TutorService } from '@/pages/service/tutor.service';
import { CalendarioViewer } from '@/utils/calendario-viewer/calendario-viewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-mi-horario',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        CalendarioViewer
    ],
    templateUrl: './mi-horario.html',
})
export class MiHorario {
    tutores: Persona[] = [];
    tutorPersona: Persona | null = null;
    tutor: Tutor | null = null;

    aulaSelected: Aula | null = null;
    aulas: Aula[] = [];
    horarioCompleto: HorarioCompleto | null = null;

    sessionPersona: Persona | null = null;

    constructor(
        private aulaService: AulaService,
        private tutorService: TutorService,
        private horarioCompletoService: HorarioCompletoService,
        private personaService: PersonaService,
        private sessionService: SessionService
    ) {}

    async ngOnInit(): Promise<void> {
        this.sessionPersona = this.sessionService.getPersona();

        if(this.sessionIsTutor()) {
            this.tutor = await this.tutorService.getTutorByPersona(this.sessionPersona!.personaid)!;
        } else {
            this.tutores = await this.personaService.getAllTutoresPersonas();
        }
        
        // if(this.tutor) {
        //     this.aulas = await this.aulaService.getAulasByTutor(this.tutor.tutorid);
        // }
    }

    async onTutorChange(val: any): Promise<void> {
        this.tutor = await this.tutorService.getTutorByPersona(this.tutorPersona!.personaid);
        // this.aulas = await this.aulaService.getAulasByTutor(this.tutor!.tutorid);
    }

    async onAulaChange(): Promise<void> {
        if(this.aulaSelected) {
            this.horarioCompleto = await this.horarioCompletoService.getHorarioCompletoByJornadaId(this.aulaSelected.jornadaid);
        } else {
            this.horarioCompleto = null;
        }
    }

    sessionIsTutor(): boolean {
        return this.sessionPersona?.rolid === UserRole.TUTOR;
    }
}
