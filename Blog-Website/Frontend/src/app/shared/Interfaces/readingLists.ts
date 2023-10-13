export interface ReadingList {
  id: number;
  title: string;
  image: string;
  link: string;
}

export const readingList: ReadingList[] = [
  {
    id: 1,
    title: 'Technology',
    image: './assets/ReadingLists/ui-design.png',
    link: '/reading-list',
  },
  {
    id: 2,
    title: 'Health & Wellness',
    image: './assets/ReadingLists/ux-design.png',
    link: '/reading-list',
  },
  {
    id: 3,
    title: 'Travel',
    image: './assets/ReadingLists/seo.png',
    link: '/reading-list',
  },
  {
    id: 4,
    title: 'Food & Cooking',
    image: './assets/ReadingLists/popular.png',
    link: '/reading-list',
  },
  {
    id: 5,
    title: 'Science & Education',
    image: './assets/ReadingLists/essentials.png',
    link: '/reading-list',
  },
  {
    id: 6,
    title: 'Art & Creativity',
    image: './assets/ReadingLists/essentials.png',
    link: '/reading-list',
  },
  {
    id: 7,
    title: 'Personal Stories',
    image: './assets/ReadingLists/essentials.png',
    link: '/reading-list',
  },
  {
    id: 8,
    title: 'Environment & Sustainability',
    image: './assets/ReadingLists/essentials.png',
    link: '/reading-list',
  },
];
