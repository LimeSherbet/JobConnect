import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-view-jobs',
  templateUrl: './view-jobs.component.html',
  styleUrl: './view-jobs.component.css'
})

export class ViewJobsComponent {
  jobs: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getJobs();
  }

  getJobs(): void {
    this.http.get<any[]>('http://localhost:3000/get-jobs')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          // this.jobs = data;
          this.jobs = data.map(job => ({
            ...job,
            skills: JSON.parse(job.skills),
            qualifications: JSON.parse(job.qualifications)
          }));
        },
        error => {
          console.error('Error: Cannot retrieve jobs:', error);
        }
      );
  }
}
