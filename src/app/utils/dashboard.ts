import { Persona } from '@/models/persona';
import { SessionService } from '@/pages/service/session.service';

export abstract class Dashboard {
  persona: Persona;
  
  constructor(protected sessionService: SessionService) {
    this.persona = this.sessionService.getPersona()!;
  }

  getBienvenida(): string {
    const horaActual = new Date().getHours();
    if (horaActual < 12) {
      return `¡Buenos días, ${this.persona.nombres}!`;
    } else if (horaActual < 18) {
      return `¡Buenas tardes, ${this.persona.nombres}!`;
    } else {
      return `¡Buenas noches, ${this.persona.nombres}!`;
    }
  }
}
