import { Injectable } from '@angular/core';
import { startOfQuarter, endOfQuarter, subDays, startOfDay, endOfDay } from 'date-fns';
import { FilterCriteria } from '../models/filter-criteria.model';
import { DateRangeType } from '../models/date-range-type.model';

@Injectable()
export class DateService {
  private today: string;
  private aWeekAgo: string;

  private static setAllTime(criteria: FilterCriteria) {
    return DateService.setDates(criteria, null, null);
  }

  private static setCurrentSeason(criteria: FilterCriteria) {
    const currentSeason = DateService.getCurrentSeason();
    return DateService.setDates(criteria, currentSeason.startDate, currentSeason.endDate);
  }

  private static getCurrentSeason(): any {
    // TODO this is a bit of a cheat
    const now = new Date();
    return {
      startDate: startOfQuarter(now).toISOString().slice(0, 10),
      endDate: endOfQuarter(now).toISOString().slice(0, 10),
    };
  }

  private static setDates(criteria: FilterCriteria, fromDate?: string, toDate?: string) {
    return FilterCriteria.patchValues(criteria, {
      fromDate,
      toDate,
    });
  }

  constructor() {
    const now = new Date();
    this.today = endOfDay(now).toISOString();
    this.aWeekAgo = startOfDay(subDays(now, 7)).toISOString();
  }

  setDatesFromRangeType(criteria: FilterCriteria) {
    const range = criteria.rangeSelection;
    if (range === DateRangeType.THIS_WEEK) {
      return this.setAWeekAgo(criteria);
    } else if (range === DateRangeType.CURRENT_SEASON) {
      return DateService.setCurrentSeason(criteria);
    } else if (range === DateRangeType.ALL_TIME) {
      return DateService.setAllTime(criteria);
    }
    return criteria;
  }

  private setAWeekAgo(criteria: FilterCriteria) {
    return DateService.setDates(criteria, this.aWeekAgo, this.today);
  }
}
