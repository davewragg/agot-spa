import { localStorageAdapter } from './local-storage';
import { REF_DATA_STORAGE_KEY } from '../../constants';
import { RefDataType } from './ref-data.type';

export const refDataStorage = {
  clear(): void {
    localStorageAdapter.removeItem(REF_DATA_STORAGE_KEY);
  },

  get data(): any {
    return localStorageAdapter.getItem(REF_DATA_STORAGE_KEY) || {};
  },

  set data(value: any) {
    localStorageAdapter.setItem(REF_DATA_STORAGE_KEY, value);
  },

  getRefData(type: RefDataType): any[] {
    return refDataStorage.data[type];
  },

  setRefData(type: RefDataType, value: any[]) {
    let data = refDataStorage.data;
    data[type] = value;
    refDataStorage.data = data;
  }
};
