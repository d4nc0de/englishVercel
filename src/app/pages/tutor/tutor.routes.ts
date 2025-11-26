import { Routes } from '@angular/router';
import { MiHorario } from './mi-horario/mi-horario';
import { AsistenciaAulasComponent } from './asistencia-tomar/asistencia-aulas';
import { AsistenciaTomarComponent } from './asistencia-tomar/asistencia-tomar';
import { TutorDashboard } from './tutor-dashboard/tutor-dashboard';
import { NotasTutorComponent } from './notas-crud/notas-tutor';

export default [
    { path: '', component: TutorDashboard },
    { path: 'mi-horario', component: MiHorario },
    { path: 'asistencia', component: AsistenciaAulasComponent },
    { path: 'asistencia/tomar/:aulaid', component: AsistenciaTomarComponent },
    { path: 'notas', component: NotasTutorComponent }
] as Routes;
