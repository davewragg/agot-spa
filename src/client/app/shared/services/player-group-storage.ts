import { localStorageAdapter } from './local-storage';
import { PLAYER_GROUP_STORAGE_KEY } from '../../constants';

export const playerGroupStorage = {
  clear(): void {
    localStorageAdapter.removeItem(PLAYER_GROUP_STORAGE_KEY);
  },

  get data(): any {
    return localStorageAdapter.getItem(PLAYER_GROUP_STORAGE_KEY) || {};
  },

  set data(value: any) {
    localStorageAdapter.setItem(PLAYER_GROUP_STORAGE_KEY, value);
  },

  getPlayerGroupId(): number {
    return +playerGroupStorage.data;
  },

  setPlayerGroupId(playerGroupId: number) {
    playerGroupStorage.data = playerGroupId;
  }
};
