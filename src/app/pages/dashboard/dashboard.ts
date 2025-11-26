import { Component } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    imports: [],
    template: ``
})
export class Dashboard {
    constructor(
        private sessionService: SessionService,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.sessionService.isLoggedIn()) {
            if (this.sessionService.isSuperAdmin()) this.router.navigate(['/admin']);
            else if (this.sessionService.isAdmin()) this.router.navigate(['/administrativo']);
            else this.router.navigate(['/tutor'])
        }
    }
}
