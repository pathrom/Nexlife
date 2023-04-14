import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

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

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pais: ['', Validators.required],
    });

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

  ngOnInit() {
    this.items = [{ label: '' }, { label: '' }, { label: '' }, { label: '' }];
  }
  onSubmit() {
    if (this.myForm.valid) {
      console.log('Formulario enviado:', this.myForm.value);
      // Aquí puedes agregar la lógica para manejar el envío de los datos del formulario
    } else {
      console.log('Formulario inválido');
    }
  }

  backStep() {
    this.activeIndex = this.activeIndex - 1;
    console.log('🚀 ~ FormInitialComponent ~ backStep ~ this.activeIndex:', this.activeIndex);
  }

  nextStep() {
    this.activeIndex = this.activeIndex + 1;
  }
}
