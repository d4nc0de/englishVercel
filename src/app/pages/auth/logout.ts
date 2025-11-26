import { Component } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: ``,
  imports: [],
})
export class Logout {
  constructor(private sessionService: SessionService, public router: Router) {
    this.sessionService.logout();
    this.router.navigate(['/auth/login']);
  }
}
