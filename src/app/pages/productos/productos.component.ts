import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Producto } from '../../intefaces/producto.interface';
import { map } from 'rxjs/operators';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/intefaces/empleado.interface';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {
  itemRef: AngularFireObject<any>;
  items: Observable<any[]>;
  model = new Producto();
  itemsProductosRef: AngularFireList<any>;
  itemsProductos: Observable<any[]>;
  firebaseDB: any;
  empleadoActual: Empleado;
  preguntaEliminar = false;
  productoSeleccionado = new Producto();
  eliminarExitoso = false;

  constructor(private db: AngularFireDatabase, private sessionService: SessionServiceService, private router: Router) {
    this.haySesion();
    this.firebaseDB = db;
    this.getProductos();
    this.items = db.list('productos').valueChanges();

    this.eliminarExitoso = false;


   }

   buscar($event) {
    const first: string = $event.target.value;
    console.log(first);

      this.itemsProductosRef = this.db.list('productos');
      this.itemsProductos = this.itemsProductosRef.snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({
            key: c.payload.key, ...c.payload.val() }))
            .filter( (item: any) => item.nombreBusqueda.includes(first.toUpperCase())  )
        )
      );
        // aquí se ven los resultados de cada query
      this.itemsProductos.subscribe();

  }
   getProductos() {
    this.itemsProductosRef = this.firebaseDB.list('productos');
    this.itemsProductos = this.itemsProductosRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.payload.key, ...c.payload.val() }))
      )
    );
      // aquí se ven los resultados de cada query
this.itemsProductos.subscribe(item => {
  item.forEach(element => {

    // const first: string = element.nombre.toUpperCase();

    // const itemsRef = this.firebaseDB.list('productos');
    // itemsRef.update(element.key, {nombreBusqueda: first});
    // if ( element.key === '-Ldkjw9ZypYJ2cArmpT_') {
    //   const filePath = 'nombreBusqueda/' + first;
      
    //   itemsRef.update(element.key, {nombreBusqueda: first});
    // }
    
  });
 });
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
  onSubmit() {

   }
   eliminarEntrada(keyProducto: string) {

    this.eliminarExitoso = true;
    this.preguntaEliminar = false;


    const itemsRef = this.firebaseDB.list('productos');
    if (keyProducto !== '') {

      itemsRef.remove(keyProducto);
    }


   }
   preguntarEliminar(producto: Producto) {
    window.scroll(0, 0);
    this.preguntaEliminar = true;
    this.eliminarExitoso = false;
    this.productoSeleccionado = producto;
   }
   cancelarEliminar() {
    this.preguntaEliminar = false;
    this.productoSeleccionado = new Producto();
   }
   terminarEliminar() {
    this.eliminarExitoso = false;
   }
}
