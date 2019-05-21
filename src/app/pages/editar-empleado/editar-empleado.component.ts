import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Empleado } from 'src/app/intefaces/empleado.interface';
import { Observable } from 'rxjs';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Location } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-editar-empleado',
  templateUrl: './editar-empleado.component.html',
  styleUrls: ['./editar-empleado.component.css']
})
export class EditarEmpleadoComponent implements OnInit {

  itemsRef: AngularFireList<any>;
  itemsProductosRef: AngularFireList<any>;
  itemsProductos: Observable<any[]>;
  empleado = new Empleado();
  empleadoActual: Empleado;
  submitted = false;

  heroForm: FormGroup;
  imgError = false;
  selectedFile = null;
  mensajeErrorImg: string;
  estadoCargaImg = false;
  claseCargaImg: string;
  porcentajeCargaImg: any;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  imageUrl: any;
  profileUrl: Observable<string | null>;

  constructor(private firebaseDB: AngularFireDatabase, private storage: AngularFireStorage,
              private location: Location, private route: ActivatedRoute, private sessionService: SessionServiceService,
              private router: Router) {
                this.haySesion();
                this.itemsRef = firebaseDB.list('empleados');
               }

  ngOnInit() {
    this.route.params.subscribe( parametros => {

      this.getInfoEmpleado(parametros.id);

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

  getInfoEmpleado(keyRecibido) {

    this.itemsProductos = this.firebaseDB.list('/empleados', ref => ref.orderByKey().equalTo(keyRecibido)).valueChanges();
    this.itemsProductos.subscribe(element => {

      console.log(element);
      this.empleado.key = keyRecibido;
      this.empleado.foto = this.revisarUndefined( element[0].foto );
      this.empleado.nombre = this.revisarUndefined(element[0].nombre);
      this.empleado.telefono = this.revisarUndefined(element[0].telefono);
      this.empleado.usuario = this.revisarUndefined(element[0].usuario);
      this.empleado.permisos.empleados = this.revisarUndefined(element[0].permisos.empleados);
      this.empleado.permisos.estadisticas = this.revisarUndefined(element[0].permisos.estadisticas);
      this.empleado.permisos.productos = this.revisarUndefined(element[0].permisos.productos);
      this.empleado.permisos.ventas = this.revisarUndefined(element[0].permisos.ventas);

    });
  }

  revisarUndefined(elemento: any) {
    if ( elemento !== undefined) {
      return elemento;
    } else {
      return '';
    }
  }

  guardarEmpleado() {

    console.log(this.empleado);
    // this.itemsRef.push(this.producto);
    this.itemsRef.set(this.empleado.key, this.empleado);
    // this.producto.clasificaciones.clasificacion1 = this.selectedOption;
    // this.uploadFile();
    this.submitted = true;
    window.scroll(0, 0);
   }

   getFile(event) {
    this.imgError = false;


    this.selectedFile = event.target.files[0];
    console.log(event.target.id);
    // this.uploadFile();
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/jpg') {
        console.log('Imagen válida');
        if (event.target.files[0].size < 200 * 200) {// Checking height * width}
          console.log('tamaño válida');
          // this.selectedFile.push(event.target.id = { tevent.target.files[0]});
          // console.log(this.selectedFile);
          if (event.target.files[0].size < 2000000) {//
            console.log('peso válido');
            this.uploadFile(event.target.id);
          } else {
            // Peso inválido

              this.mensajeErrorImg = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgError = true;

            console.log('peso inválido');
          }
        } else {
          // Tamaño inválido

            this.mensajeErrorImg = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgError = true;

          console.log('tamaño inválido');
        }
      } else {
        // No es imagen

          this.mensajeErrorImg = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgError = true;

        console.log('No imagen');
        // alert('Error');
        // event.srcElement.value = '';

      }
    }
   }
   uploadFile(nombreImagen: string) {

    // Activo proceso de carga

      this.estadoCargaImg = true;
      this.claseCargaImg = 'progress-bar progress-bar-primary progress-bar-striped';

    const file = this.selectedFile;
    const filePath = 'empleados/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(n => {

        this.porcentajeCargaImg = n;

      console.log(n);
    });
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(
          url => {
            this.imageUrl = url;
            console.log(url);


              this.empleado.foto = url;
              this.claseCargaImg = 'progress-bar progress-bar-success';


          }
          );
        }
      )
   )
    .subscribe(
        x => console.log(fileRef.getDownloadURL));
      this.getUrl(filePath);
  }
  getUrl(filePath: string) {
    const ref = this.storage.ref(filePath);
    this.profileUrl = ref.getDownloadURL();
    console.log(this.profileUrl);
  }
  cancel() {
    this.location.back();
  }

}
