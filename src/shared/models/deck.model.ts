import {DeckClass} from './deck-class.model';
import {DeckType} from './deck-type.model';
import {Player} from './player.model';
import {Faction} from './faction.model';
import {Agenda} from './agenda.model';

export class Deck extends DeckClass {
  coreSetCount:number = 3;
  deckType:DeckType;
  deckTypeId:number;
  title:string;
  thronesDbId:number;
  thronesDbLink:string;
  thronesDbVersion:string;
  creator:Player;
  creatorId:number;

  constructor(creator:Player, faction:Faction, agenda?:Agenda, title?:string) {
    super(faction, agenda);

    this.creator = creator;
    this.creatorId = creator.playerId;

    this.title = title || `New ${super.title} deck`;

    // TODO deckType
    //this.deckType = Tournament
    this.coreSetCount = 3;
  }
}
