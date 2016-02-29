import {SetOfResults} from './set-of-results.model';

export interface Season extends SetOfResults {
  name: string;
  startDate: string; //ISO STRING
  endDate: string; //ISO STRING
}
