import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewDeckPageComponent } from './deck.container';
import { CreateDeckComponent } from './create-deck.component';
import { DeckExistsGuard } from '../state-management/guards/deck-exists';
import { DeckDetailsComponent } from './deck-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'decks/:id',
        component: ViewDeckPageComponent,
        canActivate: [DeckExistsGuard],
      },
      {
        path: 'decks/:id/edit',
        component: DeckDetailsComponent,
        canActivate: [DeckExistsGuard], // todo guard for checking edit rights/thrones db id
      },
      // TODO /deck or /decks?
      { path: 'decks/new', component: CreateDeckComponent } // TODO /deck or /decks?
    ])
  ],
  exports: [RouterModule]
})
export class DeckRoutingModule {
}
