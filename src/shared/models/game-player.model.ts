import {Player} from './player.model';
import {Faction} from './faction.model';
import {Agenda} from './agenda.model';

export interface GamePlayer {
  gamePlayerId?: number;
  gameId: number;
  player: Player;
  isWinner: boolean;
  faction: Faction;
  secondFaction?: Faction;
  agenda: Agenda;
}
