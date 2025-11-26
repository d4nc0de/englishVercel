import { Persona } from '@/models/persona';
import { SessionService } from '@/pages/service/session.service';
import { Dashboard } from '@/utils/dashboard';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tutor-dashboard',
  imports: [],
  templateUrl: './tutor-dashboard.html',
  styleUrl: './tutor-dashboard.scss'
})
export class TutorDashboard extends Dashboard {
  constructor(protected override sessionService: SessionService) {
    super(sessionService);
  }
}
