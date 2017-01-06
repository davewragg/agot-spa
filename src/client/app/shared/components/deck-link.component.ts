import { Component, Input } from '@angular/core';
import { Deck } from '../models/deck.model';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-link',
  template: `<a [routerLink]="['/decks', deck?.deckId]">{{ deck?.title || deck?.fallbackTitle || 'Deck' }}</a>`,
})
export class DeckLinkComponent {
  @Input()
  deck: Deck;
}
