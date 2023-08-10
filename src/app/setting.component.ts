import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IState, INITIAL_STATE } from 'src/types/types';
import { DataService } from './data.service';

@Component({
  selector: 'app-setting',
  template: `
    <h3>Change the complexity of the game by changing the number of letters</h3>
    <form [formGroup]="myForm">
      <input
        type="number"
        formControlName="complexity"
        maxlength="5"
        size="5"
      />
      <div
        *ngIf="complexity.invalid && (complexity.dirty || complexity.touched)"
      >
        <div *ngIf="complexity.errors?.['required']">Email is required</div>
        <div *ngIf="complexity.errors?.['min']">
          Complexity must be a value between 3 and 26,
        </div>
        <div *ngIf="complexity.errors?.['max']">
          Complexity must be a value between 3 and 26,
        </div>
      </div>
      <br />
      <button
        type="button"
        class="btn mr-2 mt-3 mb-2 mb-m-0  btn-outline-secondary"
        [disabled]="myForm.invalid"
        (click)="saveSetting()"
      >
        Save
      </button>
      <button
        type="button"
        class="btn mb-2 mt-3 mb-m-0  btn-outline-secondary"
        (click)="goToGame()"
      >
        Back to Game
      </button>
    </form>
  `,
  styles: [],
})
export class SettingComponent {
  private router = inject(Router);
  dataService = inject(DataService);

  myForm = inject(FormBuilder).nonNullable.group({
    complexity: [
      this.dataService.game_state().complexity,
      [Validators.required, Validators.min(3), Validators.max(26)],
    ],
  });
  get complexity() {
    return this.myForm.get('complexity') as FormControl;
  }

  saveSetting() {
    this.dataService.game_state.mutate(
      (state) => (state.complexity = this.complexity.value)
    );
    localStorage.setItem(
      'GAME_STATE',
      JSON.stringify(this.dataService.game_state())
    );
    this.router.navigate(['', 'words']);
  }
  goToGame() {
    this.router.navigate(['', 'words']);
  }
}
