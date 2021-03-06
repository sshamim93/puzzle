import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, updateReadingItem } from '@tmo/books/data-access';
import { SnackBar, ReadingListItem } from '@tmo/shared/models';
import { SnackBarComponent } from '../snack-bar/snack-bar-component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import * as moment from 'moment'; 

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store, private _snackBar: MatSnackBar) {}

  configSuccess: MatSnackBarConfig = {
    panelClass: ['alert-red'],
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  }


  openSnackBar(item:ReadingListItem, action:string) {
    let snackData = {} as SnackBar;
    snackData.item = item;
    snackData.action = action
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: snackData,
      ...this.configSuccess
    });
  }


  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.openSnackBar(item,"Removed")

  }

  markFinishedInReadingList(data: ReadingListItem) {
    let item = <ReadingListItem>{};
    Object.assign(item, data, { finished: !data.finished, finishedDate: data.finished === false ||
       data.finished === undefined ? moment().format('MMMM Do YYYY, h:mm:ss a') : "" })
    console.log(item)
    this.store.dispatch(updateReadingItem({ item }));
  }

 

}
