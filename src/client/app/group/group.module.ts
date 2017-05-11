import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PlayerGroupRoutingModule } from './group-routing.module';
import { PlayerGroupEditFormComponent } from './group-edit-form.component';
import { SelectedPlayerGroupPageComponent } from './selected-group.container';
import { PlayerGroupPageComponent } from './group.container';
import { PlayerGroupExistsGuard } from '../state-management/guards/group-exists';

@NgModule({
  imports: [CommonModule, SharedModule, PlayerGroupRoutingModule],
  declarations: [
    PlayerGroupEditFormComponent,
    SelectedPlayerGroupPageComponent,
    PlayerGroupPageComponent,
  ],
  providers: [
    PlayerGroupExistsGuard,
  ],
})
export class PlayerGroupModule {
}
