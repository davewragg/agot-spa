import { SetOfResults } from './set-of-results.model';
import { Season } from './season.model';

/**
 * @deprecated
 * */
export interface GameIndex {
  allResults: SetOfResults;
  seasons: Season[];
}
