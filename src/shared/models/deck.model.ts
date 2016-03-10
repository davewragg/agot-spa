import {DeckClass} from './deck-class.model';
import {DeckType} from './deck-type.model';
import {Player} from './player.model';
import {Faction} from './faction.model';
import {Agenda} from './agenda.model';

export class Deck extends DeckClass {
  deckId:number;
  coreSetCount:number = 3;
  deckType:DeckType;
  deckTypeId:number;
  title:string;
  thronesDbId:number;
  thronesDbLink:string;
  thronesDbVersion:string;
  creator:Player;
  creatorId:number;
  // legacy
  secondFactionId:number;

  constructor(creator:Player, faction:Faction, agenda?:Agenda, title?:string) {
    super(faction, agenda);

    this.creator = creator;
    this.creatorId = creator.playerId;

    this.title = title || `New ${super.getTitle()} deck`;

    // TODO deckType
    //this.deckType = Tournament
    this.coreSetCount = 3;
  }

  get title() {
    // cover legacy decks
    return this.title || `Unnamed ${super.getTitle()} deck`;
  }
}
