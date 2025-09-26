export default class Jugador {
    constructor(id,nombre, pais, ficha) {
        this.id = id;
        this.nombre = nombre;
        this.pais = pais;
        this.ficha = ficha;
        this.dinero = 1500;
        this.propiedades = [];
        this.enCarcel = false;
        this.posicion = 0; // posición inicial en el tablero
    }

    mover(pasos, tablero) {
        this.posicion = (this.posicion + pasos) % tablero.getCasillas().length;
        tablero.obtenerCasilla[idCasilla].accion(this); //configurar para que se mueva por ids
    }

    comprar(propiedad) {
        if (this._dinero >= propiedad.getPrecio()) {
            this._dinero -= propiedad.getPrecio();
            propiedad.setDueno(this);
            this.agregarPropiedad(propiedad);
        }
    }

    pagar(cantidad) {
        this.dinero -= cantidad;
        if (this.dinero < 0) this._dinero = 0;
    }

    cobrar(cantidad) {
        this.dinero += cantidad;
    }

    hipotecar(propiedad) {
        const dineroRecibido = propiedad.hipotecar();
        this.cobrar(dineroRecibido);
    }

    deshipotecar(propiedad) {
        const costo = propiedad.deshipotecar();
        this.pagar(costo);
    }

    agregarPropiedad(propiedad) {
        this.propiedades.push(propiedad);
    }

    eliminarPropiedad(propiedad) {
        this.propiedades = this.propiedades.filter(p => p !== propiedad);
    }

    getDinero() { return this.dinero; }
    setDinero(cantidad) { this.dinero = Math.max(0, cantidad); }

    getPropiedades() { return this.propiedades; }

    isEnCarcel() { return this.enCarcel; }
    setEnCarcel(valor) { this.enCarcel = valor; }
    
    getId(){return this.id;}
    getNombre() { return this.nombre; }
    getPais() { return this.pais; }
    getFicha() { return this.ficha; }

    getPosicion() { return this.posicion; }
}
