import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppTopbarComponent } from './layouts/app.topbar/app.topbar.component';
import { AppFooterComponent } from './layouts/app.footer/app.footer.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppFooterComponent,
    AppTopbarComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
