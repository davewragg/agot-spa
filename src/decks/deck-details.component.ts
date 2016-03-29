import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {DeckService} from '../shared/services/deck.service';
import {Deck} from '../shared/models/deck.model';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {DeckEditFormComponent} from './deck-edit-form.component';
import {Game} from '../shared/models/game.model';
import {GameService} from '../shared/services/game.service';
import {FilterCriteria} from '../shared/models/filter-criteria.model';
import {GamesTableComponent} from '../home/components/games-table.component';
import {ViewDeckComponent} from './view-deck.component';
import {NotificationService} from '../shared/services/notification.service';

@Component({
  selector: 'agot-deck-details',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './deck-details.component.html',
  directives: [
    SpinnerComponent,
    DeckEditFormComponent,
    GamesTableComponent,
    ViewDeckComponent,
    ROUTER_DIRECTIVES // TODO remove?
  ]
})
export class DeckDetailsComponent implements OnInit {
  deck:Deck;
  deckIdParam:number;
  editParam:boolean;
  deckGames:Game[];

  editing:boolean = false;
  formDisabled:boolean = false;
  isLoadingDeck:boolean;
  isLoadingGames:boolean;
  loadError:any = null;

  constructor(params:RouteParams,
              private deckService:DeckService,
              private gameService:GameService,
              private notificationService:NotificationService,
              private router:Router) {
    this.deckIdParam = <number>+params.get('id');
    this.editParam = !!params.get('edit');
    this.editing = this.editParam || !this.deckIdParam;
  }

  ngOnInit() {
    if (this.deckIdParam) {
      this.loadDeck();
      this.loadDeckGames();
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

  private loadDeckGames() {
    this.isLoadingGames = true;
    return this.gameService.getGames(<FilterCriteria>{deckIds: [this.deckIdParam]})
      .subscribe(
        (games) => this.deckGames = games,
        (error) => this.loadError = error,
        () => this.isLoadingGames = false
      );
  }
}
