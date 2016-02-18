export interface GamePlayer {
  gamePlayerId: number;
  gameId: number;
  playerId: number;
  isWinner: boolean;
  factionId: number;
  secondFaction? :number;
  agendaId?: number;
//
//virtual Agenda Agenda { get; set; }
//
//virtual Faction Faction { get; set; }
//
//virtual Faction SecondaryFaction { get; set; }
//
//virtual Game Game { get; set; }
//
//virtual Player Player { get; set; }
}
