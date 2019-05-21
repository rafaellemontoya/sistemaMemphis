import { Injectable } from '@angular/core';
import { Empleado } from '../intefaces/empleado.interface';
import { Observable , of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {
  keyEmpleado: string;
  empleado: Empleado;
  haySesion = false;
  constructor() { }

  getCurrentKey() {
    return this.keyEmpleado;
  }

  setCurrentUser(keyEmpleado: string, empleado: Empleado) {
    this.keyEmpleado = keyEmpleado;
    this.empleado = empleado;

    this.haySesion = true;
  }


  getUserName(): string {

    return this.empleado.nombre as string;
  }
  getCurrentEmpleado(): Observable<Empleado> {
    return of (this.empleado);
  }

  getCurrentEmpleado2(): Observable<Boolean> {
    return of (this.haySesion);
  }


}
