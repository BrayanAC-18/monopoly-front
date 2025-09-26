export default class Jugador {
    constructor(id, nombre, pais, ficha) {
        this.id = id;
        this.nombre = nombre;
        this.pais = pais;
        this.ficha = ficha;   // emoji o ícono
        this.dinero = 1500;
        this.propiedades = [];
        this.enCarcel = false;
        this.posicion = 0;
    }

    mover(pasos, tablero) {
        this.posicion = (this.posicion + pasos) % tablero.getCasillas().length;

        // Ejecuta acción de la casilla en la que cayó
        const casilla = tablero.getCasilla(this.posicion);
        casilla.accion(this);
    }

    comprar(propiedad) {
        if (this.dinero >= propiedad.getPrecio() && !propiedad.getDueño()) {
            this.dinero -= propiedad.getPrecio();
            propiedad.setDueño(this);
            this.agregarPropiedad(propiedad);
        }
    }

    pagar(cantidad) {
        this.dinero -= cantidad;
        if (this.dinero < 0) this.dinero = 0; // bancarrota
    }

    cobrar(cantidad) {
        this.dinero += cantidad;
    }

    hipotecar(propiedad) {
        if (this.propiedades.includes(propiedad)) {
            const dineroRecibido = propiedad.hipotecar();
            this.cobrar(dineroRecibido);
        }
    }

    deshipotecar(propiedad) {
        if (this.propiedades.includes(propiedad)) {
            const costo = propiedad.deshipotecar();
            this.pagar(costo);
        }
    }

    agregarPropiedad(propiedad) {
        this.propiedades.push(propiedad);
    }

    eliminarPropiedad(propiedad) {
        this.propiedades = this.propiedades.filter(p => p !== propiedad);
    }

    // Getters y Setters
    getDinero() { return this.dinero; }
    setDinero(cantidad) { this.dinero = Math.max(0, cantidad); }

    getPropiedades() { return this.propiedades; }

    isEnCarcel() { return this.enCarcel; }
    setEnCarcel(valor) { this.enCarcel = valor; }

    getId() { return this.id; }
    getNombre() { return this.nombre; }
    getPais() { return this.pais; }
    getFicha() { return this.ficha; }
    getPosicion() { return this.posicion; }
    setPosicion(casillaId) {this.posicion = casillaId}
}
