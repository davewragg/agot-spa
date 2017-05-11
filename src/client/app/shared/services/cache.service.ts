import { Injectable } from '@angular/core';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CacheService {
  private _caches: Map<string, Map<string, any>> = new Map<string, Map<string, any>>();

  invalidate() {
    console.log('!::invalidate caches');
    this._caches.forEach((cache) => {
      cache.clear();
    });
  }

  setValue(cacheName: string, key: string, value: any) {
    const cache = this._caches.get(cacheName) || new Map<string, any>();
    console.log('set cache value', key);
    cache.set(key, value);
    console.log(`::${cacheName} cache size`, cache.size);
    this._caches.set(cacheName, cache);
  }

  getValue(cacheName: string, key: string) {
    if (!this._caches.has(cacheName)) {
      console.log('no cache for', cacheName);
      return null;
    }
    const cache = this._caches.get(cacheName);
    return cache.get(key) || null;
  }

  getFilteredData(dataName: string,
                  dataCall: (criteria: FilterCriteria) => Observable<any>,
                  filterCriteria: FilterCriteria,
                  scope: any): Observable<any> {
    const key: string = filterCriteria ? JSON.stringify(filterCriteria) : 'ALL';
    console.log(dataName, 'get data', key);
    const cachedData = this.getValue(dataName, key);
    if (cachedData) {
      console.log('::cached');
      return cachedData;
    }
    console.log('::not cached');
    const data = dataCall.call(scope, filterCriteria)
      .publishReplay(1).refCount();
    this.setValue(dataName, key, data);

    return data;
  }
}
