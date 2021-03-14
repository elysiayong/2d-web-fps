class GameTile{
    constructor(position, imgPos, spritesheet){
        this.position = position;
        this.imgPos = imgPos;
        this.spritesheet = spritesheet;
    }

    draw(context){
        this.spritesheet.draw(context, this.imgPos.x, this.imgPos.y, this.position.x, this.position.y);
    }
}