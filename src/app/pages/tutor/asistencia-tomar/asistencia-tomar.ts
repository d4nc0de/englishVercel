import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

// Servicios
import { AulaService } from '@/pages/service/aula.service';
import { RazonService } from '@/pages/service/razon.service';
import { HorarioDetalleService } from '@/pages/service/horario-detalle.service';
import { HorarioService } from '@/pages/service/horario.service';
import { EstudianteService } from '@/pages/service/estudiante.service';
import { SelectModule } from 'primeng/select';
import { HorarioCompletoService } from '@/pages/service/horario-completo.service';
import { HorarioDetalle } from '@/models/horario-detalle';
import { AsistenciaEstudiante } from '@/models/asistencia-estudiante';
import { Estudiante } from '@/models/estudiante';
import { AsistenciaEstudianteService } from '@/pages/service/asistencia-estudiante.service';
import { SesionClaseService } from '@/pages/service/sesion-clase.service';
import { CalendarioSemanaProgramaService } from '@/pages/service/calendario-semana-programa.service';
import { SesionClase } from '@/models/sesion-clase';
import { getTipoProgramaName } from '@/enums/tipo-programa';
import { InstitucionService } from '@/pages/service/institucion.service';
import { SedeService } from '@/pages/service/sede.service';
import { Sede } from '@/models/sede';
import { Institucion } from '@/models/institucion';

@Component({
  selector: 'app-asistencia-tomar',
  standalone: true,
  templateUrl: './asistencia-tomar.html',
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    AutoCompleteModule,
    DatePickerModule,
    RadioButtonModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    SelectModule
  ],
  providers: [MessageService]
})
export class AsistenciaTomarComponent implements OnInit {

  idAula!: number;
  aulaSeleccionada: any = null;

  sede: Sede | null = null;
  institucion: Institucion | null = null;

  // Horarios UI
  detalles: HorarioDetalle[] = [];
  detalleSeleccionado: HorarioDetalle | null = null;

  fechaClase: Date | null = null;
  claseDictada: string | null = null;

  // Motivos
  motivos: any[] = [];
  motivoSeleccionado: any = null;

  // Asistencia
  estudiantesAula: Estudiante[] = [];
  asistencia: AsistenciaEstudiante[] = [];
  asistenciaUI: any[] = [];

  mostrarTablaAsistencia: boolean = false;
  modoEdicion: boolean = false;

  sessionClase: SesionClase | null = null;
  newSession: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private aulaService: AulaService,
    private razonService: RazonService,
    private institucionService: InstitucionService,
    private sedeService: SedeService,
    private horarioCompletoService: HorarioCompletoService,
    private asistenciaEstudianteService: AsistenciaEstudianteService,
    private sesionClaseService: SesionClaseService,
    private estudianteService: EstudianteService,
    private semanaService: CalendarioSemanaProgramaService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    // ID DEL AULA
    this.idAula = Number(this.route.snapshot.paramMap.get('aulaid'));

    // INFO DEL AULA
    this.aulaSeleccionada = await this.aulaService.getSingleAula(this.idAula);
    // this.sede = await this.sedeService.getSingleSede(this.aulaSeleccionada.sedeid);
    this.institucion = await this.institucionService.getSingleInstitucion(this.sede!.institucionid);

    // CARGAR HORARIOS
    await this.cargarHorarios();

