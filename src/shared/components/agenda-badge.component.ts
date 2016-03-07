import {Component, Input} from 'angular2/core';
import {Agenda} from '../models/Agenda.model';

@Component({
  selector: 'agot-agenda-badge',
  moduleId: module.id,
  template: `
    <img class="agenda-badge" src="/assets/img/agenda{{ agenda.agendaId }}.png" alt="{{ agenda.title }}">
    <small class="text-muted">{{ agenda.title }}</small>
  `,
  styles: [`
   .agenda-badge {
      height: 2.0em;
   }
  `]
})
export class AgendaBadgeComponent {
  @Input()
  agenda:Agenda;
}
