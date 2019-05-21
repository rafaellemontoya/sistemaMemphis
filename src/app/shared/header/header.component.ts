import { Component, OnInit } from '@angular/core';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  hayUser = true;

  constructor(private sessionService: SessionServiceService, private router: Router) { }

  ngOnInit() {

  }

  getSession() {
    this.sessionService.getCurrentEmpleado2().subscribe(empleado => {
      
      // if (this.sessionService.keyEmpleado !== undefined) {
      //   console.log('entro al if');
      //   this.hayUser = true;
      // } else {
      //   this.hayUser = false;
      // }
      console.log(empleado);
      return empleado;
    });

    

  }

  getNombreEmpleado() {
    this.sessionService.getCurrentEmpleado2().subscribe(empleado => {
      
      if (this.sessionService.keyEmpleado !== undefined) {

        return this.sessionService.empleado.nombre;
      } else {
        return '';
      }
      console.log(empleado);

    });
    // if (this.sessionService.keyEmpleado !== undefined) {
    //   this.hayUser = true;
    //   return this.sessionService.empleado.nombre;


    // } else {
    //   this.hayUser = false;
    //   // this.router.navigate(['/login']);
    // }
  }
  getImagenEmpleado() {
    if (this.sessionService.keyEmpleado !== undefined) {
      this.hayUser = true;
      return this.sessionService.empleado.foto;


    } else {
      return '';
      // this.router.navigate(['/login']);
    }
  }
  logout() {

    this.hayUser = false;
    window.location.reload();
    this.router.navigate(['/login']);
  }
}
