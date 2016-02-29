import {SetOfResults} from './set-of-results.model';
import {Season} from './season.model';

export interface GameIndex {
  allResults: SetOfResults;
  seasons: Season[];
}
