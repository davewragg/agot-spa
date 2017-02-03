import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewDeckPageComponent } from './deck.container';
import { CreateDeckComponent } from './create-deck.component';
import { DeckExistsGuard } from '../state-management/guards/deck-exists';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'decks/:id',
        component: ViewDeckPageComponent,
        canActivate: [DeckExistsGuard],
      },
      // TODO /deck or /decks?
      { path: 'decks/new', component: CreateDeckComponent } // TODO /deck or /decks?
    ])
  ],
  exports: [RouterModule]
})
export class DeckRoutingModule {
}
