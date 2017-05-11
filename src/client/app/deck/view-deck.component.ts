import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Deck } from '../shared/models/deck.model';

@Component({
  moduleId: module.id,
  selector: 'agot-view-deck',
  templateUrl: 'view-deck.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .deck-block {
      background-repeat: no-repeat;
      background-position: top center;
      background-size: cover;
    }
  `],
})
export class ViewDeckComponent {
  @Input()
  deck: Deck;
}
