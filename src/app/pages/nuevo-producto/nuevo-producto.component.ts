import { Component, OnInit } from '@angular/core';
import { Producto } from '../../intefaces/producto.interface';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { Empleado } from 'src/app/intefaces/empleado.interface';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {
  selectedOption: string;
  printedOption: string;
  powers = ['Really Smart', 'Super Flexible',
  'Super Hot', 'Weather Changer'];

  model = new Producto();
  clasi: String;
  itemsRef: AngularFireList<any>;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  selectedFile = null;
  heroForm: FormGroup;
  profileUrl: Observable<string | null>;
  imageUrl: any;
  submitted = false;
  img1sub = false;
  // Errores de imagen
  imgError1 = false;
  imgError2 = false;
  imgError3 = false;
  imgError4 = false;
  imgError5 = false;
  mensajeErrorImg1: string;
  mensajeErrorImg2: string;
  mensajeErrorImg3: string;
  mensajeErrorImg4: string;
  mensajeErrorImg5: string;
  // subida de imagenes
  estadoCargaImg1 = false;
  estadoCargaImg2 = false;
  estadoCargaImg3 = false;
  estadoCargaImg4 = false;
  estadoCargaImg5 = false;

  porcentajeCargaImg1: any;
  porcentajeCargaImg2: any;
  porcentajeCargaImg3: any;
  porcentajeCargaImg4: any;
  porcentajeCargaImg5: any;

  claseCargaImg1: any;
  claseCargaImg2: any;
  claseCargaImg3: any;
  claseCargaImg4: any;
  claseCargaImg5: any;
  itemsClasificacionesRef: AngularFireList<any>;
  firebaseDB: any;
  itemsClasificaciones: Observable<any[]>;

  // Error de ficha tecnica
  fichaTecnicaError = false;
  mensajeErrorFichaTecnica: string;
  // carga ficha tecnica
  estadoCargaFichaTecnica = false;
  porcentajeCargaFichaTecnica: any;
  claseCargaFichaTecnica: any;

  empleadoActual: Empleado;
  constructor(db: AngularFireDatabase, private storage: AngularFireStorage, private location: Location,
      private sessionService: SessionServiceService, private router: Router) {
    this.haySesion();
    this.itemsRef = db.list('productos');
    this.firebaseDB = db;
    this.getClasificaciones();

   }

  ngOnInit(): void {

  }
  haySesion() {
    if (this.sessionService.empleado !== undefined) {
      // hay sesion
      this.empleadoActual = this.sessionService.empleado;
    } else {

        this.router.navigate(['/login']);
    }
  }

  newHero() {

    this.model.fechaAlta = new Date().getTime();
    this.model.empleadoAlta = this.sessionService.empleado.key;
    this.model.nombreBusqueda = this.model.nombre.toUpperCase();
    this.validarInfo();



    this.itemsRef.push(this.model);
    // this.model.clasificaciones.clasificacion1 = this.selectedOption;
    // this.uploadFile();
    this.submitted = true;
    window.scroll(0, 0);
   }

   getClasificaciones() {

    this.itemsClasificacionesRef = this.firebaseDB.list('clasificaciones');
    this.itemsClasificaciones = this.itemsClasificacionesRef.snapshotChanges().pipe(
    map(changes =>
      changes.map(c => ({
        key: c.payload.key, ...c.payload.val() }))
      )
  );
      // aquí se ven los resultados de cada query
    this.itemsClasificaciones.subscribe(item => { });

}

   getFilePDF(event) {
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf' ) {
        console.log('Imagen válida');

          // this.selectedFile.push(event.target.id = { tevent.target.files[0]});
          // console.log(this.selectedFile);
          if (event.target.files[0].size < 2000000) {//
            console.log('peso válido');
            this.uploadFile(event.target.id);
          } else {
            // Peso inválido
            console.log('peso inválido');
            this.fichaTecnicaError = true;
            this.mensajeErrorFichaTecnica = 'Archivo demasiado pesado, no debe pasar los x mb';
          }

      } else {
        // No es pdf

        console.log('No pdf');
        this.fichaTecnicaError = true;
            this.mensajeErrorFichaTecnica = 'Formato no válido, debe ser un archivo .pdf';
        // alert('Error');
        // event.srcElement.value = '';

      }
    }
   }
   getFile(event) {
    this.imgError1 = false;
    this.imgError2 = false;
    this.imgError3 = false;
    this.imgError4 = false;
    this.imgError5 = false;

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
            switch (event.target.id) {
              case 'file1':
              this.mensajeErrorImg1 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgError1 = true;
              break;
              case 'file2':
              this.mensajeErrorImg2 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgError2 = true;
              break;
              case 'file3':
              this.mensajeErrorImg3 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgError3 = true;
              break;
              case 'file4':
              this.mensajeErrorImg4 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgError4 = true;
              break;
              case 'file5':
              this.mensajeErrorImg5 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgError5 = true;
              break;
            }
            console.log('peso inválido');
          }
        } else {
          // Tamaño inválido
          switch (event.target.id) {
            case 'file1':
            this.mensajeErrorImg1 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgError1 = true;
            break;
            case 'file2':
            this.mensajeErrorImg2 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgError2 = true;
            break;
            case 'file3':
            this.mensajeErrorImg3 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgError3 = true;
            break;
            case 'file4':
            this.mensajeErrorImg4 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgError4 = true;
            break;
            case 'file5':
            this.mensajeErrorImg5 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgError5 = true;
            break;
          }
          console.log('tamaño inválido');
        }
      } else {
        // No es imagen
        switch (event.target.id) {
          case 'file1':
          this.mensajeErrorImg1 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgError1 = true;
          break;
          case 'file2':
          this.mensajeErrorImg2 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgError2 = true;
          break;
          case 'file3':
          this.mensajeErrorImg3 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgError3 = true;
          break;
          case 'file4':
          this.mensajeErrorImg4 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgError4 = true;
          break;
          case 'file5':
          this.mensajeErrorImg5 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgError5 = true;
          break;
        }
        console.log('No imagen');
        // alert('Error');
        // event.srcElement.value = '';

      }
    }
   }
   uploadFile(nombreImagen: string) {

    // Activo proceso de carga
    switch (nombreImagen) {
      case 'file1':
      this.estadoCargaImg1 = true;
      this.claseCargaImg1 = 'progress-bar progress-bar-primary progress-bar-striped';
      break;
      case 'file2':
      this.estadoCargaImg2 = true;
      this.claseCargaImg2 = 'progress-bar progress-bar-primary progress-bar-striped';
      break;
      case 'file3':
      this.estadoCargaImg3 = true;
      this.claseCargaImg3 = 'progress-bar progress-bar-primary progress-bar-striped';
      break;
      case 'file4':
      this.estadoCargaImg4 = true;
      this.claseCargaImg4 = 'progress-bar progress-bar-primary progress-bar-striped';
      break;
      case 'file5':
      this.estadoCargaImg5 = true;
      this.claseCargaImg5 = 'progress-bar progress-bar-primary progress-bar-striped';
      break;
      case 'filePDF':
      this.estadoCargaFichaTecnica = true;
      this.claseCargaFichaTecnica = 'progress-bar progress-bar-primary progress-bar-striped';
      break;
    }
    const file = this.selectedFile;
    const filePath = 'prueba/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(n => {
      switch (nombreImagen) {
        case 'file1':
        this.porcentajeCargaImg1 = n;
        break;
        case 'file2':
        this.porcentajeCargaImg2 = n;
        break;
        case 'file3':
        this.porcentajeCargaImg3 = n;
        break;
        case 'file4':
        this.porcentajeCargaImg4 = n;
        break;
        case 'file5':
        this.porcentajeCargaImg5 = n;
        break;
        case 'filePDF':
        this.porcentajeCargaFichaTecnica = n;
        break;
      }
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

            switch (nombreImagen) {
              case 'file1':
              this.model.imagen1 = url;
              this.claseCargaImg1 = 'progress-bar progress-bar-success';
              break;
              case 'file2':
               this.model.imagen2 = url;
               this.claseCargaImg2 = 'progress-bar progress-bar-success';
              break;
              case 'file3':
               this.model.imagen3 = url;
               this.claseCargaImg3 = 'progress-bar progress-bar-success';
              break;
              case 'file4':
               this.model.imagen4 = url;
               this.claseCargaImg4 = 'progress-bar progress-bar-success';
              break;
              case 'file5':
               this.model.imagen5 = url;
               this.claseCargaImg5 = 'progress-bar progress-bar-success';
              break;
              case 'filePDF':
               this.model.fichaTecnica = url;
               this.claseCargaFichaTecnica = 'progress-bar progress-bar-success';
              break;
            }
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
  get nombre() {return this.heroForm.get('nombre'); }
  cancel() {
    this.location.back();
  }

  validarInfo() {
    if (this.model.nombre === undefined) {
      this.model.nombre = '-';

    }
    if (this.model.imagen1 === undefined) {
      this.model.imagen1 = '-';

    }
    if (this.model.imagen2 === undefined) {
      this.model.imagen2 = '-';

    }
    if (this.model.imagen3 === undefined) {
      this.model.imagen3 = '-';

    }
    if (this.model.imagen4 === undefined) {
      this.model.imagen4 = '-';

    }
    if (this.model.imagen5 === undefined) {
      this.model.imagen5 = '-';

    }
    if (this.model.descripcion === undefined) {
      this.model.descripcion = '-';

    }
    if (this.model.fichaTecnica === undefined) {
      this.model.fichaTecnica = '-';

    }
    if (this.model.precioPublico === undefined) {
      this.model.precioPublico = 0;

    }
    if (this.model.costo === undefined) {
      this.model.costo = 0;

    }
    if (this.model.promocion === undefined) {
      this.model.promocion = false;

    }
    if (this.model.descuentoPromocion === undefined) {
      this.model.descuentoPromocion = 0;

    }
    if (this.model.clasificaciones.clasificacion1 === undefined) {
      this.model.clasificaciones.clasificacion1 = '-';

    }
    if (this.model.clasificaciones.clasificacion2 === undefined) {
      this.model.clasificaciones.clasificacion2 = '-';

    }
    if (this.model.clasificaciones.clasificacion3 === undefined) {
      this.model.clasificaciones.clasificacion3 = '-';

    }
    if (this.model.clasificaciones.clasificacion4 === undefined) {
      this.model.clasificaciones.clasificacion4 = '-';

    }
    if (this.model.unidades === undefined) {
      this.model.unidades = 0;

    }
    if (this.model.codigoBarras === undefined) {
      this.model.codigoBarras = 0;

    }
    if (this.model.fechaAlta === undefined) {
      this.model.fechaAlta = 0 ;

    }
    if (this.model.empleadoAlta === undefined) {
      this.model.empleadoAlta = '-';

    }
    if (this.model.marca === undefined) {
      this.model.marca = '-';

    }


  }

}
