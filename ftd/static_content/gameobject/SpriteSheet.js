class SpriteSheet {
    constructor(spritesheet){
        this.size = 64;
        this.rows = 9;
        this.cols = 15;
        this.spritesheet = new Image();
        this.spritesheet.src = spritesheet;
    }


    draw(ctx, row, col, canvasX, canvasY){    
        var sx = col * this.size
        var sy = row * this.size;

        ctx.drawImage(this.spritesheet,
            sx, sy, this.size, this.size,
            canvasX, canvasY, this.size, this.size 
        )
    }

}