import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment as env } from 'src/environments/environment.development';
import { INITIAL_STATE } from 'src/types/types';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  game_state = signal(INITIAL_STATE);

  private http = inject(HttpClient);

  checkWord(word: string) {
    //console.log(env.SERVER_URL + 'check/' + word)
    return this.http.get(env.SERVER_URL + 'api/v2/entries/en/' + word).pipe(
      catchError((err) => {
        //console.log('found an error ', err);
        return throwError(() => err);
      })
    );
  }
}
