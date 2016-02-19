import {DeckType} from './deck-type.model';
import {GamePlayer} from './game-player.model';

export interface Game {
  gameId: number;
  date: string; //ISO STRING
  coreSetCount: number;
  //deckTypeId: number;
  deckType: DeckType;
  gamePlayers: GamePlayer[];
}

/*
 public class GameIndexViewModel
 {
 public SetOfResults AllResults { get; set; }
 public List<Season> Seasons { get; set; }
 public string Output { get; set; }
 }

 public class Season : SetOfResults
 {
 public Season(DateTime startDate, DateTime endDate)
 {
 StartDate = startDate;
 EndDate = endDate;
 }

 public string Name
 {
 get { return string.Format("Q{0} {1}",(StartDate.Month + 2) / 3, StartDate.Year); }
 }

 public DateTime StartDate { get; private set; }
 public DateTime EndDate { get; private set; }
 }

 public class SetOfResults
 {
 public List<Game> Games { get; set; }
 public List<PlayerRanking> RankedPlayers { get; set; }
 public List<PlayerRanking> RankedFactions { get; set; }
 public List<PlayerRanking> RankedAgendas { get; set; }
 public Dictionary<int, List<GameResult>> PlayerWinLossRecord { get; set; }
 }*/
