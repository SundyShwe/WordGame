import { Component, inject } from '@angular/core';
import { DataService } from './data.service';
import {
  GUESS_RESULT,
  INITIAL_STATE,
  IResponse,
  IState,
  ITry,
} from 'src/types/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-words',
  template: `
    <nav>
      <div id="scores">
        <h3 class="heading-section">Your Scores</h3>
        <i class="bi-check-square word-icon"></i>
        <span style="padding-right: 10px;">
          {{ dataService.game_state().win_count }}
        </span>

        <i class="bi-x-square word-icon"></i>
        <span>
          {{ dataService.game_state().loss_count }}
        </span>
      </div>
      <div id="menu">
        <a [routerLink]="['', 'words']" title="Home">
          <i class="bi bi-house-heart-fill word-icon"></i>
        </a>
        <a [routerLink]="['', 'history']" title="History">
          <i class="bi bi-clock-history word-icon"></i>
        </a>
        <a [routerLink]="['', 'setting']" title="Setting">
          <i class="bi bi-gear word-icon"></i>
        </a>
      </div>
    </nav>
    <div class="answer">
      <h4>Your Word</h4>
      <div class="box">
        <button
          type="button"
          class="btn mb-2 mb-m-0 btn-outline-secondary"
          *ngFor="let c of answerChar"
          (click)="removeWord(c)"
        >
          {{ c | uppercase }}
        </button>
      </div>
    </div>

    <div>
      <button
        type="button"
        class="btn mr-2 mb-2 mb-m-0 btn-outline-quarternary"
        (click)="clearAndLoad()"
      >
        Shuffle
      </button>

      <button
        *ngFor="let char of gameChar"
        (click)="addtoAnswer(char)"
        type="button"
        class="btn mr-2 mb-2 mb-m-0 btn-outline-quarternary"
      >
        {{ char | uppercase }}
      </button>
      <button
        (click)="checkWord()"
        type="button"
        class="btn mr-2 mb-2 mb-m-0 btn-outline-quarternary"
      >
        Check
      </button>
      <button
        type="button"
        class="btn mb-2 mb-m-0 btn-outline-secondary"
        (click)="clearAnswer()"
      >
        Clear
      </button>
    </div>

    <div class="rule">
      <h3>Game Rules</h3>
      <ul>
        <li>Click on each character to form a word</li>
        <li>
          To remove a charcter from the word, click on it inside the answer box.
        </li>
        <li>Click on "Shuffle" to get a new set of Character.</li>
        <li>Click on "Check" to check if the word is proper word</li>
        <li>
          Click on "Clear" to clear all selected characters for your word.
        </li>
        <li>
          You can check your score history in History
          <i class="bi bi-clock-history word-icon"></i> page
        </li>
        <li>
          Change the setting <i class="bi bi-gear word-icon"></i> for number of
          charaters to display
        </li>
      </ul>
    </div>
  `,
  styles: [
    'nav {display: flex; justify-content:space-between }',
    '#score{float:left}',
    '.word-icon { font-size: 20px; color : #ff78ae; padding: 5px}',
    '.clear { float: right}',
    '.answer{ padding-top: 10px;}',
    '.rule{margin-top: 20px;}',
  ],
})
export class WordsComponent {
  dataService = inject(DataService);
  answerChar: string[] = [];
  gameChar: string[] = [];
  gameResult!: IResponse;
  gameTry!: ITry;
  sub!: Subscription;

  ngOnInit() {
    this.loadGameChar();
  }

  loadGameChar() {
    this.gameChar = this.getRandomLettersArrayOf(
      this.dataService.game_state().complexity
    );
  }

  clearAnswer() {
    this.answerChar = [];
  }

  clearAndLoad() {
    this.clearAnswer();
    this.loadGameChar();
  }
  private getRandomLettersArrayOf(length: number): string[] {
    let result: string[] = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    while (result.length < length) {
      const letter = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      if (!result.includes(letter)) result.push(letter);
    }
    return result;
  }

  addtoAnswer(char: string) {
    this.answerChar.push(char);
  }

  removeWord(char: string) {
    this.answerChar = this.answerChar.filter((c) => c != char);
  }

  checkWord() {
    const answer = this.answerChar.join('');

    this.sub = this.dataService.checkWord(answer).subscribe(
      (resp) => {
        try {
          this.dataService.game_state.mutate((state) => ++state.win_count);
          this.dataService.game_state.mutate((state) =>
            state.logs.push({
              word: answer,
              result: GUESS_RESULT.Correct,
              timestamp: Date.now(),
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
      (err) => {
        // console.log('HTTP Error', err);
        this.dataService.game_state.mutate((state) => ++state.loss_count);
        this.dataService.game_state.mutate((state) =>
          state.logs.push({
            word: answer,
            result: GUESS_RESULT.Incorrect,
            timestamp: Date.now(),
          })
        );
      }
    );

    localStorage.setItem(
      'GAME_STATE',
      JSON.stringify(this.dataService.game_state())
    );
    this.clearAnswer();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
