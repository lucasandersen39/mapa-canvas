export class Peaton {
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.ctx = context;
        this.radio = 5;
        this.direction = Math.floor(Math.random() * 4);
        this.choques = 0;
        this.doblo = false;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    getPosition() {
        return { x: this.x, y: this.y };
    }
    incrementarChoques() {
        this.choques++;
    }
    setDoblo(doblo) {
        this.doblo = doblo;
    }
    getDoblo() {
        return this.doblo;
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        this.ctx.fill();
        this.ctx.stroke();
    }
    invertirDireccion() {
        this.direction = (this.direction + 2) % 4;
    }
    move() {
        switch (this.direction) {
            case 0:
                this.y -= 1;
                break;
            case 1:
                this.x += 1;
                break;
            case 2:
                this.y += 1;
                break;
            case 3:
                this.x -= 1;
                break;
        }
    }
    cambiarDireccion(valoraciones) {
        let valArriba = Math.random() * valoraciones.Arriba;
        let valIzquierda = Math.random() * valoraciones.Izq;
        let valDerecha = Math.random() * valoraciones.Der;
        let valAbajo = Math.random() * valoraciones.Abajo;
        let val = -1;
        switch (this.direction) {
            case 0:
                val = this.calcularCaminoValoracion(valArriba, valIzquierda, valDerecha);
                if (val == 1) {
                    this.direction = 3;
                }
                if (val == 2) {
                    this.direction = 1;
                }
                break;
            case 1:
                val = this.calcularCaminoValoracion(valDerecha, valArriba, valAbajo);
                if (val == 1) {
                    this.direction = 0;
                }
                if (val == 2) {
                    this.direction = 2;
                }
                break;
            case 2:
                val = this.calcularCaminoValoracion(valAbajo, valIzquierda, valDerecha);
                if (val == 1) {
                    this.direction = 3;
                }
                if (val == 2) {
                    this.direction = 1;
                }
                break;
            case 3:
                val = this.calcularCaminoValoracion(valIzquierda, valArriba, valAbajo);
                if (val == 1) {
                    this.direction = 0;
                }
                if (val == 2) {
                    this.direction = 2;
                }
                break
        }
        this.doblo = true;

        /*  let probabilidad = Math.random() * 10;
 
         if (probabilidad < 4) {
             this.doblar();
         }
         this.doblo = true; */

    }

    calcularCaminoValoracion(val1, val2, val3) {
        let rango1 = [0, val1];
        let rango2 = [val1 + 1, val1 + val2];
        let rango3 = [val1 + val2 + 1, val1 + val2 + val3];
        let valor = Math.random() * (val1 + val2 + val3);
        if (valor >= rango1[0] && valor <= rango1[1]) {
            return 0;
        }
        if (valor >= rango2[0] && valor <= rango2[1]) {
            return 1;
        }
        if (valor >= rango3[0] && valor <= rango3[1]) {
            return 2;
        }
        return -1;


    }

    doblar() {
        if (this.direction % 2 == 0) {
            this.direction = Math.round(Math.random() * 10) % 2 == 0 ? 1 : 3;
        } else
            this.direction = Math.round(Math.random() * 10) % 2 == 0 ? 0 : 2;
    }
    retroceder() {
        //retorceder 5 pixeles en la direccion actual
        switch (this.direction) {
            case 0:
                this.y += 5;
                break;
            case 1:
                this.x -= 5;
                break;
            case 2:
                this.y -= 5;
                break;
            case 3:
                this.x += 5;
                break;
        }
    }
    getVision() {
        let vision = [];
        switch (this.direction) {
            case 0:
                vision = [{ x: this.x - 30, y: this.y + 30 }, { x: this.x - 30, y: this.y - 30 }, { x: this.x + 30, y: this.y + 30 }, { x: this.x - 30, y: this.y + 30 }];
                break;
            case 1:
                vision = [{ x: this.x + 30, y: this.y + 30 }, { x: this.x + 30, y: this.y - 30 }, { x: this.x - 30, y: this.y - 30 }, { x: this.x - 30, y: this.y + 30 }];
                break;
            case 2:
                vision = [{ x: this.x + 30, y: this.y + 30 }, { x: this.x - 30, y: this.y + 30 }, { x: this.x - 30, y: this.y - 30 }, { x: this.x + 30, y: this.y - 30 }];
                break;
            case 3:
                vision = [{ x: this.x - 30, y: this.y + 30 }, { x: this.x - 30, y: this.y - 30 }, { x: this.x + 30, y: this.y - 30 }, { x: this.x + 30, y: this.y + 30 }];
                break;
        }
        return vision;
    }
}