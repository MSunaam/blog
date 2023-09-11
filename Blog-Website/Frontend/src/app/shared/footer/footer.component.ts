import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  isFooterCollapsed: boolean = false;

  footerText = {
    'Get in Touch': ['Social Media', 'Newsletter', 'Contact Us'],
    'On the Blog': ['Popular', 'New', 'Playlists'],
    Learn: ['UX Design', 'Wordpress', 'PHP'],
    'Social Media': [
      'bxl-facebook-circle',
      'bxl-twitter',
      'bxl-instagram-alt',
      'bxl-pinterest',
    ],
  };
}
