import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewDeckPageComponent } from './deck.container';
import { EditDeckPageComponent } from './edit-deck.container';
import { DeckExistsGuard } from '../state-management/guards/deck-exists';
import { DeckIsDirtyGuard } from '../state-management/guards/deck-is-dirty';
import { CanEditDeckGuard } from '../state-management/guards/deck-can-edit';

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
        canActivate: [CanEditDeckGuard, DeckExistsGuard],
        canDeactivate: [DeckIsDirtyGuard],
      },
    ])
  ],
  exports: [RouterModule]
})
export class DeckRoutingModule {
}
