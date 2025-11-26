import { Component } from '@angular/core';
import { PersonaService } from '@/pages/service/persona.service';
import { Persona } from '@/models/persona';
import { UserRole } from '@/enums/user-role';
import { Institucion } from '@/models/institucion';
import { InstitucionService } from '@/pages/service/institucion.service';
import { MessageService } from 'primeng/api';
import { Aula } from '@/models/aula';
import { Sede } from '@/models/sede';
import { AulaService } from '@/pages/service/aula.service';
import { SedeService } from '@/pages/service/sede.service';
import { Estudiante } from '@/models/estudiante';
import { EstudianteService } from '@/pages/service/estudiante.service';

@Component({
    standalone: true,
    selector: 'app-stats',
    imports: [],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Personal contratado</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ personas.length }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 text-xl!"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Tutores</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ tutores.length }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-purple-500 text-xl!"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Estudiantes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ estudiantes.length }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-green-500 text-xl!"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Instituciones</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ instituciones.length }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-building text-orange-500 text-xl!"></i>
                    </div>                    
                </div>
                <div>
                    <span class="text-primary font-medium">{{ aulas.length }} </span>
                    <span class="text-muted-color">aulas</span>
                </div>
                <div>
                    <span class="text-primary font-medium">{{ sedes.length }} </span>
                    <span class="text-muted-color">sedes</span>
                </div>
            </div>
        </div>`
})
export class Stats {
    personas: Persona[] = [];
    tutores: Persona[] = [];

    instituciones: Institucion[] = [];
    aulas: Aula[] = [];
    sedes: Sede[] = [];
    estudiantes: Estudiante[] = [];

    constructor(
        private messageService: MessageService,
        private personaService: PersonaService,
        private institucionService: InstitucionService,
        private aulaService: AulaService,
        private sedeService: SedeService,
        private estudianteService: EstudianteService
    ) { }

    async ngOnInit() {
        try {
            this.personas = await this.personaService.getAllPersonas();
            this.tutores = this.personas.filter(persona => persona.rolid === UserRole.TUTOR);
        } catch (error) {
            console.error('Error fetching personas:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las personas.', life: 3000 });
        }

        try {
            this.instituciones = await this.institucionService.getAllInstituciones();
        } catch (error) {
            console.error('Error fetching instituciones:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las instituciones.', life: 3000 });
        }

        try {
            this.aulas = await this.aulaService.getAllAulas();
        } catch (error) {
            console.error('Error fetching aulas or sedes:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las aulas.', life: 3000 });
        }

        try {
            this.sedes = await this.sedeService.getAllSedes();
        } catch (error) {
            console.error('Error fetching sedes:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las sedes.', life: 3000 });
        }

        try {
            this.estudiantes = await this.estudianteService.getAllEstudiantes();
        } catch (error) {
            console.error('Error fetching estudiantes:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los estudiantes.', life: 3000 });
        }
    }
}
