import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as moment from 'moment'; 

const KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storage.read();
  }

  async addBook(b: Book): Promise<void> {
    this.storage.update(list => {
      const { id, ...rest } = b;
      list.push({
        bookId: id,
        ...rest
      });
      return list;
    });
  }

  async removeBook(id: string): Promise<void> {
    this.storage.update(list => {
      return list.filter(x => x.bookId !== id);
    });
  }
  async updateReadingItem(id: string): Promise<void> {
    console.log(id)
    this.storage.update(list => {
      const elementsIndex = list.findIndex(item => item.bookId == id)
      //  console.log(list[elementsIndex])
      list[elementsIndex] = { ...list[elementsIndex], finished: !list[elementsIndex].finished, finishedDate: list[elementsIndex].finished === false ? 
        moment().format('MMMM Do YYYY, h:mm:ss a') : "" }
      //  console.log(list[elementsIndex])
      return list
    });
  }

}
