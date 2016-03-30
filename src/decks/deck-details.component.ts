import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {DeckService} from '../shared/services/deck.service';
import {Deck} from '../shared/models/deck.model';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {DeckEditFormComponent} from './deck-edit-form.component';
import {GameService} from '../shared/services/game.service';
import {ViewDeckComponent} from './view-deck.component';
import {NotificationService} from '../shared/services/notification.service';
import {StatsService} from '../shared/services/stats.service';
import {DeckStats} from '../shared/models/deck-stats.model';
import {DeckStatsComponent} from './deck-stats.component';

@Component({
  selector: 'agot-deck-details',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './deck-details.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    SpinnerComponent,
    DeckEditFormComponent,
    DeckStatsComponent,
    ViewDeckComponent
  ]
})
export class DeckDetailsComponent implements OnInit {
  deck:Deck;
  deckIdParam:number;
  editParam:boolean;
  deckStats:DeckStats;

  editing:boolean = false;
  formDisabled:boolean = false;
  isLoadingDeck:boolean;
  isLoadingStats:boolean;
  loadError:any = null;

  constructor(params:RouteParams,
              private deckService:DeckService,
              private statsService:StatsService,
              private notificationService:NotificationService,
              private router:Router) {
    this.deckIdParam = <number>+params.get('id');
    this.editParam = !!params.get('edit');
    this.editing = this.editParam || !this.deckIdParam;
  }

  ngOnInit() {
    if (this.deckIdParam) {
      this.loadDeck();
      this.loadDeckStats();
    } else {
      this.deck = new Deck();
    }
  }

  onSubmit(deck:Deck) {
    this.formDisabled = true;
    this.isLoadingDeck = true;
    const creating = !deck.deckId;

    console.log('details submit', deck, creating);
    this.deckService.updateDeck(deck).subscribe((deck:Deck) => {
        if (creating) {
          // TODO skip reload
          this.router.navigate(['/DeckDetails', {id: deck.deckId}]);
          return;
        }
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
    // if creating or editing directly, GTFO
    if (!this.deck.deckId || this.editParam) {
      this.router.navigate(['/Decks']);
    } else {
      this.editing = false;
    }
  }

  onEdit() {
    if (this.deck.thronesDbId) {
      return;
    }
    this.editing = true;
  }

  private loadDeck() {
    this.isLoadingDeck = true;
    return this.deckService.getDeck(this.deckIdParam)
      .subscribe(
        (deck) => {
          this.deck = deck;
          if (deck.thronesDbId && this.editing) {
            this.editing = false;
          }
        },
        (error) => this.loadError = error,
        () => this.isLoadingDeck = false
      );
  }

  private loadDeckStats() {
    this.isLoadingStats = true;
    return this.statsService.getDeckStats(this.deckIdParam)
      .subscribe(
        (stats) => {
          console.log(stats.vs.agendas.keys());
          this.deckStats = stats;
        },
        (error) => this.loadError = error,
        () => this.isLoadingStats = false
      );
  }
}
