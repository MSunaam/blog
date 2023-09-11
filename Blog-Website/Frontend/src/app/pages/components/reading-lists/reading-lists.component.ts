import { AfterViewInit, Component, Input } from '@angular/core';
import { ReadingList } from 'src/app/shared/Interfaces/readingLists';

@Component({
  selector: 'app-reading-lists',
  templateUrl: './reading-lists.component.html',
  styleUrls: ['./reading-lists.component.scss'],
})
export class ReadingListsComponent implements AfterViewInit {
  scrollLeftAmount: number = 220;

  readingList: ReadingList[] = [
    {
      id: 1,
      title: 'Technology',
      image: './assets/ReadingLists/ui-design.png',
    },
    {
      id: 2,
      title: 'Health & Wellness',
      image: './assets/ReadingLists/ux-design.png',
    },
    {
      id: 3,
      title: 'Travel',
      image: './assets/ReadingLists/seo.png',
    },
    {
      id: 4,
      title: 'Food & Cooking',
      image: './assets/ReadingLists/popular.png',
    },
    {
      id: 5,
      title: 'Science & Education',
      image: './assets/ReadingLists/essentials.png',
    },
    {
      id: 6,
      title: 'Art & Creativity',
      image: './assets/ReadingLists/essentials.png',
    },
    {
      id: 7,
      title: 'Personal Stories',
      image: './assets/ReadingLists/essentials.png',
    },
    {
      id: 8,
      title: 'Environment & Sustainability',
      image: './assets/ReadingLists/essentials.png',
    },
  ];

  scrollLeft() {
    document.getElementById('readingList')!.scrollBy({
      left: -this.scrollLeftAmount,
      behavior: 'smooth',
    });
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
