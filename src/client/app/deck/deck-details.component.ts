import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DeckService } from '../shared/services/deck.service';
import { NotificationService } from '../shared/services/notification.service';
import { Deck } from '../shared/models/deck.model';
import { StatsService } from '../shared/services/stats.service';
import { DeckStats } from '../shared/models/deck-stats.model';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-details',
  templateUrl: 'deck-details.component.html',
})
export class DeckDetailsComponent implements OnInit {
  deck: Deck;
  deckStats: DeckStats;

  editing: boolean = false;
  formDisabled: boolean = false;
  isLoadingDeck: boolean;
  isLoadingStats: boolean;
  loadError: any = null;

  constructor(private _route: ActivatedRoute,
              private deckService: DeckService,
              private statsService: StatsService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.loadDeck();
    this.loadDeckStats();
  }

  onSubmit(deck: Deck) {
    this.formDisabled = true;
    this.isLoadingDeck = true;

    console.log('details submit', deck);
    this.deckService.updateDeck(deck).subscribe((deck: Deck) => {
        this.deck = deck;
        this.formDisabled = false;
        this.editing = false;
      }, (error) => {
        this.formDisabled = false;
        console.error(error);
        this.notificationService.error('Whoops', error.message || error._body || error);
        this.isLoadingDeck = false;
      }, () => this.isLoadingDeck = false
    );
  }

  onCancel() {
    this.editing = false;
  }

  onEdit() {
    if (this.deck && this.deck.thronesDbId) {
      return;
    }
    this.editing = true;
  }

  private loadDeck() {
    this._route.params
      .do(() => this.isLoadingDeck = true)
      .switchMap((params: Params) => this.deckService.getDeck(+params['id']))
      .subscribe(
        (deck) => {
          this.deck = deck;
          if (deck.thronesDbId && this.editing) {
            this.editing = false;
          }
          this.isLoadingDeck = false;
        },
        (error) => {
          this.isLoadingDeck = false;
          return this.loadError = error;
        },
        () => this.isLoadingDeck = false
      );

  }

  private loadDeckStats() {
    this._route.params
      .do(() => this.isLoadingStats = true)
      .switchMap((params: Params) => this.statsService.getDeckStats(+params['id']))
      .subscribe(
        (stats) => {
          this.isLoadingStats = false;
          this.deckStats = stats;
        },
        (error) => {
          this.isLoadingStats = false;
          return this.loadError = error;
        },
        () => this.isLoadingStats = false
      );
  }
}
