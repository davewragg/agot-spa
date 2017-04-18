import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupsContainerComponent } from './groups.container';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'groups', component: GroupsContainerComponent }
    ])
  ],
  exports: [RouterModule]
})
export class GroupsRoutingModule {
}
