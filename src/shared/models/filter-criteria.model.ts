import {DateRangeType} from './date-range-type.model';

export interface FilterCriteria {
  fromDate?: string; //iso
  toDate?: string; //iso
  ascending: boolean;
  rangeSelection?: DateRangeType;
  playerIds?: number[];
  factionIds?: number[];
  agendaIds?: number[];
  deckIds?: number[];
}
