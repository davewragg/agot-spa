import {DeckClass} from './deck-class.model';
import {DeckType} from './deck-type.model';
import {Player} from './player.model';

export class Deck extends DeckClass {
  deckId:number;
  coreSetCount:number = 3;
  deckType:DeckType;
  deckTypeId:number = 3;
  title:string;
  fallbackTitle:string;
  thronesDbId:number;
  thronesDbLink:string;
  thronesDbVersion:string;
  creator:Player;
  creatorId:number;
  // legacy
  secondFactionId:number;

  constructor(deckConfig:any) {
    super(deckConfig.faction, deckConfig.agenda);
    Object.assign(this, deckConfig);
  }

  getTitle() {
     //cover legacy decks
    return this.title || this.fallbackTitle;
  }
}
