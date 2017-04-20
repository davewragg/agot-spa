import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PlayerGroup } from '../shared/models/player-group.model';

@Component({
  moduleId: module.id,
  selector: 'agot-group-edit-form',
  templateUrl: 'group-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerGroupEditFormComponent {
  @Input()
  creating: boolean;

  @Input()
  set playerGroup(playerGroup: PlayerGroup) {
    if (playerGroup) {
      this.playerGroupForm.patchValue(playerGroup, { emitEvent: false });
    }
  }

  @Output()
  updatePlayerGroup: EventEmitter<PlayerGroup> = new EventEmitter<PlayerGroup>();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  playerGroupForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    location: new FormControl(''),
    country: new FormControl(''),
  });

  onCancel() {
    this.cancel.emit(true);
  }

  onSubmit() {
    const playerGroupValues = this.playerGroupForm.value;
    this.updatePlayerGroup.emit(playerGroupValues);
  }
}
