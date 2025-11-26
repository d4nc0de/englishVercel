import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AulaService } from '@/pages/service/aula.service';
import { EstudianteService } from '@/pages/service/estudiante.service';
import { ComponenteNotaService } from '@/pages/service/componente-nota.service';
import { NotaEstudianteService } from '@/pages/service/nota-estudiante.service';
import { Aula } from '@/models/aula';
import { Estudiante } from '@/models/estudiante';
import { NotaEstudiante } from '@/models/nota-estudiante';
import { ComponenteNota } from '@/models/componente-nota';
import { NotasCrud } from './notas-crud';

@Component({
  selector: 'app-notas-tutor',
  standalone: true,
  templateUrl: './notas-tutor.html',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    ToastModule,
    NotasCrud
  ],
  providers: [MessageService]
})
export class NotasTutorComponent implements OnInit {

  aulas: Aula[] = [];
  aulaSeleccionada: Aula | null = null;

  estudiantes: Estudiante[] = [];
  estudianteSeleccionado: Estudiante | null = null;

  componentes: ComponenteNota[] = [];

  constructor(
    private aulaService: AulaService,
    private estudianteService: EstudianteService
  ) {}

  async ngOnInit() {
    this.aulas = await this.aulaService.getAllAulas();
  }

  async cargarEstudiantes() {
    if (!this.aulaSeleccionada) return;

    const lista = await this.estudianteService.getAllEstudiantes();
    this.estudiantes = lista.filter(e => e.aulaid === this.aulaSeleccionada!.aulaid);

    this.estudianteSeleccionado = null;
  }

}
