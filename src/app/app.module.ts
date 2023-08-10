import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'
import { AppComponent } from './app.component';
import { WordsComponent } from './words.component';
import { HistoryComponent } from './history.component';
import { SettingComponent } from './setting.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

function bootstrap(service: DataService) {
  return () => {
    const state = localStorage.getItem('GAME_STATE')
    if (state) {
      service.game_state.set(JSON.parse(state))
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    WordsComponent,
    HistoryComponent,
    SettingComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: WordsComponent, title: 'Word Game' },
      { path: 'words', component: WordsComponent, title: 'Word Game' },
      { path: 'history', component: HistoryComponent, title: 'Game History' },
      { path: 'setting', component: SettingComponent, title: 'Game Setting' }
    ]),
    BrowserAnimationsModule
  ],
  providers: [
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: bootstrap,
      deps: [DataService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
