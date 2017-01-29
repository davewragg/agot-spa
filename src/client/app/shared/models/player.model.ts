import { PlayerGroup } from './player-group.model';

export interface Player {
  playerId: string;
  name: string;
  mostPlayedFactionId: number;
  playerGroups?: PlayerGroup[];
}
