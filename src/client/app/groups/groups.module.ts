import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GroupsComponent } from './groups.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsContainerComponent } from './groups.container';

@NgModule({
  imports: [CommonModule, SharedModule, GroupsRoutingModule],
  declarations: [GroupsComponent, GroupsContainerComponent],
  // exports: []
})
export class GroupsModule {
}
