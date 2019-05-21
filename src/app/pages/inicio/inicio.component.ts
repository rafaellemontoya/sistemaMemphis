import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/intefaces/empleado.interface';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  empleado: Empleado;
  empleadoActual: Empleado;
  constructor(private sessionService: SessionServiceService, private router: Router) {
    this.haySesion();
    this.empleado = sessionService.empleado;

   }

  ngOnInit() {

  }
  haySesion() {
    if (this.sessionService.empleado !== undefined) {
      // hay sesion
      this.empleadoActual = this.sessionService.empleado;
    } else {

        this.router.navigate(['/login']);
    }
  }
}
