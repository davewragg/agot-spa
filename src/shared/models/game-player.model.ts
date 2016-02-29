import {Player} from './player.model';
import {Faction} from './faction.model';
import {Agenda} from './agenda.model';

export interface GamePlayer {
  gamePlayerId?: number;
  gameId: number;
  player: Player;
  playerId: number;
  isWinner: boolean;
  faction: Faction;
  factionId: number;
  secondaryFaction?: Faction;
  secondFactionId: number;
  agenda: Agenda;
  agendaId: number;
}
