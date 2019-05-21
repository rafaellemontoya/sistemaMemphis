import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { Venta } from 'src/app/intefaces/venta.interface';
import { Cliente } from 'src/app/intefaces/cliente.interface';
import { Producto } from '../../intefaces/producto.interface';
import { map } from 'rxjs/operators';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/intefaces/empleado.interface';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {
  itemVenta: Observable<any>;
  itemsRef: any;
  submitted = false;
  venta: Venta;
  cliente: Cliente;
  producto: Producto;
  itemsProductosRef: AngularFireList<any>;
  itemsProductos: Observable<any[]>;
  empleadoActual: Empleado;


  constructor( private route: ActivatedRoute, private firebaseDB: AngularFireDatabase, private location: Location,
    private sessionService: SessionServiceService, private router: Router) {
      this.haySesion();
    this.venta = new Venta();
    this.itemsRef = firebaseDB.list('ventas');
   }

  ngOnInit() {
    this.route.params.subscribe( parametros => {
      console.log(parametros);
      this.getInfoVenta(parametros.id);
      this.getProductos(parametros.id);
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
      this.venta.estado = this.revisarUndefined(element[0].estado);
      this.venta.fecha = this.revisarUndefined(element[0].fecha );
      this.venta.fechaEntrega = this.revisarUndefined(element[0].fechaEntrega );
      this.venta.fechaEnvio = this.revisarUndefined(element[0].fechaEnvio );
      this.venta.fechaPago = this.revisarUndefined(element[0].fechaPago );
      this.venta.pagado = this.revisarUndefined(element[0].pagado );
      this.venta.tienda = this.revisarUndefined(element[0].tienda );
      this.venta.vendedor = this.revisarUndefined(element[0].vendedor );
      this.venta.total = this.revisarUndefined(element[0].total );

      this.venta.ciudad = this.revisarUndefined(element[0].cliente.ciudad);
      this.venta.cp = this.revisarUndefined(element[0].cliente.cp);
      this.venta.estadoCliente = this.revisarUndefined(element[0].cliente.estadoCliente);
      this.venta.calleNum = this.revisarUndefined(element[0].cliente.calleNum);
      this.venta.telefono = this.revisarUndefined(element[0].cliente.telefono);
      this.venta.numeroInterior = this.revisarUndefined(element[0].cliente.numeroInterior);
      this.venta.nombreCliente = this.revisarUndefined(element[0].cliente.nombre);
      this.venta.keyPublico = this.revisarUndefined(element[0].keyPublico);

      this.venta.tipoEnvio = this.revisarUndefined(element[0].envio.tipo);
      this.venta.costoEnvio = this.revisarUndefined(element[0].envio.costo);
      this.venta.paqueteriaEnvio = this.revisarUndefined(element[0].envio.paqueteria);
      this.venta.numeroGuia = this.revisarUndefined(element[0].envio.numeroGuia);
    });
  }
  getProductos(keyVenta: string) {
    this.itemsProductosRef = this.firebaseDB.list('ventas/' + keyVenta + '/productos/');
    this.itemsProductos = this.itemsProductosRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({

          key: c.payload.key, ...c.payload.val() }))
      )
    );
      // aquí se ven los resultados de cada query
    this.itemsProductos.subscribe(item => {console.log(item); });

  }

  revisarUndefined(elemento: any) {
    if ( elemento !== undefined) {
      return elemento;
    } else {
      return '';
    }
  }

  updateInfo() {
    this.itemsRef.update(this.venta.key + '/envio' , {

      costo: this.venta.costoEnvio,
      numeroGuia: this.venta.numeroGuia,
      paqueteria: this.venta.paqueteriaEnvio,
      tipo: this.venta.tipoEnvio
    });
    this.submitted = true;
    window.scroll(0, 0);
  }
  atras() {
    this.location.back();
  }
}

