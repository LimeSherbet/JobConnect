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
    if (this.jobForm.valid) {
      const formValue = {
        ...this.jobForm.value,
        skills: JSON.stringify(this.jobForm.value.skills),
        qualifications: JSON.stringify(this.jobForm.value.qualifications)
      };

      this.http.post('http://localhost:3000/create-job', formValue).subscribe({
        next: (response) => {
          console.log('Job added:', response);
          this.jobForm.reset();
          this.addSkill();
          this.addQualification();
        },
        error: (error) => {
          console.error('Cannot add job:', error);
        }
      });
    } else {
      console.error('Form is invalid.'); //usually if empty skills or qualifications box is left on the form
    }
  }

}
