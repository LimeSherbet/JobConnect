import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrl: './create-job.component.css'
})

export class CreateJobComponent implements OnInit {
  jobForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.jobForm = this.fb.group({
      Company_CompanyName: ['', Validators.required],
      jobDescription: ['', Validators.required],
      payRangeLower: ['', [Validators.required, Validators.min(0)]],
      payRangeUpper: ['', [Validators.required, Validators.min(0)]],
      jobTitle: ['', Validators.required],
      minimumExperience: ['', Validators.required],
      skills: this.fb.array([]),
      qualifications: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addSkill();
    this.addQualification();
  }

  get skills(): FormArray {
    return this.jobForm.get('skills') as FormArray;
  }

  get qualifications(): FormArray {
    return this.jobForm.get('qualifications') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  addQualification(): void {
    this.qualifications.push(this.fb.control('', Validators.required));
  }

  removeQualification(index: number): void {
    this.qualifications.removeAt(index);
  }

  onSubmit(): void {
  }
}
