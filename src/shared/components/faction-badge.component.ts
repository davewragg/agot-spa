import {Component, Input} from 'angular2/core';
import {Faction} from '../models/faction.model';

@Component({
  selector: 'agot-faction-badge',
  moduleId: module.id,
  template: `
    <img class="faction-badge" src="/assets/img/icon{{ faction.factionId }}.png"
         alt="{{ faction.name }}">
    {{ faction.name }}
  `,
  styles: [`
   .faction-badge {
      height: 2.0em;
   }
  `]
})
export class FactionBadgeComponent {
  @Input()
  faction:Faction;
}
