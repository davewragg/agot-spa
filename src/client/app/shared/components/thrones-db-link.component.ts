import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Deck } from '../models/deck.model';
import { ThronesDbService } from '../services/thrones-db.service';

@Component({
  moduleId: module.id,
  selector: 'agot-thrones-db-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // TODO fancy icon for this?
  template: `
    <a [class]="classname"
       *ngIf="safeLink"
       [href]="safeLink"
       [title]="safeLink"
       rel="noopener noreferrer" target="_blank">{{ text }}</a>`,
})
export class ThronesDbLinkComponent {
  @Input()
  set deck(deck: Deck) {
    if (deck && deck.thronesDbLink) {
      this.safeLink = ThronesDbService.sanitiseThronesDbLink(deck);
    }
  }

  @Input()
  text: string = '[TDB]';
  @Input()
  classname: string = 'small';

  safeLink: string;
}
