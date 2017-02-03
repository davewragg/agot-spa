import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DeckRoutingModule } from './deck-routing.module';
import { DeckDetailsComponent } from './deck-details.component';
import { DeckEditFormComponent } from './deck-edit-form.component';
import { DeckImportFormComponent } from './deck-import-form.component';
import { ViewDeckComponent } from './view-deck.component';
import { DeckStatsComponent } from './deck-stats.component';
import { CreateDeckComponent } from './create-deck.component';
import { SelectedDeckPageComponent } from './selected-deck.container';
import { ViewDeckPageComponent } from './deck.container';

@NgModule({
  imports: [CommonModule, SharedModule, DeckRoutingModule],
  declarations: [
    CreateDeckComponent,
    DeckDetailsComponent,
    DeckEditFormComponent,
    DeckImportFormComponent,
    DeckStatsComponent,
    ViewDeckComponent,
    SelectedDeckPageComponent,
    ViewDeckPageComponent,
  ],
  exports: [DeckImportFormComponent, DeckEditFormComponent]
})
export class DeckModule {
}
