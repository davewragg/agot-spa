import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeckDetailsComponent } from './deck-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'decks/:id', component: DeckDetailsComponent } // TODO /deck or /decks?
    ])
  ],
  exports: [RouterModule]
})
export class DeckRoutingModule {
}
