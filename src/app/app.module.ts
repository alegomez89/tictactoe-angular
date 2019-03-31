import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from "@angular/router";
import { RoomComponent } from './room/room.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { IndexComponent } from './index/index.component';
import { GameService } from "../providers/game/game.service";
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'room/:chips', component: RoomComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    NotFoundComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
