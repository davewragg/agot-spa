import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DeckRoutingModule } from './deck-routing.module';
import { DeckDetailsComponent } from './deck-details.component';
import { DeckEditFormComponent } from './deck-edit-form.component';
import { DeckImportFormComponent } from './deck-import-form.component';
import { ViewDeckComponent } from './view-deck.component';
import { DeckStatsComponent } from './deck-stats.component';
import { SelectedDeckPageComponent } from './selected-deck.container';
import { ViewDeckPageComponent } from './deck.container';
import { EditDeckPageComponent } from './edit-deck.container';
import { DeckExistsGuard } from '../state-management/guards/deck-exists';
import { DeckIsDirtyGuard } from '../state-management/guards/deck-is-dirty';
import { CanEditDeckGuard } from '../state-management/guards/deck-can-edit';
import { CanEditGroupGuard } from '../state-management/guards/group-can-edit';

@NgModule({
  imports: [CommonModule, SharedModule, DeckRoutingModule],
  declarations: [
    DeckDetailsComponent,
    DeckEditFormComponent,
    DeckImportFormComponent,
    DeckStatsComponent,
    ViewDeckComponent,
    SelectedDeckPageComponent,
    ViewDeckPageComponent,
    EditDeckPageComponent,
  ],
  providers: [
    DeckExistsGuard,
    DeckIsDirtyGuard,
    CanEditDeckGuard,
    CanEditGroupGuard
  ],
  exports: [DeckImportFormComponent, DeckEditFormComponent]
})
export class DeckModule {
}
