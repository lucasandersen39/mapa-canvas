export class Calle {
    constructor(x, y, context, ancho, alto) {
        this.x = x;
        this.y = y;
        this.ctx = context;
        this.ancho = ancho;
        this.alto = alto;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.ancho, this.alto);
        this.ctx.fillStyle = 'rgba(80, 80, 80, 0.8)';
        this.ctx.fill();
        this.ctx.stroke();
    }

    contienePunto(x, y) {
        return (x >= this.x && x <= (this.x + this.ancho) && y >= this.y && y <= (this.y + this.alto));
    }

}