import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeckDetailsComponent } from './deck-details.component';
import { CreateDeckComponent } from './create-deck.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'decks/:id', component: DeckDetailsComponent }, // TODO /deck or /decks?
      { path: 'decks/new', component: CreateDeckComponent } // TODO /deck or /decks?
    ])
  ],
  exports: [RouterModule]
})
export class DeckRoutingModule {
}
