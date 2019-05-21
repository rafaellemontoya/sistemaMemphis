import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { Venta } from 'src/app/intefaces/venta.interface';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Empleado } from 'src/app/intefaces/empleado.interface';

@Component({
  selector: 'app-ver-direccion-envio',
  templateUrl: './ver-direccion-envio.component.html',
  styleUrls: ['./ver-direccion-envio.component.css']
})
export class VerDireccionEnvioComponent implements OnInit {
  itemVenta: Observable<any>;
  itemsRef: any;
  submitted = false;
  venta: Venta;
  empleadoActual: Empleado;
  constructor( private route: ActivatedRoute, private firebaseDB: AngularFireDatabase, private location: Location,
    private sessionService: SessionServiceService, private router: Router) {
    this.haySesion();
    this.venta = new Venta();
    this.itemsRef = firebaseDB.list('ventas');
   }

  ngOnInit() {
    this.route.params.subscribe( parametros => {

      this.getInfoVenta(parametros.id);
      // this.getQuery();
    });
  }

  haySesion() {
    if (this.sessionService.empleado !== undefined) {
      // hay sesion
      this.empleadoActual = this.sessionService.empleado;
    } else {

        this.router.navigate(['/login']);
    }
  }

  getInfoVenta(keyVenta: string) {
    this.itemVenta = this.firebaseDB.list('/ventas', ref => ref.orderByKey().equalTo(keyVenta)).valueChanges();
    this.itemVenta.subscribe(element => {
      this.venta.key = keyVenta;
      this.venta.ciudad = this.revisarUndefined(element[0].cliente.ciudad);
      this.venta.cp = this.revisarUndefined(element[0].cliente.cp);
      this.venta.estado = this.revisarUndefined(element[0].cliente.estado);
      this.venta.calleNum = this.revisarUndefined(element[0].cliente.calleNum);
      this.venta.telefono = this.revisarUndefined(element[0].cliente.telefono);
      this.venta.numeroInterior = this.revisarUndefined(element[0].cliente.numeroInterior);
      this.venta.nombreCliente = this.revisarUndefined(element[0].cliente.nombre);
      this.venta.keyPublico = this.revisarUndefined(element[0].keyPublico);
    });
  }

  revisarUndefined(elemento: any) {
    if ( elemento !== undefined) {
      return elemento;
    } else {
      return '';
    }
  }

  updateInfo() {
    this.itemsRef.update(this.venta.key + '/cliente', {

      calleNum: this.venta.calleNum,
      ciudad: this.venta.ciudad,
      cp: this.venta.cp,
      estado: this.venta.estado,
      numeroInterior: this.venta.numeroInterior,
      telefono: this.venta.telefono,
    });
    this.submitted = true;
    window.scroll(0, 0);
  }
  atras() {
    this.location.back();
  }
}
