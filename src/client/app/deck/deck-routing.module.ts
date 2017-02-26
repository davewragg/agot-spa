import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewDeckPageComponent } from './deck.container';
import { CreateDeckComponent } from './create-deck.component';
import { EditDeckPageComponent } from './edit-deck.container';
import { DeckExistsGuard } from '../state-management/guards/deck-exists';
import { DeckIsDirtyGuard } from '../state-management/guards/deck-is-dirty';

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
        component: EditDeckPageComponent,
        canActivate: [DeckExistsGuard],
        canDeactivate: [DeckIsDirtyGuard],
        // todo guard for checking edit rights[creatorId]/thrones db id
      },
      // TODO /deck or /decks?
      { path: 'decks/new', component: CreateDeckComponent } // TODO /deck or /decks?
    ])
  ],
  exports: [RouterModule]
})
export class DeckRoutingModule {
}
