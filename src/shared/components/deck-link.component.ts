import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Deck} from '../models/deck.model';

@Component({
  selector: 'agot-deck-link',
  moduleId: module.id,
  template: `<a [routerLink]="['/DeckDetails', {id: deck?.deckId}]">{{ deck?.title || deck?.fallbackTitle || 'Deck' }}</a>`,
  directives: [ROUTER_DIRECTIVES]
})
export class DeckLinkComponent {
  @Input()
  deck:Deck;
}
