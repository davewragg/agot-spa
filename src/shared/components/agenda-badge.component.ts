import {Component, Input} from 'angular2/core';
import {Agenda} from '../models/Agenda.model';

@Component({
  selector: 'agot-agenda-badge',
  moduleId: module.id,
  template: `
    <small class="text-muted">{{ agenda.title }}</small>
    <img class="agenda-badge" src="/assets/img/icon{{ agenda.agendaId }}.png" alt="{{ agenda.title }}">
  `,
  styles: [`
   .agenda-badge {
      height: 2.0em;
      opacity: 0.7;
   }
  `]
})
export class AgendaBadgeComponent {
  @Input()
  agenda:Agenda;
}
