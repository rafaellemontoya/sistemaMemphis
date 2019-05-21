import { Component, OnInit } from '@angular/core';
import { Producto } from '../../intefaces/producto.interface';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { finalize } from 'rxjs/operators';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/intefaces/empleado.interface';

@Component({
  selector: 'app-administrar-inicio',
  templateUrl: './administrar-inicio.component.html',
  styleUrls: ['./administrar-inicio.component.css']
})
export class AdministrarInicioComponent implements OnInit {

  selectedOption: string;
  printedOption: string;
  powers = ['Really Smart', 'Super Flexible',
  'Super Hot', 'Weather Changer'];

  model = new Producto();
  clasi: String;
  itemsRef: AngularFireList<any>;
  itemsSlider: AngularFireList<any>;
  items: Subscription;
  itemsProductosRef: AngularFireList<any>;
  itemsProductos: Observable<any[]>;
  itemsClasificaciones: Observable<any[]>;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  productoSeleccionado = new  Map<number, string>();


  firebaseDB: any;
  selectedFile = null;
  heroForm: FormGroup;
  profileUrl: Observable<string | null>;
  // imagenes slider
  imageUrlSlider1: any;
  imageUrlSlider2: any;
  imageUrlSlider3: any;
  // Imagenes banner intermedio
  imageUrlBannerInt1: string;
  imageUrlBannerInt2: string;
  imageUrlBannerInt3: string;

  imageUrlClasificacion1: string;
  imageUrlClasificacion2: string;
  imageUrlClasificacion3: string;
  imageUrlClasificacion4: string;
  imageUrlClasificacion5: string;
  imageUrlClasificacion6: string;
  // TODO

  submitted = false;
  img1sub = false;
  // Errores de imagen
  imgErrorSlider1 = false;
  imgErrorSlider2 = false;
  imgErrorSlider3 = false;

  imgErrorBannerInt1 = false;
  imgErrorBannerInt2 = false;
  imgErrorBannerInt3 = false;
  imgErrorClasificacion1 = false;
  imgErrorClasificacion2 = false;
  imgErrorClasificacion3 = false;
  imgErrorClasificacion4 = false;
  imgErrorClasificacion5 = false;
  imgErrorClasificacion6 = false;




  mensajeErrorImgSlider1: string;
  mensajeErrorImgSlider2: string;
  mensajeErrorImgSlider3: string;
  mensajeErrorImgBannerInt1: string;
  mensajeErrorImgBannerInt2: string;
  mensajeErrorImgBannerInt3: string;
  mensajeErrorImgClasificacion1: string;
  mensajeErrorImgClasificacion2: string;
  mensajeErrorImgClasificacion3: string;
  mensajeErrorImgClasificacion4: string;
  mensajeErrorImgClasificacion5: string;
  mensajeErrorImgClasificacion6: string;


  // subida de imagenes
  estadoCargaImgSlider1 = false;
  estadoCargaImgSlider2 = false;
  estadoCargaImgSlider3 = false;
  estadoCargaImgBannerInt1 = false;
  estadoCargaImgBannerInt2 = false;
  estadoCargaImgBannerInt3 = false;
  estadoCargaImgClasificacion1 = false;
  estadoCargaImgClasificacion2 = false;
  estadoCargaImgClasificacion3 = false;
  estadoCargaImgClasificacion4 = false;
  estadoCargaImgClasificacion5 = false;
  estadoCargaImgClasificacion6 = false;

  porcentajeCargaImgSlider1: any;
  porcentajeCargaImgSlider2: any;
  porcentajeCargaImgSlider3: any;
  porcentajeCargaImgBannerInt1: any;
  porcentajeCargaImgBannerInt2: any;
  porcentajeCargaImgBannerInt3: any;
  porcentajeCargaImgClasificacion1: any;
  porcentajeCargaImgClasificacion2: any;
  porcentajeCargaImgClasificacion3: any;
  porcentajeCargaImgClasificacion4: any;
  porcentajeCargaImgClasificacion5: any;
  porcentajeCargaImgClasificacion6: any;

