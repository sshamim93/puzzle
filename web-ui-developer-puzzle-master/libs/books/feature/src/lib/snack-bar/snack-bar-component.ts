import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { removeFromReadingList, addToReadingList } from '@tmo/books/data-access';
import { ReadingListItem, Book, SnackBar } from 'libs/shared/models/src/models';

@Component({
    selector: 'snack-bar-component',
    templateUrl: 'snack-bar-component.html',
})
export class SnackBarComponent {
    constructor(private readonly store: Store,
        public snackBarRef: MatSnackBarRef<SnackBarComponent>,
        @Inject(MAT_SNACK_BAR_DATA) public data: any) { }


    test(data: SnackBar) {
        let item = <ReadingListItem>{};
        if (data.action === "Added") {
            item.bookId = data.id;
            this.store.dispatch(removeFromReadingList({ item }));
            this.snackBarRef.dismiss()
        } else {
            let book: Book = <Book>{};
            Object.assign(book, data.item);
            book.id = data.item.bookId
            this.store.dispatch(addToReadingList({ book }));
            this.snackBarRef.dismiss()
        }

    }

}