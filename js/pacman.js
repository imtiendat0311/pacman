class Pacman{
    constructor(x,y,w,h,s){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.s = s;
        this.direction = DIRECTION_RIGHT;
        this.nextDirection = this.direction;
        this.currentFrame = 1;
        this.frameCount = 7;
        setInterval(()=>{
            this.changeAnimation();
        },100)
    }

    moveProcess(){
        this.changeDirectionIfPossible();
        this.moveForward();
        if(this.checkCollision()){
            this.moveBackwards();
        }
    }

    eat(){
        for(let i =0 ; i < map.length;i++){
            for(let j =0 ; j < map[i].length;j++){
                if(map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i){
                    map[i][j] = 3;
                    score++;
                }
                if(map[i][j] == 5 && this.getMapX() == j && this.getMapY() == i){
                    map[i][j] = 3;
                    ghosts.forEach(ghost=>{
                        ghost.isScared = true;
                    });
                    // 7seconds timer
                    setTimeout(()=>{
                        ghosts.forEach(ghost=>{
                            ghost.isScared = false;
                        });
                    },7000);
                }
            }
        }
    }

    moveBackwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x -= this.s;
                break;
            case DIRECTION_LEFT:
                this.x += this.s;
                break;
            case DIRECTION_UP:
                this.y += this.s;
                break;
            case DIRECTION_DOWN:
                this.y -= this.s;
                break;
        }
    }
    moveForward(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x += this.s;
                break;
            case DIRECTION_LEFT:
                this.x -= this.s;
                break;
            case DIRECTION_UP:
                this.y -= this.s;
                break;
            case DIRECTION_DOWN:
                this.y += this.s;
                break;
        }
    }

    checkCollision(){
        let isCollision = false;
        if(map[this.getMapY()][this.getMapX()] == 1
            || map[this.getMapY()][this.getMapXRight()] == 1
            || map[this.getMapYRight()][this.getMapX()] == 1
            || map[this.getMapYRight()][this.getMapXRight()] == 1){
            isCollision = true;
        }
        return isCollision;
  
    }
    checkGhostCollision(){
        for(let i =0 ; i < ghosts.length;i++){
            if(this.getMapX() == ghosts[i].getMapX() && this.getMapY() == ghosts[i].getMapY()){
                console.log("ghost collision");
                if(ghosts[i].isScared){
                    console.log("ghost is dead");
                    ghosts[i].isDead = true;
                    ghosts[i].isScared = false;
                }
            }
        }
    }

    changeDirectionIfPossible(){
        this.checkGhostCollision();
        if(this.direction == this.nextDirection){
            return;
        }
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForward();
        if(this.checkCollision()){
            this.moveBackwards();
            this.direction = tempDirection;
        }else{
            this.moveBackwards();
        }

    }
    changeAnimation(){
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    getMapX()
    {
        return parseInt(this.x/oneBlockSize);
    }
    getMapY()
    {
        return parseInt(this.y/oneBlockSize);
    }
    getMapXRight()
    {
        return parseInt((this.x+0.9999*oneBlockSize)/oneBlockSize);
    }
    getMapYRight()
    {
        return parseInt((this.y+0.9999*oneBlockSize)/oneBlockSize);
    }
    draw(){
        canvasContext.save();
        canvasContext.translate(this.x + oneBlockSize/2
            , this.y + oneBlockSize/2);
        canvasContext.rotate((this.direction *90 * Math.PI)/180);
        canvasContext.translate(-this.x - oneBlockSize/2
            , -this.y - oneBlockSize/2);
        canvasContext.drawImage(
            pacmanFrame,
            (this.currentFrame-1)*oneBlockSize,
            0,oneBlockSize,oneBlockSize,this.x,this.y,this.w,this.h
        )
        canvasContext.restore();
    }
}