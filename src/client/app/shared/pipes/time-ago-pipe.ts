/* angular2-moment (c) 2015, 2016 Uri Shaked / MIT Licence */
import { Pipe, ChangeDetectorRef, PipeTransform, OnDestroy } from '@angular/core';
import { differenceInMinutes, distanceInWordsToNow } from 'date-fns';

@Pipe({ name: 'amTimeAgo', pure: false })
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private _currentTimer: number;

  static _getSecondsUntilUpdate(date: Date) {
    const howOld = Math.abs(differenceInMinutes(new Date(), date));
    if (howOld < 1) {
      return 1;
    } else if (howOld < 60) {
      return 30;
    } else if (howOld < 180) {
      return 300;
    } else {
      return 3600;
    }
  }

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  transform(value: Date, ...args: any[]): any {
    this._removeTimer();
    const timeToUpdate = TimeAgoPipe._getSecondsUntilUpdate(value) * 1000;
    this._currentTimer = window.setTimeout(() => this._cdRef.markForCheck(), timeToUpdate);
    return distanceInWordsToNow(value, {addSuffix: true});
  }

  ngOnDestroy(): void {
    this._removeTimer();
  }

  _removeTimer() {
    if (this._currentTimer) {
      window.clearTimeout(this._currentTimer);
      this._currentTimer = null;
    }
  }
}
