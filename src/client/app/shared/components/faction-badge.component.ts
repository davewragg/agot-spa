import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Faction } from '../models/faction.model';

@Component({
  moduleId: module.id,
  selector: 'agot-faction-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img class="faction-badge" src="./assets/img/icon{{ faction.factionId }}.png"
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
  faction: Faction;
}
