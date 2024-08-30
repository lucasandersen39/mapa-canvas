export class Cuadra {
    constructor(x, y, context, ancho, alto, numero) {
        this.x = x;
        this.y = y;
        this.ctx = context;
        this.ancho = ancho;
        this.alto = alto;
        this.esquina1 = 0;
        this.esquina2 = 0;
        this.esquina3 = 0;
        this.esquina4 = 0;
        this.nivel1 = 1;
        this.nivel2 = 1;
        this.nivel3 = 1;
        this.nivel4 = 1;
        this.numeroCuadra = numero;
        this.saltoNivel = 50;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.ancho, this.alto);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fill();
        this.ctx.stroke();
        this.rePaintEsquina(this.x, this.y, this.ancho / 2, this.alto / 2, this.nivel1);
        this.rePaintEsquina(this.x + this.ancho / 2, this.y, this.ancho / 2, this.alto / 2, this.nivel2);
        this.rePaintEsquina(this.x, this.y + this.alto / 2, this.ancho / 2, this.alto / 2, this.nivel3);
        this.rePaintEsquina(this.x + this.ancho / 2, this.y + this.alto / 2, this.ancho / 2, this.alto / 2, this.nivel4);
    }

    contienePunto(x, y) {
        return (x >= this.x && x <= (this.x + this.ancho) && y >= this.y && y <= (this.y + this.alto));
    }

    registrarVista(x, y, pos) {
        if (x >= this.x && x <= (this.x + this.ancho / 2) && y >= this.y && y <= (this.y + this.alto / 2)) {
            this.esquina1 += this.evaluarEsquina(this.esquina1, pos);
            if (this.esquina1 % this.saltoNivel == 0) {
                this.nivel1++;
                this.rePaintEsquina(this.x, this.y, this.ancho / 2, this.alto / 2, this.nivel1);
            }
        }
        if (x >= (this.x + this.ancho / 2) && x <= (this.x + this.ancho) && y >= this.y && y <= (this.y + this.alto / 2)) {
            this.esquina2 += this.evaluarEsquina(this.esquina2, pos);
            if (this.esquina2 % this.saltoNivel == 0) {
                this.nivel2++;
                this.rePaintEsquina(this.x + this.ancho / 2, this.y, this.ancho / 2, this.alto / 2, this.nivel1);
            }
        }
        if (x >= this.x && x <= (this.x + this.ancho / 2) && y >= (this.y + this.alto / 2) && y <= (this.y + this.alto)) {
            this.esquina3 += this.evaluarEsquina(this.esquina3, pos);
            if (this.esquina3 % this.saltoNivel == 0) {
                this.nivel3++;
                this.rePaintEsquina(this.x, this.y + this.alto / 2, this.ancho / 2, this.alto / 2, this.nivel1);
            }
        }
        if (x >= (this.x + this.ancho / 2) && x <= (this.x + this.ancho) && y >= (this.y + this.alto / 2) && y <= (this.y + this.alto)) {
            this.esquina4 += this.evaluarEsquina(this.esquina4, pos);
            if (this.esquina4 % this.saltoNivel == 0) {
                this.nivel4++;
                this.rePaintEsquina(this.x + this.ancho / 2, this.y + this.alto / 2, this.ancho / 2, this.alto / 2, this.nivel1);
            }
        }
    }
    evaluarEsquina(pos) {
        if (pos == 0 || pos == 1)
            return 2;
        else
            return 1;
    }
    getValoracionEsquina(x, y) {
        if (x >= this.x && x <= (this.x + this.ancho / 2) && y >= this.y && y <= (this.y + this.alto / 2)) {
            return this.nivel1;
        }
        if (x >= (this.x + this.ancho / 2) && x <= (this.x + this.ancho) && y >= this.y && y <= (this.y + this.alto / 2)) {
            return this.nivel2;
        }
        if (x >= this.x && x <= (this.x + this.ancho / 2) && y >= (this.y + this.alto / 2) && y <= (this.y + this.alto)) {
            return this.nivel3;
        }
        if (x >= (this.x + this.ancho / 2) && x <= (this.x + this.ancho) && y >= (this.y + this.alto / 2) && y <= (this.y + this.alto)) {
            return this.nivel4;
        }
    }
    getNumeroCuadra() {
        return this.numeroCuadra;
    }
    getValoresEsquinas() {
        return [this.esquina1, this.esquina2, this.esquina3, this.esquina4];
    }
    getNivelesEsquinas() {
        return [this.nivel1, this.nivel2, this.nivel3, this.nivel4];
    }
    rePaintEsquina(x, y, ancho, alto, nivel) {
        //imprimir el nivel de la esquina
        this.ctx.beginPath();
        this.ctx.rect(x, y, ancho, alto);
        this.ctx.fillStyle = this.getColorNivel(nivel);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.font = '20px Arial'; // Tamaño y fuente del texto
        this.ctx.fillStyle = 'black'; // Color del texto

        // Calcular la posición para centrar el texto
        const textWidth = this.ctx.measureText(nivel).width;
        const textX = x + (ancho / 2) - (textWidth / 2);
        const textY = y + (alto / 2) + (parseInt(this.ctx.font, 10) / 2); // Ajuste para centrar verticalmente

        // Imprimir el texto en el centro del rectángulo
        this.ctx.fillText(nivel, textX, textY);
    }

    getColorNivel(nivel) {
        if (nivel == 1) {
            return 'rgba(0, 0, 0, 0.8)';
        } else if (nivel == 2) {
            return 'rgba(255, 255, 0, 0.8)';
        } else if (nivel == 3) {
            return 'rgba(255, 0, 0, 0.8)';
        } else if (nivel == 4) {
            return 'rgba(0, 255, 0, 0.8)';
        } else if (nivel == 5) {
            return 'rgba(0, 0, 255, 0.8)';
        } else if (nivel == 6) {
            return 'rgba(255, 0, 255, 0.8)';
        } else if (nivel == 7) {
            return 'rgba(0, 255, 255, 0.8)';
        } else if (nivel == 8) {
            return 'rgba(255, 255, 255, 0.8)';
        } else if (nivel == 9) {
            return 'rgba(128, 128, 128, 0.8)';
        } else if (nivel == 10) {
            return 'rgba(128, 0, 0, 0.8)';
        } else {
            return 'rgba(128, 0, 0, 0.8)';
        }
    }
}