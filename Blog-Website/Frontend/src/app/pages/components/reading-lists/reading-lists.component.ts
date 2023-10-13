import { AfterViewInit, Component, Input } from '@angular/core';
import {
  ReadingList,
  readingList,
} from 'src/app/shared/Interfaces/readingLists';

@Component({
  selector: 'app-reading-lists',
  templateUrl: './reading-lists.component.html',
  styleUrls: ['./reading-lists.component.scss'],
})
export class ReadingListsComponent implements AfterViewInit {
  scrollLeftAmount: number = 220;

  readingList: ReadingList[] = readingList;

  scrollLeft() {
    document.getElementById('readingList')!.scrollBy({
      left: -this.scrollLeftAmount,
      behavior: 'smooth',
    });
    // console.log(document.getElementById('readingList'));
  }

  scrollRight() {
    document.getElementById('readingList')!.scrollBy({
      left: this.scrollLeftAmount,
      behavior: 'smooth',
    });
  }
  ngAfterViewInit() {
    document.getElementById('readingList')!.scrollTo({
      left: 0,
    });
  }
}
