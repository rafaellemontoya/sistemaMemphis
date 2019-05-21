import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PagoOxxoService {

  constructor(private http: HttpClient) { }

  generatePagoOxxo(monto: number, concepto: string, unidades: number, nombreCliente: string, email: string,
    telefono: string, keyVenta: string, precioEnvio: number, paqueteria: string, calleEnvio: string, cp: string ) {
    const dataCargo: CargoOxxo = {
      monto: monto * 100,
      concepto: concepto,
      unidades: unidades,
      nombreCliente: nombreCliente,
      email: email,
      telefono: telefono,
      keyVenta: keyVenta,
      precioEnvio: precioEnvio * 100,
      paqueteria: paqueteria,
      calleEnvio: calleEnvio,
      cp: cp
    };
    return this.http.post('assets/background/cargoOxxo.php', dataCargo);
  }
}
