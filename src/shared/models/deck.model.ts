export class Deck {
  deckId:number;
  factionId:number;
  agendaId:number;
  coreSetCount:number = 3;
  deckTypeId:number = 3;
  title:string;
  fallbackTitle:string;
  thronesDbId:number;
  thronesDbLink:string;
  thronesDbVersion:string;
  creatorId:number;
  // legacy
  secondFactionId:number;

  getTitle() {
     //cover legacy decks
    return this.title || this.fallbackTitle;
  }
}
