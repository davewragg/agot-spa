import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DeckRoutingModule } from './deck-routing.module';
import { DeckDetailsComponent } from './deck-details.component';
import { DeckEditFormComponent } from './deck-edit-form.component';
import { DeckImportFormComponent } from './deck-import-form.component';
import { ViewDeckComponent } from './view-deck.component';

@NgModule({
  imports: [CommonModule, SharedModule, DeckRoutingModule],
  declarations: [DeckDetailsComponent, DeckEditFormComponent, DeckImportFormComponent, ViewDeckComponent],
  // exports: [DeckDetailsComponent, ViewDeckComponent]
})
export class DeckModule {
}
