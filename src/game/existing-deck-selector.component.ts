import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange} from 'angular2/core';
import {Deck} from '../shared/models/deck.model';
import {DeckService} from '../shared/services/deck.service';

@Component({
  selector: 'agot-existing-deck-selector',
  moduleId: module.id,
  templateUrl: './existing-deck-selector.component.html'
})
export class ExistingDeckSelectorComponent implements OnInit, OnChanges {
  @Input()
  playerId:number;
  @Output()
  selectDeck:EventEmitter<Deck> = new EventEmitter<Deck>();

  myDecks:Deck[];
  allDecks:Deck[];

  isLoadingMyDecks:boolean;
  isLoadingAllDecks:boolean;

  showAllDecks:boolean = false;

  constructor(private deckService:DeckService) {
  }

  setShowAllDecks(state:boolean) {
    this.showAllDecks = state;
  }

  ngOnInit() {
    this.loadAllDecks();
  }

  ngOnChanges(changes:{ [key:string]: SimpleChange }) {
    const change = changes['playerId'];
    if (change && change.previousValue !== change.currentValue) {
      this.loadMyDecks(this.playerId);
    }
  }

  private loadMyDecks(playerId:number) {
    this.isLoadingMyDecks = true;
    if (!playerId) {
      return;
    }
    this.deckService.getDecksFor(playerId)
      .subscribe(
        (decks:Deck[]) => {
          this.myDecks = decks;
        },
        (error:Error) => {
          console.error(error);
          this.isLoadingMyDecks = false;
        }, () => {
          this.isLoadingMyDecks = false;
        }
      );
  }

  private loadAllDecks() {
    this.isLoadingAllDecks = true;
    return this.deckService.getDecks().subscribe(
      (decksArray:Deck[]) => {
        this.allDecks = decksArray;
      },
      (error:Error) => {
        console.error(error);
        this.isLoadingAllDecks = false;
      }, () => {
        this.isLoadingAllDecks = false;
      }
    );
  }
}
