import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { ViewJobsComponent } from './view-jobs/view-jobs.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateJobComponent,
    ViewJobsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,      
    HttpClientJsonpModule,
    ReactiveFormsModule,
    FullCalendarModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