    // CARGAR MOTIVOS
    await this.cargarMotivos();
  }

  async cargarHorarios() {
    const horariosBase = await this.horarioCompletoService.getHorarioCompletoByJornadaId(this.aulaSeleccionada.jornadaid);
    if (!horariosBase) return;

    for (const horario of horariosBase.horarios) {
      const detalles = horario.detalles;

      for (const det of detalles) this.detalles.push(det);
    }

    this.detalles = this.detalles.map(d => ({
      ...d,
      label: `${this.diaSemanaTexto(d.dia_semana)} ${d.hora_inicio} - ${d.hora_fin}`
    }));
  }

  async cargarMotivos() {
    const data = await this.razonService.getAllClases();

    this.motivos = data.map((m: any) => ({
      motivonoclaseid: m.motivonoclaseid,
      descripcion: m.descripcion
    }));
  }

  // CAMBIO FECHA / HORARIO → Resetear tabla
  onHorarioChange() {
    this.resetTablaAsistencia();
  }

  async onFechaChange() {
    const diaValido = this.detalleSeleccionado?.dia_semana;
    this.newSession = false;

    if (this.fechaClase?.getDay() !== diaValido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Día inválido',
        detail: `La fecha seleccionada no corresponde al día ${this.diaSemanaTexto(diaValido!)}.`
      });

      this.fechaClase = null;
    } else {
      const semana = await this.semanaService.getSemanaByDate(this.fechaClase!, this.aulaSeleccionada.programaid);
      if (semana) {
        this.sessionClase = await this.sesionClaseService.getSesionClaseBySemana(semana, this.detalleSeleccionado!.dia_semana);

        if (!this.sessionClase) {
          this.sessionClase = {
            sesionclaseid: 0,
            fecha_real: this.fechaClase!,
            dia_semana: this.detalleSeleccionado!.dia_semana,
            hora_inicio: new Date(),
            hora_fin: new Date(),
            clase_dictada: true,
            minutos_dictados: 0,
            es_reposicion: false,
            estado: 'pendiente',
            tutorid: 0,
            aulaid: this.idAula,
            calendariosemanalprogramaid: semana.calendariosemanalprogramaid
          }

          this.newSession = true;
        }
      }
    }

    this.resetTablaAsistencia();
  }

  resetTablaAsistencia() {
    this.asistencia = [];
    this.mostrarTablaAsistencia = false;
    this.modoEdicion = false;
  }


  diaSemanaTexto(n: number) {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dias[n - 1] ?? 'Día';
  }

  async cargarListaEstudiantes() {
    if (!this.fechaClase || !this.detalleSeleccionado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Faltan datos',
        detail: 'Debe seleccionar fecha y horario antes de cargar la lista.'
      });
      return;
    }

    this.mostrarTablaAsistencia = true;
    this.modoEdicion = false;

    const estudiantes = await this.estudianteService.getAllEstudiantes();

    this.estudiantesAula = estudiantes.filter(e => e.aulaid === this.idAula);

    const asistenciasExistentes = await this.asistenciaEstudianteService.getAsistenciasBySesionClase(this.sessionClase?.sesionclaseid!);

    // Mapear asistencias existentes
    for (const estudiante of this.estudiantesAula) {
      const asistenciaExistente = asistenciasExistentes.find(ae => ae.estudianteid === estudiante.estudianteid);
      if (asistenciaExistente) {
        this.asistencia.push(asistenciaExistente);
      } else {
        this.asistencia.push({
          asistenciaestudianteid: 0, // TODO: ELIMINAR DESPUES
          asistio: true,
          justificada: false,
          estado: 'pendiente',
          sesionclaseid: this.detalleSeleccionado.horariodetalleid,
          estudianteid: estudiante.estudianteid
        });
      }
    }

    if (this.newSession) {
      try {
        this.sessionClase = await this.sesionClaseService.createSesionClase(this.sessionClase!);
        this.newSession = false;
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al crear la sesión de clase.'
        });
      }
    }

    this.asistenciaUI = this.asistencia.map(a => {
      const estudiante = this.estudiantesAula.find(e => e.estudianteid === a.estudianteid);
      return {
        ...a,
        numero_documento: estudiante?.numero_documento,
        nombres: estudiante?.nombres,
        apellidos: estudiante?.apellidos
      };
    });
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  async guardarAsistenciaFinal() {
    this.modoEdicion = false;

    this.asistencia = this.asistenciaUI.map(a => {
      return {
        asistenciaestudianteid: a.asistenciaestudianteid,
        asistio: a.asistio,
        observacion: a.observacion,
        justificada: a.justificada,
        estado: a.estado,
        sesionclaseid: this.sessionClase?.sesionclaseid!,
        estudianteid: a.estudianteid,
        motivoinasistenciaestudianteid: a.motivoinasistenciaestudianteid
      };
    })

    try {
      await this.asistenciaEstudianteService.bulkUpdateAsistenciasEstudiantes(this.asistencia);

      console.log("Asistencia guardada:", this.asistencia);
      this.messageService.add({
        severity: 'success',
        summary: 'Guardado',
        detail: 'Asistencia registrada correctamente.'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al guardar la asistencia.'
      });
    }
  }

  async registrarMotivo() {
    if (!this.motivoSeleccionado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar un motivo.'
      });
      return;
    }

    this.sessionClase!.clase_dictada = false;
    this.sessionClase!.minutos_dictados = 0;
    this.sessionClase!.motivonoclaseid = this.motivoSeleccionado.motivonoclaseid;

    try {
      if (this.newSession) {
        await this.sesionClaseService.createSesionClase(this.sessionClase!);
      } else {
        await this.sesionClaseService.updateSesionClase(this.sessionClase!.sesionclaseid, this.sessionClase!);
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al registrar el motivo.'
      });
      return;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Registrado',
      detail: 'Motivo registrado correctamente.'
    });
  }

  getPrograma(programaid: number): string {
    return getTipoProgramaName(programaid);
  }
}
