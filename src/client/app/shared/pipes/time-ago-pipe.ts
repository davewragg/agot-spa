/* angular2-moment (c) 2015, 2016 Uri Shaked / MIT Licence */
import { Pipe, ChangeDetectorRef, PipeTransform, OnDestroy, NgZone } from '@angular/core';
import { differenceInMinutes, distanceInWordsToNow } from 'date-fns';

@Pipe({ name: 'amTimeAgo', pure: false })
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private currentTimer: number;

  private lastTime: Number;
  private lastValue: Date;
  private lastOmitSuffix: boolean;
  private lastText: string;

  private static getSecondsUntilUpdate(date: Date) {
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

  private static getTime(value: Date) {
    if (value instanceof Date) {
      return value.getTime();
    } else {
      return new Date(value).getTime();
    }
  }

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
  }

  transform(value: Date, omitSuffix?: boolean): string {
    if (this.hasChanged(value, omitSuffix)) {
      this.lastTime = TimeAgoPipe.getTime(value);
      this.lastValue = value;
      this.lastOmitSuffix = omitSuffix;
      this.removeTimer();
      this.createTimer();
      this.lastText = distanceInWordsToNow(value, { addSuffix: !omitSuffix });
    } else {
      this.createTimer();
    }

    return this.lastText;
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }


  private createTimer() {
    if (this.currentTimer) {
      return;
    }

    const timeToUpdate = TimeAgoPipe.getSecondsUntilUpdate(this.lastValue) * 1000;
    this.currentTimer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.lastText = distanceInWordsToNow(this.lastValue, { addSuffix: !this.lastOmitSuffix });
          this.currentTimer = null;
          this.ngZone.run(() => this.cdRef.markForCheck());
        }, timeToUpdate);
      }
      return null;
    });
  }

  private removeTimer() {
    if (this.currentTimer) {
      window.clearTimeout(this.currentTimer);
      this.currentTimer = null;
    }
  }

  private hasChanged(value: Date, omitSuffix?: boolean) {
    return TimeAgoPipe.getTime(value) !== this.lastTime || omitSuffix !== this.lastOmitSuffix;
  }
}
