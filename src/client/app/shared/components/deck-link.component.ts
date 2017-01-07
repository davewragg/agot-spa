import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Deck } from '../models/deck.model';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<a [routerLink]="['/decks', deck?.deckId]">{{ deck?.title || deck?.fallbackTitle || 'Deck' }}</a>`,
})
export class DeckLinkComponent {
  @Input()
  deck: Deck;
}
