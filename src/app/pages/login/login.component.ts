import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/intefaces/empleado.interface';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  itemPedido: Observable<any[]>;
  empleado: Empleado;
  constructor(private firebaseDB: AngularFireDatabase, private router: Router,
               private sessionService: SessionServiceService, private location: Location) { }

  ngOnInit() {
  }

  makeLogin() {

    this.itemPedido = this.firebaseDB.list('/empleados',
    ref => ref.orderByChild('usuario').equalTo(this.email)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({

          key: c.payload.key, ...c.payload.val() }))
      )
    );

    // subscribe to changes
    this.itemPedido.subscribe(queriedItems => {
      if (queriedItems[0].usuario === this.email && queriedItems[0].password === this.password) {
        this.sessionService.setCurrentUser(queriedItems[0].key, queriedItems[0]);
        this.empleado = queriedItems[0];
        this.sessionService.empleado = queriedItems[0];
        this.sessionService.keyEmpleado = queriedItems[0].key;

        this.router.navigate(['/inicio']);

      }
    });
  }

}
