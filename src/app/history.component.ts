import { Component, inject } from '@angular/core';
import { GUESS_RESULT, IState, INITIAL_STATE, ITry } from 'src/types/types';
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  template: `
    <div class="d-flex justify-content-center">
      <table class="table table-dark">
        <thead class="thead-dark">
          <td scope="col">Words</td>
          <td scope="col">Results</td>
          <td scope="col">Date</td>
        </thead>
        <tr
          *ngFor="let try of dataService.game_state().logs"
          [ngClass]="isCorrect(try.result) ? 'green-bg' : 'red-bg'"
        >
          <td>{{ try.word }}</td>
          <td>{{ try.result }}</td>
          <td>{{ try.timestamp | date }}</td>
        </tr>
      </table>
    </div>
    <div class="mt-3 d-flex justify-content-center">
      <button
        type="button"
        class="btn mr-2 mb-2 mb-m-0 btn-outline-secondary"
        (click)="clearHistory()"
      >
        Clear History
      </button>
      <button
        type="button"
        class="btn mb-2 mb-m-0  btn-outline-secondary"
        (click)="goToGame()"
      >
        Back to Game
      </button>
    </div>
  `,
  styles: [
    'table thead {padding:5px; font-weight: bold;}',
    'table td {padding:10px;}',
    '.green-bg {background-color:#5A8B4A}',
    '.red-bg {background-color:#BF1C2C}',
  ],
})
export class HistoryComponent {
  dataService = inject(DataService);
  private router = inject(Router);

  isCorrect(result: GUESS_RESULT) {
    return result == GUESS_RESULT.Correct ? true : false;
  }

  clearHistory() {
    this.dataService.game_state.set({
      complexity: 5,
      win_count: 0,
      loss_count: 0,
      logs: [] as ITry[],
    });
    console.log(this.dataService.game_state());
    localStorage.clear();
  }

  goToGame() {
    this.router.navigate(['', 'words']);
  }
}
