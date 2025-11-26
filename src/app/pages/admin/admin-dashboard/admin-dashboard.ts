import { SessionService } from '@/pages/service/session.service';
import { Dashboard } from '@/utils/dashboard';
import { Stats } from '@/utils/stats';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Stats, ToastModule],
  providers: [MessageService],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard extends Dashboard{
  constructor(protected override sessionService: SessionService) {
    super(sessionService);
  }
}
