import { Component, OnInit } from '@angular/core';
import { Empleado } from '../../intefaces/empleado.interface';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nuevo-empleado',
  templateUrl: './nuevo-empleado.component.html',
  styleUrls: ['./nuevo-empleado.component.css']
})
export class NuevoEmpleadoComponent implements OnInit {

  empleadoActual: Empleado;
  dbRef: AngularFireList<any>;

  empleado = new Empleado();
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
  submitted = false;


  constructor(db: AngularFireDatabase, private storage: AngularFireStorage, private location: Location
              , private sessionService: SessionServiceService, private router: Router) {
    this.dbRef = db.list('empleados');
    this.haySesion();
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
  nuevoEmpleado() {
    this.submitted = true;

    this.dbRef.push(this.empleado);
    window.scroll(0, 0);
  }
  permisoSeleccionado(event) {
    console.log(event.checked);
  }

  cancel() {
    this.location.back();
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
}
