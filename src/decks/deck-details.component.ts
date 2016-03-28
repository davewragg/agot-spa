import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {DeckService} from '../shared/services/deck.service';
import {Deck} from '../shared/models/deck.model';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {DeckEditFormComponent} from './deck-edit-form.component';
import {Game} from '../shared/models/game.model';
import {GameService} from '../shared/services/game.service';
import {Observable} from 'rxjs/Observable';
import {FilterCriteria} from '../shared/models/filter-criteria.model';
import {GamesTableComponent} from '../home/components/games-table.component';
import {DeckClassBlockComponent} from '../shared/components/deck-class-block.component';

@Component({
  selector: 'agot-deck-details',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './deck-details.component.html',
  directives: [
    SpinnerComponent,
    DeckEditFormComponent,
    GamesTableComponent,
    DeckClassBlockComponent,
    ROUTER_DIRECTIVES
  ]
})
export class DeckDetailsComponent implements OnInit {
  deck:Deck;
  deckIdParam:number;
  editParam:boolean;
  deckGames:Game[];

  editing:boolean = false;
  formDisabled:boolean = false;
  isLoading:boolean;
  loadError:any = null;

  constructor(params:RouteParams,
              private deckService:DeckService,
              private gameService:GameService,
              private router:Router) {
    this.deckIdParam = <number>+params.get('id');
    this.editParam = !!params.get('edit');
    this.editing = this.editParam || !this.deckIdParam;
  }

  ngOnInit() {
    if (this.deckIdParam) {
      this.loadDeckAndGames();
    } else {
      this.deck = new Deck();
    }
  }

  onSubmit(deck:Deck) {
    this.formDisabled = true;
    this.isLoading = true;
    const creating = !deck.deckId;

    console.log('details submit', deck, creating);
    // this.deckService.updateDeck(deck).subscribe((deck:Deck) => {
    //     if (creating) {
    //       // TODO skip reload
    //       this.router.navigate(['/DeckDetails', {id: deck.deckId}]);
    //       return;
    //     }
    //     this.deck = deck;
    //     this.formDisabled = false;
    //     this.editing = false;
    //   }, (error) => {
    //     this.formDisabled = false;
    //     console.error(error);
    //     this.notificationService.error('Whoops', error.message || error._body || error);
    //     this.isLoading = false;
    //   }, () => this.isLoading = false
    // );
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
    this.editing = true;
  }

  // onDelete() {
  //   console.log('delete', this.deck);
  //   this.deckService.deleteDeck(this.deck.deckId).subscribe((result) => {
  //     this.deck = null;
  //     this.notificationService.success('There', `I hope you're happy`);
  //   }, (error) => {
  //     console.error(error);
  //     this.notificationService.error('Whoops', error.message || error._body || error);
  //   });
  // }

  private loadDeckAndGames() {
    // TODO split this into 2 separate load states
    this.isLoading = true;
    return Observable.combineLatest(
      this.deckService.getDeck(this.deckIdParam),
      this.gameService.getGames(<FilterCriteria>{deckIds: [this.deckIdParam]})
      )
      .subscribe(
        ([deck, games]) => {
          this.deck = deck;
          this.deckGames = games;
        },
        (error) => this.loadError = error,
        () => this.isLoading = false
      );
  }
}
