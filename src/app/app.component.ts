import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <h1>WORD GAME</h1>
      <router-outlet />
    </main>
  `,
  styles: ['nav a {margin-right:15px}'],
})
export class AppComponent {
  title = 'frontend';
}
