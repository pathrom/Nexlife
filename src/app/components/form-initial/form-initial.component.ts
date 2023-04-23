import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-initial',
  templateUrl: './form-initial.component.html',
  styleUrls: ['./form-initial.component.scss'],
})
export class FormInitialComponent implements OnInit {
  items: MenuItem[];
  activeIndex: number = 0;
  myForm: FormGroup;
  paises: SelectItem[];

  constructor(private fb: FormBuilder, private router: Router) {
    this.setLanguages();
    this.initializeForm();
  }

  setLanguages() {
    this.paises = [
      { label: 'Selecciona un país', value: null },
      {
        label: 'Estados Unidos',
        value: 'US',
      },
      { label: 'México', value: 'MX' },
      { label: 'España', value: 'ES' },
      { label: 'Argentina', value: 'AR' },
      { label: 'Colombia', value: 'CO' },
    ];
  }

  initializeForm() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      age: ['', Validators.required],
      job: ['', Validators.required],
      hobbies: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.items = [{ label: '' }, { label: '' }, { label: '' }];
  }

  onSubmit() {
    if (this.myForm.valid) {
      Swal.fire(' ', 'Welcome to the chat', 'success').then(() => {
        this.router.navigate(['/chat'], { queryParams: { profileData: JSON.stringify(this.myForm.value) } });
      });

      setTimeout(() => {
        this.router.navigate(['/chat'], { queryParams: { profileData: JSON.stringify(this.myForm.value) } });
      }, 4000);
    } else {
      console.log('Formulario inválido');
      Swal.fire('Invalid Form', '', 'error');
    }
  }

  backStep() {
    this.activeIndex = this.activeIndex - 1;
    console.log('🚀 ~ FormInitialComponent ~ backStep ~ this.activeIndex:', this.activeIndex);
  }

  nextStep() {
    if (this.activeIndex == 0 && this.myForm.controls['name'].invalid && this.myForm.controls['surname'].invalid) {
      Swal.fire('Name/Surname Invalid', '', 'error');
      return;
    }
    if (this.activeIndex == 1 && this.myForm.controls['email'].invalid) {
      Swal.fire('Email Invalid', '', 'error');
      return;
    }
    if (this.activeIndex == 2 && this.myForm.controls['country'].invalid && this.myForm.controls['age'].invalid && this.myForm.controls['job'].invalid && this.myForm.controls['hobbies'].invalid) {
      Swal.fire('Country Invalid or Age Invalid or Job Invalid or Hobbies Invalid', '', 'error');
      return;
    }
    this.activeIndex = this.activeIndex + 1;

    if (this.activeIndex == 3) {
      this.onSubmit();
    }
  }
}
