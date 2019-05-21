import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Empleado } from 'src/app/intefaces/empleado.interface';

import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleados: Observable<any[]>;
  empleadoActual: Empleado;
  constructor(private firebaseDB: AngularFireDatabase, private sessionService: SessionServiceService, private router: Router,
     private location: Location
    ) {
    this.haySesion();
   }

  ngOnInit() {
    this.getEmpleados();
  }
  haySesion() {
    if (this.sessionService.empleado !== undefined) {
      // hay sesion
      this.empleadoActual = this.sessionService.empleado;
    } else {

        this.router.navigate(['/login']);
    }
  }
  getEmpleados() {

    this.empleados = this.firebaseDB.list('empleados').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.payload.key, ...c.payload.val() }))
      )
    );
      // aquí se ven los resultados de cada query
this.empleados.subscribe(item => {});
  }

  atras() {
    this.location.back();

  }
}
