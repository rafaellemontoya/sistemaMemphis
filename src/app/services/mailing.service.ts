import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface datosMailing {
  nombreCliente: string;
  email: string;
  referencia: string;
  monto: number;
}

@Injectable({
  providedIn: 'root'
})
export class MailingService {

  constructor(private http: HttpClient) { }

  fichaOxxoCreada(nombreCliente: string, email: string, referencia: string, monto: number ) {
    const datos: datosMailing = {
      nombreCliente: nombreCliente,
      email: email,
      referencia: referencia,
      monto: monto
    };
    console.log(datos);
    return this.http.post('assets/background/enviarFichaOxxo.php', datos);
  }
  pagoOxxoRecibido() {

  }
}
