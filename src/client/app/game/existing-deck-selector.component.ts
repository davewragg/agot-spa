import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { Deck } from '../shared/models/deck.model';
import { DeckService } from '../shared/services/deck.service';
// import { DeckChooserComponent } from './deck-chooser.component';

@Component({
  selector: 'agot-existing-deck-selector',
  templateUrl: 'game/existing-deck-selector.component.html',
  // directives: [DeckChooserComponent]
})
export class ExistingDeckSelectorComponent implements OnInit, OnChanges {
  @Input()
  playerId: number;
  @Input()
  existingDeck: Deck;
  @Output()
  selectDeck: EventEmitter<Deck> = new EventEmitter<Deck>();

  myDecks: Deck[];
  allDecks: Deck[];

  isLoadingMyDecks: boolean;
  isLoadingAllDecks: boolean;

  showAllDecks: boolean = false;

  constructor(private deckService: DeckService) {
  }

  setShowAllDecks(state: boolean) {
    this.showAllDecks = state;
  }

  onDeckSelect(deck: Deck) {
    console.log(deck);
    this.selectDeck.emit(deck);
  }

  ngOnInit() {
    this.loadAllDecks();
  }

  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    const change = changes['playerId'];
    if (change && change.previousValue !== change.currentValue) {
      this.loadMyDecks(this.playerId);
    }
  }

  private loadMyDecks(playerId: number) {
    this.isLoadingMyDecks = true;
    if (!playerId) {
      return;
    }
    this.deckService.getDecksFor(+playerId)
      .subscribe(
        (decks: Deck[]) => {
          this.myDecks = decks;
        },
        (error: Error) => {
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
      (decksArray: Deck[]) => {
        this.allDecks = decksArray;
      },
      (error: Error) => {
        console.error(error);
        this.isLoadingAllDecks = false;
      }, () => {
        this.isLoadingAllDecks = false;
      }
    );
  }
}
