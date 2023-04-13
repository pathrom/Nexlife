import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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

  onSubmit() {
    if (this.myForm.valid) {
      console.log('Formulario enviado:', this.myForm.value);
      // Aquí puedes agregar la lógica para manejar el envío de los datos del formulario
    } else {
      console.log('Formulario inválido');
    }
  }
}
