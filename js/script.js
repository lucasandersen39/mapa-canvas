import { Cuadra } from './models/Cuadra.js';
import { Peaton } from './models/Peaton.js';
import { Calle } from './models/Calle.js';

document.addEventListener('DOMContentLoaded', function () {
    /**@type{HTMLCanvasElement} */
    let canvas = document.querySelector('#mapa');
    /**@type{CanvasRenderingContext2D} */
    let ctx = canvas.getContext('2d');

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let cuadras = [];
    let calles = [];
    let peatones = [];
    crearCuadras();
    crearCalles();
    crearPeatones();
    moverPeatones();
    function crearCuadras() {
        let ancho = 100;
        let alto = 100;
        const anchoCalle = 20;
        let x = 0;
        let y = anchoCalle;
        let i = 1;
        while (y < canvasHeight) {
            x = anchoCalle;
            while (x < canvasWidth) {
                let cuadra = new Cuadra(x, y, ctx, ancho, alto, i);
                cuadras.push(cuadra);
                cuadra.draw();
                x += ancho + anchoCalle;
                i++;
            }
            y += alto + anchoCalle;
        }
    }
    function crearCalles() {
        let ancho = canvasWidth;
        let alto = canvasHeight;
        let x = 0;
        let y = 0;
        let i = 0;
        while (x < canvasWidth) {
            let calle = new Calle(x, y, ctx, 20, alto);
            calle.draw();
            calles.push(calle);
            x += 120;
        }
        x = 0;
        y = 0;
        while (y < canvasHeight) {
            let calle = new Calle(x, y, ctx, ancho, 20);
            calle.draw();
            calles.push(calle);
            y += 120;
        }
    }
    function crearPeatones() {
        while (peatones.length < 50) {
            let x = Math.floor(Math.random() * canvasWidth);
            let y = Math.floor(Math.random() * canvasHeight);
            let peaton = new Peaton(x, y, ctx);
            while (!enLaCalle(peaton)) {
                x = Math.floor(Math.random() * canvasWidth);
                y = Math.floor(Math.random() * canvasHeight);
                peaton.setPosition(x, y);
            }
            peatones.push(peaton);
        }
        for (let i = 0; i < peatones.length; i++) {
            peatones[i].draw();
        }
    }

    function enLaCalle(peaton) {
        let posicion = peaton.getPosition();
        for (let i = 0; i < calles.length; i++) {
            if (calles[i].contienePunto(posicion.x, posicion.y)) {
                return true;
            }
        }
        return false;
    }
    function enElLimite(peaton) {
        let posicion = peaton.getPosition();
        return (posicion.x >= canvasWidth || posicion.x <= 0 || posicion.y >= canvasHeight || posicion.y <= 0);
    }
    function moverPeatones() {
        setInterval(() => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            for (let i = 0; i < cuadras.length; i++) {
                cuadras[i].draw();
            }
            for (let i = 0; i < calles.length; i++) {
                calles[i].draw();
            }
            for (let i = 0; i < peatones.length; i++) {
                peatones[i].move();
                if (enElLimite(peatones[i])) {
                    peatones[i].invertirDireccion();
                    peatones[i].incrementarChoques();
                }
                else {
                    if (!enLaCalle(peatones[i])) {
                        peatones[i].retroceder();
                        peatones[i].doblar();
                    } else {
                        let esCruce = estaEnCruceDeCalles(peatones[i]);
                        if (esCruce) {
                            if (!peatones[i].getDoblo()) {
                                let posicionPeaton = peatones[i].getPosition();
                                let valoraciones = obtenerValoracionCalle(posicionPeaton.x, posicionPeaton.y);
                                peatones[i].cambiarDireccion(valoraciones);
                                //Registrar las esquinas de la cuadra que ve el peaton
                                registrarVista(peatones[i].getVision());

                            }
                        } else
                            if (!esCruce) {
                                peatones[i].setDoblo(false);
                            }
                    }
                }
                peatones[i].draw();
            }
        }, 1000 / 60);
    }
    function estaEnCruceDeCalles(peaton) {
        let posicion = peaton.getPosition();
        let cuenta = 0;
        for (let i = 0; i < calles.length; i++) {
            if (calles[i].contienePunto(posicion.x, posicion.y)) {
                cuenta++;
            }
        }
        return cuenta >= 2;
    }
    function obtenerValoracionCalle(x, y) {
        /*
            x e y es el punto en el que se encuentra el peaton.
            Obtener valoracion hacia arriba a la izquierda desde el punto x - 30 ,y - 30 hasta el punto x -30, 0
            Obtener valoracion hacia arriba a la derecha desde el punto x + 30 ,y - 30 hasta el punto x + 30, 0

            Obtener la valoracion hacia la derecha arriba desde el punto x + 30, y - 30 hasta el punto canvasWidth, y - 30
            Obtener la valoracion hacia la derecha abajo desde el punto x + 30, y + 30 hasta el punto canvasWidth, y + 30

            Obtener la valoracion hacia abajo a la derecha desde el punto x + 30, y + 30 hasta el punto x + 30, canvasHeight
            Obtener la valoracion hacia abajo a la izquierda desde el punto x - 30, y + 30 hasta el punto x - 30, canvasHeight

            Obtener la valoracion hacia la izquierda abajo desde el punto x - 30, y + 30 hasta el punto 0, y + 30
            Obtener la valoracion hacia la izquierda arriba desde el punto x - 30, y - 30 hasta el punto 0, y - 30
        */
        let valoraciones = { 'Izq': 0, 'Der': 0, 'Arriba': 0, 'Abajo': 0 };
        let xaux = x;
        let yaux = y;
        let yaux2;
        let xaux2;
        //Arriba
        xaux = x - 30;
        xaux2 = x + 30;
        yaux = y - 30;
        let iteraciones = 0;
        while (yaux >= 0) {
            valoraciones.Arriba += obtenerValoracion(xaux, yaux);
            valoraciones.Arriba += obtenerValoracion(xaux2, yaux);
            iteraciones++;
            yaux -= 50;
            if (iteraciones % 2 == 0) {
                yaux += 20;
            }
        }
        //Derecha
        xaux = x + 30;
        yaux = y - 30;
        yaux2 = y + 30;
        iteraciones = 0;
        while (xaux <= canvasWidth) {
            valoraciones.Der += obtenerValoracion(xaux, yaux);
            valoraciones.Der += obtenerValoracion(xaux, yaux2);
            iteraciones++;
            xaux += 50;
            if (iteraciones % 2 == 0) {
                xaux += 20;
            }
        }
        //Abajo
        xaux = x - 30;
        xaux2 = x + 30;
        yaux = y + 30;
        iteraciones = 0;
        while (yaux <= canvasHeight) {
            valoraciones.Abajo += obtenerValoracion(xaux, yaux);
            valoraciones.Abajo += obtenerValoracion(xaux2, yaux);
            iteraciones++;
            yaux += 50;
            if (iteraciones % 2 == 0) {
                yaux += 20;
            }
        }
        //Izquierda
        xaux = x - 30;
        yaux = y + 30;
        yaux2 = y - 30;
        iteraciones = 0;
        while (xaux >= 0) {
            valoraciones.Izq += obtenerValoracion(xaux, yaux);
            valoraciones.Izq += obtenerValoracion(xaux, yaux2);
            iteraciones++;
            xaux -= 50;
            if (iteraciones % 2 == 0) {
                xaux -= 20;
            }
        }
        return valoraciones;
    }
    function obtenerValoracion(x, y) {
        let valoracion = 0;
        for (let i = 0; i < cuadras.length; i++) {
            if (cuadras[i].contienePunto(x, y)) {
                valoracion += cuadras[i].getValoracionEsquina(x, y);
            }
        }
        return valoracion;
    }
    function registrarVista(puntos) {
        //[{ x: this.x - 30, y: this.y + 30 }, { x: this.x - 30, y: this.y - 30 }, { x: this.x + 30, y: this.y + 30 }, { x: this.x - 30, y: this.y + 30 }];
        for (let i = 0; i < puntos.length; i++) {
            for (let j = 0; j < cuadras.length; j++) {
                if (cuadras[j].contienePunto(puntos[i].x, puntos[i].y)) {
                    cuadras[j].registrarVista(puntos[i].x, puntos[i].y, i);
                }
            }
        }
        actualizarInfo();
    }

    function actualizarInfo() {
        const bodyTable = document.querySelector('#tbodyMapa');
        bodyTable.innerHTML = '';
        for (let i = 0; i < cuadras.length; i++) {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');
            const td4 = document.createElement('td');
            const td5 = document.createElement('td');
            const tdn1 = document.createElement('td');
            const tdn2 = document.createElement('td');
            const tdn3 = document.createElement('td');
            const tdn4 = document.createElement('td');
            const niveles = cuadras[i].getNivelesEsquinas();
            td1.innerHTML = cuadras[i].getNumeroCuadra();
            td2.innerHTML = cuadras[i].getValoresEsquinas()[0];
            td3.innerHTML = cuadras[i].getValoresEsquinas()[1];
            td4.innerHTML = cuadras[i].getValoresEsquinas()[2];
            td5.innerHTML = cuadras[i].getValoresEsquinas()[3];
            tdn1.innerHTML = niveles[0];
            tdn2.innerHTML = niveles[1];
            tdn3.innerHTML = niveles[2];
            tdn4.innerHTML = niveles[3];
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(tdn1);
            tr.appendChild(td3);
            tr.appendChild(tdn2);
            tr.appendChild(td4);
            tr.appendChild(tdn3);
            tr.appendChild(td5);
            tr.appendChild(tdn4);

            bodyTable.appendChild(tr);
        }

    }
});