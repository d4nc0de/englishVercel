import { SessionService } from '@/pages/service/session.service';
import { Dashboard } from '@/utils/dashboard';
import { Component } from '@angular/core';
import { Stats } from '../../../utils/stats';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-administrativo-dashboard',
  imports: [Stats, ToastModule],
  providers: [MessageService],
  templateUrl: './administrativo-dashboard.html',
  styleUrl: './administrativo-dashboard.scss'
})
export class AdministrativoDashboard extends Dashboard {
  constructor(protected override sessionService: SessionService) {
    super(sessionService);
  }
}
