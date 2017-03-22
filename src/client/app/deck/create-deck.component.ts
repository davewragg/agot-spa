import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeckService } from '../shared/services/deck.service';
import { Deck } from '../shared/models/deck.model';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  moduleId: module.id,
  selector: 'agot-create-deck-details',
  templateUrl: 'create-deck.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDeckComponent implements OnInit {
  deck: Deck;

  formDisabled: boolean = false;
  isLoading: boolean = false;

  constructor(private deckService: DeckService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  ngOnInit() {
    this.deck = new Deck();
  }

  onSubmit(deck: Deck) {
    this.formDisabled = true;
    this.isLoading = true;

    console.log('details submit', deck);
    this.deckService.updateDeck(deck).subscribe((deck: Deck) => {
        return this.router.navigate(['/decks', deck.deckId]);
      }, (error) => {
        this.formDisabled = false;
        console.error(error);
        this.notificationService.error('Whoops', error.message || error._body || error);
        this.isLoading = false;
      }, () => this.isLoading = false
    );
  }

  onCancel() {
    this.router.navigate(['/decks']);
  }
}
