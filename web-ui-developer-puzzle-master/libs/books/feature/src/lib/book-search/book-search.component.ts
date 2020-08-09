import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder, FormControl } from '@angular/forms';
import { Book, SnackBar } from '@tmo/shared/models';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable, Subject} from 'rxjs';
import {map, startWith, debounceTime, takeUntil} from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar-component';


@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  configSuccess: MatSnackBarConfig = {
    panelClass: ['alert-red'],
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  }

  searchForm = this.fb.group({
    term: ''
  })

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

   private ngUnsubscribe = new Subject();

  ngOnInit(): void {
     this.store.select(getAllBooks).pipe(takeUntil(this.ngUnsubscribe)).subscribe(books => {
      this.books = books;
    });

    this.filteredOptions = this.searchForm.valueChanges
      .pipe(debounceTime(500),
        startWith(''),
        map(value => this._filter(value))
      );

  }

  private _filter(value: Object): string[] {
    const filterValue = value["term"]; 
    console.log(filterValue)
    const obj = this.store.dispatch(searchBooks({ term: filterValue }));
    console.log(obj)

    return this.books.filter(book => book.title.includes(filterValue)).map(function(item) {
      return item['title'];
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }


  openSnackBar(item:Book, action:string) {
    let snackData = {} as SnackBar;
    snackData.id = item.id;
    snackData.action = action
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: snackData,
      ...this.configSuccess
    });
  }


  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    this.openSnackBar(book,"Added")
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.searchBooks()
    console.log(event.option.value);
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
