import { Aula } from '@/models/aula';
import { HorarioCompleto } from '@/models/horario-completo';
import { HorarioDetalle } from '@/models/horario-detalle';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface DiaConDetalles {
  dia: number
  detalles: HorarioDetalle[]
}

@Component({
  selector: 'app-calendario-viewer',
  imports: [
    CommonModule
  ],
  templateUrl: './calendario-viewer.html',
  styleUrl: './calendario-viewer.scss'
})
export class CalendarioViewer {
  @Input() horarioCompleto: HorarioCompleto | null = null;

  ngOnChanges() {
    console.log(this.horarioCompleto);
    this.clear();
    if(this.horarioCompleto) this.organizarPorDia();
  }

  dias: DiaConDetalles[] = [
    { dia: 1, detalles: [] },
    { dia: 2, detalles: [] },
    { dia: 3, detalles: [] },
    { dia: 4, detalles: [] },
    { dia: 5, detalles: [] },
    { dia: 6, detalles: [] },
    { dia: 7, detalles: [] }
  ]

  private clear() {
    for (let d of this.dias) d.detalles = []
  }

  private organizarPorDia(): void {
    // recorrer todos los horarios y detalles
    for (const hw of this.horarioCompleto!.horarios) {
      for (const det of hw.detalles) {
        console.log(det);
        const dia = this.dias.find(d => d.dia === det.dia_semana)
        if (dia) {
          dia.detalles.push(det)
        }
      }
    }

    // ordenar cada dia por hora_inicio
    for (const d of this.dias) {
      d.detalles.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
    }
  }

}
