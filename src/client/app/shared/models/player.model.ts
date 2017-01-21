import { PlayerGroup } from './player-group.model';

export interface Player {
  playerId: number;
  name: string;
  mostPlayedFactionId: number;
  playerGroups?: PlayerGroup[];
}
