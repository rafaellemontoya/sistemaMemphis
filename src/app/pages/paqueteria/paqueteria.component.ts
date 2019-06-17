import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/intefaces/empleado.interface';
import { Paqueteria } from 'src/app/intefaces/paqueteria.interface';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-paqueteria',
  templateUrl: './paqueteria.component.html',
  styleUrls: ['./paqueteria.component.css']
})
export class PaqueteriaComponent implements OnInit {
  paqueteria = new Paqueteria();
  submitted = false;
  itemsRef: AngularFireList<any>;
  firebaseDB: any;
  itemsPaqueteria: Observable<any[]>;
  constructor(private db: AngularFireDatabase, private sessionService: SessionServiceService) { 
    
  }

  ngOnInit() {
    this.getInfo();
  }
  getInfo() {
    this.firebaseDB = this.db;
    this.itemsPaqueteria = this.firebaseDB.list('/paqueteria').valueChanges();
    this.itemsPaqueteria.subscribe(element => {
      console.log(element);
      this.paqueteria.nombre = this.revisarUndefined(element[7]);
      this.paqueteria.costo5kg = this.revisarUndefined(element[4]);
      this.paqueteria.costo10kg = this.revisarUndefined(element[0]);
      this.paqueteria.costo15kg = this.revisarUndefined(element[1]);
      this.paqueteria.costo20kg = this.revisarUndefined(element[2]);
      this.paqueteria.costo25kg = this.revisarUndefined(element[3]);
     
    });
  }

  revisarUndefined(elemento: any) {
    if ( elemento !== undefined) {
      return elemento;
    } else {
      return '';
    }
  }
  updateInfo(){
    this.paqueteria.fechaAlta = new Date().getTime();
    this.paqueteria.empleadoAlta = this.revisarUndefined(this.sessionService.empleado.key);
    this.db.list('paqueteria').update('/' , {

      nombre: this.paqueteria.nombre,
      costo5kg: this.paqueteria.costo5kg,
      costo10kg: this.paqueteria.costo10kg,
      costo15kg: this.paqueteria.costo15kg,
      costo20kg: this.paqueteria.costo20kg,
      costo25kg: this.paqueteria.costo25kg,
      fechaAlta: this.paqueteria.fechaAlta,
      empleadoAlta: this.paqueteria.empleadoAlta,
    });
    this.submitted = true;
    window.scroll(0, 0);
  }
}
