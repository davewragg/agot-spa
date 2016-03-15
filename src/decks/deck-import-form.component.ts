import {Component, Output, EventEmitter, Input, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {Deck} from '../shared/models/deck.model';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {ThronesDbService} from '../shared/services/thrones-db.service';
import {DeckClassBlockComponent} from '../shared/components/deck-class-block.component';

@Component({
  selector: 'agot-deck-import-form',
  moduleId: module.id,
  templateUrl: './deck-import-form.component.html',
  directives: [SpinnerComponent, DeckClassBlockComponent]
})
export class DeckImportFormComponent implements OnInit {
  @Input()
  creating:boolean;
  @Output()
  updateDeck:EventEmitter<Deck> = new EventEmitter<Deck>();

  importForm:ControlGroup;
  importedDeck:Deck;
  isImporting:boolean;
  importError:any;

  constructor(private _formBuilder:FormBuilder,
              private thronesDbService:ThronesDbService) {
    // TODO probably async
  }

  ngOnInit() {
    this.populateForm();
  }

  onSubmit() {
    // new properties default to strings
    const thronesDbId:number = +this.importForm.controls['thronesDbId'].value;

    console.log(thronesDbId);
    this.isImporting = true;
    this.thronesDbService.importAndConvertThronesDbDeck(thronesDbId).subscribe(
      (deck:Deck) => {
        if (!deck) {
          this.importError = 'Not found';
        } else {
          this.importedDeck = deck;
        }
      },
      (error:Error) => {
        console.error(error);
        this.importError = error.message || error;
        this.isImporting = false;
      },
      () => this.isImporting = false
    );
  }

  onDeckSelect() {
    console.log(this.importedDeck);
    this.updateDeck.emit(this.importedDeck);
  }

  private populateForm() {
    let thronesDbId = '';
    this.importForm = this._formBuilder.group({
      thronesDbId: [thronesDbId, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
    });
  };
}