  claseCargaImgSlider1: any;
  claseCargaImgSlider2: any;
  claseCargaImgSlider3: any;
  claseCargaImgBannerInt1: any;
  claseCargaImgBannerInt2: any;
  claseCargaImgBannerInt3: any;
  claseCargaImgClasificacion1: any;
  claseCargaImgClasificacion2: any;
  claseCargaImgClasificacion3: any;
  claseCargaImgClasificacion4: any;
  claseCargaImgClasificacion5: any;
  claseCargaImgClasificacion6: any;


  // nombre clasificaciones
  nombreClasificacion1: string;
  nombreClasificacion2: string;
  nombreClasificacion3: string;
  nombreClasificacion4: string;
  nombreClasificacion5: string;
  nombreClasificacion6: string;
  mensajeErrorFichaTecnica: string;
  // carga ficha tecnica
  estadoCargaFichaTecnica = false;
  porcentajeCargaFichaTecnica: any;
  claseCargaFichaTecnica: any;

  empleadoActual: Empleado;
  constructor(db: AngularFireDatabase, private storage: AngularFireStorage, private location: Location
    , private sessionService: SessionServiceService, private router: Router) {
      this.haySesion();
    this.firebaseDB = db;
    this.itemsRef = db.list('paginas');
    // this.itemsSlider = db.list('paginas/inicio').snapshotChanges().pipe(map(items => {
    //   return items.map( a => {
    //     const data = a.payload.val();
    //     const key = a.payload.key;
    //     return {key, data};
    //   });
    // }));
    db.list('paginas/inicio/productos').valueChanges().subscribe(items => {
      let i = 1;
      // tslint:disable-next-line:no-shadowed-variable

      // tslint:disable-next-line:no-shadowed-variable
      items.forEach (element => {

        let elementos: any;
        elementos = element;
        this.productoSeleccionado.set(i, elementos.nombre);
        i++;
      });
    });
    this.itemsSlider = db.list('paginas/inicio');
    this.items = this.itemsSlider.valueChanges().subscribe(items => {

      this.imageUrlBannerInt1 = items[0];
      this.imageUrlBannerInt2 = items[1];
      this.imageUrlBannerInt3 = items[2];
      this.imageUrlClasificacion1 = items[3];
      this.imageUrlClasificacion2 = items[4];
      this.imageUrlClasificacion3 = items[5];
      this.imageUrlClasificacion4 = items[6];
      this.imageUrlClasificacion5 = items[7];
      this.imageUrlClasificacion6 = items[8];
      this.imageUrlSlider1 = items[9];
      this.imageUrlSlider2 = items[10];
      this.imageUrlSlider3 = items[11];
      this.nombreClasificacion1 = items[12];
      this.nombreClasificacion2 = items[13];
      this.nombreClasificacion3 = items[14];
      this.nombreClasificacion4 = items[15];
      this.nombreClasificacion5 = items[16];
      this.nombreClasificacion6 = items[17];

    });
    this.getProductos();
    this.getClasificaciones();

  //   /*CODIGO PARA QUERYS*/
  //   this.itemsProductosRef = db.list('productos');
  //   this.itemsProductos = this.itemsProductosRef.snapshotChanges().pipe(
  //     map(changes =>
  //       changes.map(c => ({
  //          key: c.payload.key, ...c.payload.val() }))
  //     )
  //   );
  //         // aquí se ven los resultados de cada query
  //   this.itemsProductos.subscribe(item => {console.log(item); });
  //  /**FIN CODIGO PARA QUERYS */
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

  getProductos() {
        this.itemsProductosRef = this.firebaseDB.list('productos');
    this.itemsProductos = this.itemsProductosRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
           key: c.payload.key, ...c.payload.val() }))
      )
    );
          // aquí se ven los resultados de cada query
    this.itemsProductos.subscribe(item => {console.log(item); });
  }

  getClasificaciones() {

      this.itemsProductosRef = this.firebaseDB.list('clasificaciones');
    this.itemsClasificaciones = this.itemsProductosRef.snapshotChanges().pipe(
    map(changes =>
      changes.map(c => ({
         key: c.payload.key, ...c.payload.val() }))
    )
  );
        // aquí se ven los resultados de cada query
  this.itemsClasificaciones.subscribe(item => {console.log(item); });

  }

  newHero() {

    console.log(this.model);
    this.itemsRef.push(this.model);
    // this.model.clasificaciones.clasificacion1 = this.selectedOption;
    // this.uploadFile();
    this.submitted = true;
   }

   getFileSlider(event) {
    this.imgErrorSlider1 = false;
    this.imgErrorSlider2 = false;
    this.imgErrorSlider3 = false;

    this.selectedFile = event.target.files[0];
    console.log(event.target.id);
    // this.uploadFile();
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/jpg') {
        console.log('Imagen válida');
        if (event.target.files[0].size < 1920 * 487) {// Checking height * width}
          console.log('tamaño válida');
          // this.selectedFile.push(event.target.id = { tevent.target.files[0]});
          // console.log(this.selectedFile);
          if (event.target.files[0].size < 2000000) {//
            console.log('peso válido');
            this.uploadFile(event.target.id);
          } else {
            // Peso inválido
            switch (event.target.id) {
              case 'slider1':
              this.mensajeErrorImgSlider1 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorSlider1 = true;
              break;
              case 'slider2':
              this.mensajeErrorImgSlider2 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorSlider2 = true;
              break;
              case 'slider3':
              this.mensajeErrorImgSlider3 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorSlider3 = true;
              break;
            }
            console.log('peso inválido');
          }
        } else {
          // Tamaño inválido
          switch (event.target.id) {
            case 'slider1':
            this.mensajeErrorImgSlider1 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorSlider1 = true;
            break;
            case 'slider2':
            this.mensajeErrorImgSlider2 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorSlider2 = true;
            break;
            case 'slider3':
            this.mensajeErrorImgSlider3 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorSlider3 = true;
            break;
          }
          console.log('tamaño inválido');
        }
      } else {
        // No es imagen
        switch (event.target.id) {
          case 'slider1':
          this.mensajeErrorImgSlider1 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorSlider1 = true;
          break;
          case 'slider2':
          this.mensajeErrorImgSlider2 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorSlider2 = true;
          break;
          case 'slider3':
          this.mensajeErrorImgSlider3 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorSlider3 = true;
          break;
        }
        console.log('No imagen');
        // alert('Error');
        // event.srcElement.value = '';

      }
    }
   }

   getFileBannerInt(event) {
    this.imgErrorBannerInt1 = false;
    this.imgErrorBannerInt2 = false;
    this.imgErrorBannerInt3 = false;

    this.selectedFile = event.target.files[0];
    console.log(event.target.id);
    // this.uploadFile();
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/jpg') {
        console.log('Imagen válida');
        if (event.target.files[0].size < 1920 * 487) {// Checking height * width}
          console.log('tamaño válida');
          // this.selectedFile.push(event.target.id = { tevent.target.files[0]});
          // console.log(this.selectedFile);
          if (event.target.files[0].size < 2000000) {//
            console.log('peso válido');
            this.uploadFile(event.target.id);
          } else {
            // Peso inválido
            switch (event.target.id) {
              case 'BannerInt1':
              this.mensajeErrorImgBannerInt1 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorBannerInt1 = true;
              break;
              case 'BannerInt2':
              this.mensajeErrorImgBannerInt2 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorBannerInt2 = true;
              break;
              case 'BannerInt3':
              this.mensajeErrorImgBannerInt3 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorBannerInt3 = true;
              break;
            }
            console.log('peso inválido');
          }
        } else {
          // Tamaño inválido
          switch (event.target.id) {
            case 'BannerInt1':
            this.mensajeErrorImgBannerInt1 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorBannerInt1 = true;
            break;
            case 'BannerInt2':
            this.mensajeErrorImgBannerInt2 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorBannerInt2 = true;
            break;
            case 'BannerInt3':
            this.mensajeErrorImgBannerInt3 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorBannerInt3 = true;
            break;
          }
          console.log('tamaño inválido');
        }
      } else {
        // No es imagen
        switch (event.target.id) {
          case 'BannerInt1':
          this.mensajeErrorImgBannerInt1 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorBannerInt1 = true;
          break;
          case 'BannerInt2':
          this.mensajeErrorImgBannerInt2 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorBannerInt2 = true;
          break;
          case 'BannerInt3':
          this.mensajeErrorImgBannerInt3 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorBannerInt3 = true;
          break;
        }
        console.log('No imagen');
        // alert('Error');
        // event.srcElement.value = '';

      }
    }
   }
   getFileClasificacion(event) {
    this.imgErrorClasificacion1 = false;
    this.imgErrorClasificacion2 = false;
    this.imgErrorClasificacion3 = false;
    this.imgErrorClasificacion4 = false;
    this.imgErrorClasificacion5 = false;
    this.imgErrorClasificacion6 = false;

    this.selectedFile = event.target.files[0];
    console.log(event.target.id);
    // this.uploadFile();
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/jpg') {
        console.log('Imagen válida');
        if (event.target.files[0].size < 1920 * 487) {// Checking height * width}
          console.log('tamaño válida');
          // this.selectedFile.push(event.target.id = { tevent.target.files[0]});
          // console.log(this.selectedFile);
          if (event.target.files[0].size < 2000000) {//
            console.log('peso válido');
            this.uploadFile(event.target.id);
          } else {
            // Peso inválido
            switch (event.target.id) {
              case 'clasificacion1':
              this.mensajeErrorImgClasificacion1 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorClasificacion1 = true;
              break;
              case 'clasificacion2':
              this.mensajeErrorImgClasificacion2 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorClasificacion2 = true;
              break;
              case 'clasificacion3':
              this.mensajeErrorImgClasificacion3 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorClasificacion3 = true;
              break;
              case 'clasificacion4':
              this.mensajeErrorImgClasificacion4 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorClasificacion4 = true;
              break;
              case 'clasificacion5':
              this.mensajeErrorImgClasificacion5 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorClasificacion5 = true;
              break;
              case 'clasificacion6':
              this.mensajeErrorImgClasificacion6 = 'Imagen demasiado grande. Debe pesar menos de ';
              this.imgErrorClasificacion6 = true;
              break;

            }
            console.log('peso inválido');
          }
        } else {
          // Tamaño inválido
          switch (event.target.id) {
            case 'clasificacion1':
            this.mensajeErrorImgClasificacion1 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorClasificacion1 = true;
            break;
            case 'clasificacion2':
            this.mensajeErrorImgClasificacion2 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorClasificacion2 = true;
            break;
            case 'clasificacion3':
            this.mensajeErrorImgClasificacion3 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorClasificacion3 = true;
            break;
            case 'clasificacion4':
            this.mensajeErrorImgClasificacion4 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorClasificacion4 = true;
            break;
            case 'clasificacion5':
            this.mensajeErrorImgClasificacion5 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorClasificacion5 = true;
            break;
            case 'clasificacion6':
            this.mensajeErrorImgClasificacion6 = 'Tamaño inválido. Debe medir x px de alto por x px de ancho.';
            this.imgErrorClasificacion6 = true;
            break;
          }
          console.log('tamaño inválido');
        }
      } else {
        // No es imagen
        switch (event.target.id) {
          case 'clasificacion1':
          this.mensajeErrorImgClasificacion1 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorClasificacion1 = true;
          break;
          case 'clasificacion2':
          this.mensajeErrorImgClasificacion2 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorClasificacion2 = true;
          break;
          case 'clasificacion3':
          this.mensajeErrorImgClasificacion3 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorClasificacion3 = true;
          break;
          case 'clasificacion4':
          this.mensajeErrorImgClasificacion4 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorClasificacion4 = true;
          break;
          case 'clasificacion5':
          this.mensajeErrorImgClasificacion5 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorClasificacion5 = true;
          break;
          case 'clasificacion6':
          this.mensajeErrorImgClasificacion6 = 'Formato no válido, debe ser una imagen en .jpg o .png';
          this.imgErrorClasificacion6 = true;
          break;
        }
        console.log('No imagen');
        // alert('Error');
        // event.srcElement.value = '';

      }
    }
   }

   uploadFile(nombreImagen: string) {


    let nombreImgSlider = '';
    // Activo proceso de carga
    switch (nombreImagen) {
      case 'slider1':
      this.estadoCargaImgSlider1 = true;
      this.claseCargaImgSlider1 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_slider1';
      break;
      case 'slider2':
      this.estadoCargaImgSlider2 = true;
      this.claseCargaImgSlider2 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_slider2';
      break;
      case 'slider3':
      this.estadoCargaImgSlider3 = true;
      this.claseCargaImgSlider3 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_slider3';
      break;
      case 'BannerInt1':
      this.estadoCargaImgBannerInt1 = true;
      this.claseCargaImgBannerInt1 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_banner_int1';
      break;
      case 'BannerInt2':
      this.estadoCargaImgBannerInt2 = true;
      this.claseCargaImgBannerInt3 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_banner_int2';
      break;
      case 'BannerInt3':
      this.estadoCargaImgBannerInt3 = true;
      this.claseCargaImgBannerInt3 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_banner_int3';
      break;

      case 'clasificacion1':
      this.estadoCargaImgClasificacion1 = true;
      this.claseCargaImgClasificacion1 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_clasificacion1';
      break;

      case 'clasificacion2':
      this.estadoCargaImgClasificacion2 = true;
      this.claseCargaImgClasificacion2 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_clasificacion2';
      break;
      case 'clasificacion3':
      this.estadoCargaImgClasificacion3 = true;
      this.claseCargaImgClasificacion3 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_clasificacion3';
      break;
      case 'clasificacion4':
      this.estadoCargaImgClasificacion4 = true;
      this.claseCargaImgClasificacion4 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_clasificacion4';
      break;
      case 'clasificacion5':
      this.estadoCargaImgClasificacion5 = true;
      this.claseCargaImgClasificacion5 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_clasificacion5';
      break;
      case 'clasificacion6':
      this.estadoCargaImgClasificacion6 = true;
      this.claseCargaImgClasificacion6 = 'progress-bar progress-bar-primary progress-bar-striped';
      nombreImgSlider = 'imagen_clasificacion6';
      break;



    }
    const file = this.selectedFile;

    const filePath = 'paginas/inicio/' + nombreImgSlider;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    console.log(nombreImagen);
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(n => {
      switch (nombreImagen) {
        case 'slider1':
        this.porcentajeCargaImgSlider1 = n;
        break;
        case 'slider2':
        this.porcentajeCargaImgSlider2 = n;
        break;
        case 'slider3':
        this.porcentajeCargaImgSlider3 = n;
        break;
        case 'BannerInt1':
        this.porcentajeCargaImgBannerInt1 = n;
        break;
        case 'BannerInt2':
        this.porcentajeCargaImgBannerInt2 = n;
        break;
        case 'BannerInt3':
        this.porcentajeCargaImgBannerInt3 = n;
        break;
        case 'clasificacion1':
        this.porcentajeCargaImgClasificacion1 = n;
        break;
        case 'clasificacion2':
        this.porcentajeCargaImgClasificacion2 = n;
        break;
        case 'clasificacion3':
        this.porcentajeCargaImgClasificacion3 = n;
        break;
        case 'clasificacion4':
        this.porcentajeCargaImgClasificacion4 = n;
        break;
        case 'clasificacion5':
        this.porcentajeCargaImgClasificacion5 = n;
        break;
        case 'clasificacion6':
        this.porcentajeCargaImgClasificacion6 = n;
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

            switch (nombreImagen) {
              case 'slider1':
              this.claseCargaImgSlider1 = 'progress-bar progress-bar-success';
              this.updateUrlFiles(url, 'imagen_slider1');
              break;
              case 'slider2':
               this.claseCargaImgSlider2 = 'progress-bar progress-bar-success';
               this.updateUrlFiles(url, 'imagen_slider2');
              break;
              case 'slider3':
               this.claseCargaImgSlider3 = 'progress-bar progress-bar-success';
               this.updateUrlFiles(url, 'imagen_slider3');
              break;
              case 'BannerInt1':
              this.claseCargaImgBannerInt1 = 'progress-bar progress-bar-success';
               this.updateUrlFiles(url, 'imagen_banner_int1');
               break;
               case 'BannerInt2':
              this.claseCargaImgBannerInt2 = 'progress-bar progress-bar-success';
               this.updateUrlFiles(url, 'imagen_banner_int2');
               break;
               case 'BannerInt3':
              this.claseCargaImgBannerInt3 = 'progress-bar progress-bar-success';
               this.updateUrlFiles(url, 'imagen_banner_int3');
               break;

               case 'clasificacion1':
               this.claseCargaImgClasificacion1 = 'progress-bar progress-bar-success';
                this.updateUrlFiles(url, 'imagen_clasificacion1');
                break;

               case 'clasificacion2':
               this.claseCargaImgClasificacion2 = 'progress-bar progress-bar-success';
                this.updateUrlFiles(url, 'imagen_clasificacion2');
                break;

               case 'clasificacion3':
               this.claseCargaImgClasificacion3 = 'progress-bar progress-bar-success';
                this.updateUrlFiles(url, 'imagen_clasificacion3');
                break;

               case 'clasificacion4':
               this.claseCargaImgClasificacion4 = 'progress-bar progress-bar-success';
                this.updateUrlFiles(url, 'imagen_clasificacion4');
                break;

               case 'clasificacion5':
               this.claseCargaImgClasificacion5 = 'progress-bar progress-bar-success';
                this.updateUrlFiles(url, 'imagen_clasificacion5');
                break;

               case 'clasificacion6':
               this.claseCargaImgClasificacion6 = 'progress-bar progress-bar-success';
                this.updateUrlFiles(url, 'imagen_clasificacion6');
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
  // get nombre() {return this.heroForm.get('nombre'); }
  cancel() {
    this.location.back();
  }
  updateUrlFiles(url: string, ruta: string ) {
    console.log(url);

    // this.itemsRef.update('inicio', {: url});
    this.itemsRef.set('inicio/' + ruta , url );
  }
  focusOutFunction(event) {
    console.log('desseleccionado' + event.target.id + this.nombreClasificacion1) ;
    let textoEditado = '';
    switch (event.target.id) {
      case 'nombre_clasificacion1':
      textoEditado = this.nombreClasificacion1;
      break;
      case 'nombre_clasificacion2':
      textoEditado = this.nombreClasificacion2;
      break;
      case 'nombre_clasificacion3':
      textoEditado = this.nombreClasificacion3;
      break;
      case 'nombre_clasificacion4':
      textoEditado = this.nombreClasificacion4;
      break;
      case 'nombre_clasificacion5':
      textoEditado = this.nombreClasificacion5;
      break;
      case 'nombre_clasificacion6':
      textoEditado = this.nombreClasificacion6;
      break;
    }
    this.updateNombre(event.target.id, textoEditado);

  }
  selectChange(event) {
    console.log('select ' + event.target.value);
    const keyProducto = event.target.value;
    const numeroProducto = event.target.id;
    this.itemsProductos.subscribe(x => {

      x.forEach( element => {

        if ( element.key === keyProducto) {
          console.log(element.nombre);

          this.itemsRef.update('inicio/productos/' + numeroProducto , {
            key: element.key,
            nombre: element.nombre,
            imagen1: element.imagen1,
            descuento: element.descuentoPromocion,
            precio: element.precioPublico});
        }
      });

    });


  }

  seleccionClasificacion(event) {
    console.log('select ' + event.target.value);
    const keyClasificacion = event.target.value;
    const nombreClasificacion = event.target.id;
    this.itemsClasificaciones.subscribe(x => {

      // tslint:disable-next-line:no-shadowed-variable
      x.forEach( element => {

        if ( element.key === keyClasificacion) {
          console.log(nombreClasificacion);


          this.itemsRef.set('inicio/nombre_' + nombreClasificacion, element.nombre);

        }
      });

    });


  }
  updateNombre(nombreParametro: string, valorParametro: string) {
    this.itemsRef.set('inicio/' + nombreParametro , valorParametro );
  }

}
