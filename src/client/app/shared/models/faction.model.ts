export interface Faction {
  factionId: number;
  name: string;
  thronesDbCode: string;
  thronesDbId: number;
  [key: string]: string | number;
}
