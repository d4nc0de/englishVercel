import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';


// Servicios
import { AulaService } from '@/pages/service/aula.service';

@Component({
  selector: 'app-asistencia-aulas',
  standalone: true,
  templateUrl: './asistencia-aulas.html',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    AutoCompleteModule 
  ]
})export class AsistenciaAulasComponent implements OnInit {

  aulas: any[] = [];
  aulaSeleccionada: any = null;

  constructor(
    private aulaService: AulaService, 
    private router: Router
  ) {}

  async ngOnInit() {
    this.aulas = await this.aulaService.getAllAulas();
  }

  continuar() {
    if (!this.aulaSeleccionada) return;
    this.router.navigate(['/tutor/asistencia/tomar', this.aulaSeleccionada.aulaid]);
  }
}

