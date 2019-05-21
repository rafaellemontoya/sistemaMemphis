export class Empleado {
    key: string;
    nombre: string;
    foto: string;
    usuario: string;
    password: string;
    telefono: string;
    permisos = {
        ventas: false,
        productos: false,
        empleados: false,
        estadisticas: false
    };
constructor() {
    this.permisos.ventas = false;
}



}
