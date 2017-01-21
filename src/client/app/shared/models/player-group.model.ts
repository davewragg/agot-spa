import { Player } from './player.model';

export interface PlayerGroup {
  id: number;
  name: string;
  location?: string;
  country?: string;
  description?: string;
  players?: Player[];
}
