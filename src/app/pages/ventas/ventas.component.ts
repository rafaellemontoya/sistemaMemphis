import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, retry } from 'rxjs/operators';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/intefaces/empleado.interface';
import { PagoOxxoService } from '../../services/pago-oxxo.service';
import { MailingService } from '../../services/mailing.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  firebaseDB: any;
  itemsProductosRef: AngularFireList<any>;

  itemsProductos: Observable<any[]>;

  cliente: any;
  claseEstado: string;

  empleadoActual: Empleado;
  constructor(db: AngularFireDatabase, private sessionService: SessionServiceService, private router: Router,
    private cargoOxxo: PagoOxxoService, private mailing: MailingService) {
    this.haySesion();
    this.firebaseDB = db;
    this.getVentas();
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

  getVentas() {
    this.itemsProductosRef = this.firebaseDB.list('ventas');
    this.itemsProductos = this.itemsProductosRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({

          key: c.payload.key, ...c.payload.val() }))
      )
    );
      // aquí se ven los resultados de cada query
    this.itemsProductos.subscribe(item => {console.log(item); });


  }
getProductos(productos: any) {
  const res = [];
  // tslint:disable-next-line:forin
  for (const x in productos) {
    res.push (productos[x]);
  }
  return res;

}

updateEstado(estado: string, keyVenta: string ) {
  let parametro = '';
  switch (estado) {
    case 'Pagado':
    parametro = 'fechaPago';
    break;
    case 'Enviado':
    parametro = 'fechaEnvio';
    break;
    case 'Entregado':
    parametro = 'fechaEntrega';
    break;
  }
  // console.log(keyVenta);
  const fecha = new Date().getTime();
  this.itemsProductosRef.set(keyVenta + '/' + parametro, fecha);
  this.itemsProductosRef.set(keyVenta + '/estado', estado);
}

getClaseEstado(estado: string): string {
  let claseEstado = 'btn btn-success br2 btn-xs fs12 dropdown-toggle';
  switch (estado) {
    case 'En espera':
    claseEstado = 'btn btn-danger br2 btn-xs fs12 dropdown-toggle';
    break;
    case 'Pagado':
    claseEstado = 'btn btn-warning br2 btn-xs fs12 dropdown-toggle';
    break;
    case 'Enviado':
    claseEstado = 'btn btn-alert br2 btn-xs fs12 dropdown-toggle';
    break;

  }

  return claseEstado;
}
generarPagoOxxxo(venta) {
  console.log(venta);
  const concepto = 'Compra en línea';
  const unidades = 1;

  let precioEnvio = 0;
  let paqueteria = 'NOAPLICA';
  let calleEnvio = 'NOAPLICA';
  let cp = '00000';
  if (venta.envio.paqueteria !== '-') {

    precioEnvio = venta.envio.costo;
    paqueteria = venta.envio.paqueteria;
    calleEnvio = venta.cliente.calleNum;
    cp = venta.cliente.cp;
  }

  this.cargoOxxo.generatePagoOxxo(venta.total, concepto, unidades, venta.cliente.nombre,
     venta.cliente.email, venta.cliente.telefono, venta.key, precioEnvio, paqueteria, calleEnvio, cp).subscribe( (data) => {
      console.log(data);
      if (data['status'] === 1) {
        this.mailing.fichaOxxoCreada(venta.cliente.nombre, venta.cliente.email, data['referencia'], data['monto']);
      }
    }, (error) => {
      console.log(error);
    });
}

}
