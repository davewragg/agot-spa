import { Component, Input } from '@angular/core';
// import { ROUTER_DIRECTIVES } from '@angular/router';
import { Deck } from '../models/deck.model';

// TODO ROUTER_DIRECTIVES replaced?

@Component({
  moduleId: module.id,
  selector: 'agot-deck-link',
  template: `<a [routerLink]="['/DeckDetails', {id: deck?.deckId}]">{{ deck?.title || deck?.fallbackTitle || 'Deck' }}</a>`,
  // directives: [ROUTER_DIRECTIVES]
})
export class DeckLinkComponent {
  @Input()
  deck: Deck;
}
