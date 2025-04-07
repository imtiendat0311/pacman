class Ghost {
  constructor(x, y, w, h, s, ix, iy, iw, ih, r, st, n) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
    this.direction = DIRECTION_UP;
    this.nextDirection = this.direction;
    this.currentFrame = 1;
    this.frameCount = 7;
    this.iy = iy;
    this.ix = ix;
    this.iw = iw;
    this.ih = ih;
    this.r = r; // radius of the ghost
    this.st = st; // scatter target
    this.target = st;
    this.name = n; // name of the ghost
    this.moveSet = [];
    this.isDead = false; // if the ghost is dead
    setInterval(() => {
      this.changeAnimation();
    }, 100);
  }

  moveProcess() {
    this.changeDirectionIfPossible();
    this.moveForward();
    if (this.checkCollision()) {
      this.moveBackwards();
    }
  }

  moveBackwards() {
    switch (this.direction) {
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

  moveForward() {
    switch (this.direction) {
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

  checkCollision() {
    let isCollision = false;
    if (
      map[this.getMapY()][this.getMapX()] == 1 ||
      map[this.getMapY()][this.getMapXRight()] == 1 ||
      map[this.getMapYRight()][this.getMapX()] == 1 ||
      map[this.getMapYRight()][this.getMapXRight()] == 1
    ) {
      isCollision = true;
    }
    return isCollision;
  }

  checkGhostCollision() {}


  addNeighbors(poped, mp) {
    let queue = [];
    let numOfRows = mp.length;
    let numOfCols = mp[0].length;
    if (
      poped.x - 1 >= 0 &&
      poped.x - 1 < numOfCols &&
      mp[poped.y][poped.x - 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      if (
        tempMoves.length > 0 &&
        tempMoves[tempMoves.length - 1] != DIRECTION_RIGHT
      ) {
        tempMoves.push(DIRECTION_LEFT);
        queue.push({
          x: poped.x - 1,
          y: poped.y,
          moves: tempMoves,
        });
      }
      if (tempMoves.length == 0 && this.direction != DIRECTION_RIGHT) {
        tempMoves.push(DIRECTION_LEFT);
        queue.push({
          x: poped.x - 1,
          y: poped.y,
          moves: tempMoves,
        });
      }
    }
    if (
      poped.x + 1 >= 0 &&
      poped.x + 1 < numOfCols &&
      mp[poped.y][poped.x + 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      if (
        tempMoves.length > 0 &&
        tempMoves[tempMoves.length - 1] != DIRECTION_LEFT
      ) {
        tempMoves.push(DIRECTION_RIGHT);
        queue.push({
          x: poped.x + 1,
          y: poped.y,
          moves: tempMoves,
        });
      }
      if (tempMoves.length == 0 && this.direction != DIRECTION_LEFT) {
        tempMoves.push(DIRECTION_RIGHT);
        queue.push({
          x: poped.x + 1,
          y: poped.y,
          moves: tempMoves,
        });
      }
    }
    if (
      poped.y - 1 >= 0 &&
      poped.y - 1 < numOfRows &&
      mp[poped.y - 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      if (
        tempMoves.length > 0 &&
        tempMoves[tempMoves.length - 1] != DIRECTION_DOWN
      ) {
        tempMoves.push(DIRECTION_UP);
        queue.push({
          x: poped.x,
          y: poped.y - 1,
          moves: tempMoves,
        });
      }
      if (tempMoves.length == 0 && this.direction != DIRECTION_DOWN) {
        tempMoves.push(DIRECTION_UP);
        queue.push({
          x: poped.x,
          y: poped.y - 1,
          moves: tempMoves,
        });
      }
    }
    if (
      poped.y + 1 >= 0 &&
      poped.y + 1 < numOfRows &&
      mp[poped.y + 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      if (
        tempMoves.length > 0 &&
        tempMoves[tempMoves.length - 1] != DIRECTION_UP
      ) {
        tempMoves.push(DIRECTION_DOWN);
        queue.push({
          x: poped.x,
          y: poped.y + 1,
          moves: tempMoves,
        });
      }
      if (tempMoves.length == 0 && this.direction != DIRECTION_UP) {
        tempMoves.push(DIRECTION_DOWN);
        queue.push({
          x: poped.x,
          y: poped.y + 1,
          moves: tempMoves,
        });
      }
    }
    return queue;
  }

  findAvailableDirection(map) {
    let availableDirections = [];
    let desperateDirection = [];
    // Check all four directions
    if (
      this.getMapY() > 0 &&
      map[this.getMapY() - 1][this.getMapX()] !== 1 &&
      this.direction !== DIRECTION_DOWN
    ) {
      availableDirections.push(DIRECTION_UP);
      desperateDirection.push(DIRECTION_UP);
    }
    if (
      this.getMapY() < map.length - 1 &&
      map[this.getMapY() + 1][this.getMapX()] !== 1 &&
      this.direction !== DIRECTION_UP
    ) {
      availableDirections.push(DIRECTION_DOWN);
      desperateDirection.push(DIRECTION_DOWN);
    }
    if (
      this.getMapX() > 0 &&
      map[this.getMapY()][this.getMapX() - 1] !== 1 &&
      this.direction !== DIRECTION_RIGHT
    ) {
      availableDirections.push(DIRECTION_LEFT);
      desperateDirection.push(DIRECTION_LEFT);
    }
    if (
      this.getMapX() < map[0].length - 1 &&
      map[this.getMapY()][this.getMapX() + 1] !== 1 &&
      this.direction !== DIRECTION_LEFT
    ) {
      availableDirections.push(DIRECTION_RIGHT);
      desperateDirection.push(DIRECTION_RIGHT);
    }

    // Randomly choose one of the available directions
    if (availableDirections.length > 0) {
      return availableDirections[
        Math.floor(Math.random() * availableDirections.length)
      ];
    }
    if (availableDirections.length == 0) {
      return desperateDirection[
        Math.floor(Math.random() * desperateDirection.length)
      ];
    }
  }

  calculateNewDirection(map, targetX, targetY) {
    let mp = [];
    for (let i = 0; i < map.length; i++) {
      mp[i] = map[i].slice();
    }
    let queue = [
      {
        x: this.getMapX(),
        y: this.getMapY(),
        moves: [],
      },
    ];
    // reach target
    if (this.getMapX() == targetX && this.getMapY() == targetY) {
      return this.findAvailableDirection(map);
    }
    while (queue.length > 0) {
      let poped = queue.shift();
      if (poped.x == targetX && poped.y == targetY) {
        this.moveSet = poped.moves;
        return poped.moves[0];
      } else {
        mp[poped.y][poped.x] = 1; // mark as visited
        let neighborList = this.addNeighbors(poped, mp);
        for (let i = 0; i < neighborList.length; i++) {
          queue.push(neighborList[i]);
        }
      }
    }
    return DIRECTION_LEFT;
  }

  changeDirectionIfPossible() {
    let tempDirection = this.direction;
    // tunnel
    if (this.getMapY() == 10 && (this.getMapX() == 1)) {
        this.direction = DIRECTION_RIGHT;
    }
    else if (this.getMapY() == 10 && (this.getMapX() == 19)) {
        this.direction = DIRECTION_LEFT;
    }
    // dead first 
    if (this.isDead) {
        this.target = {
            x: (9 * oneBlockSize) + oneBlockSize,
            y: (10 * oneBlockSize)+ oneBlockSize,
        }
        if(this.getMapX() == this.target.x/oneBlockSize && this.getMapY() == this.target.y/oneBlockSize) {
            this.isDead = false;
        }
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );
    }
    else if (isScatter) {
      this.target = this.st;
      // scatter mode
      this.direction = this.calculateNewDirection(
        map,
        parseInt(this.target.x),
        parseInt(this.target.y)
      );
    } else {
      if (this.name == "Blinky") {
        this.target = pacman;
        this.direction = this.calculateNewDirection(
          map,
          parseInt(this.target.x / oneBlockSize),
          parseInt(this.target.y / oneBlockSize)
        );
      }
      // Clyde
      // chase pacman if outside the radius of 8 blocks
      // move to the scatter target if inside the radius of 8 blocks
      else if (this.name == "Clyde") {
        this.target = pacman;
        let currentPX = pacman.getMapX();
        let currentPY = pacman.getMapY();
        // radius of pacman to clyde
        let xDistance = Math.abs(this.getMapX() - currentPX);
        let yDistance = Math.abs(this.getMapY() - currentPY);
        if (Math.sqrt(xDistance * xDistance + yDistance * yDistance) < 8) {
          this.target = this.st;
          this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x),
            parseInt(this.target.y)
          );
        } else {
          this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
          );
        }
      }
      // Pinky
      // infront of pacman
      // if up then target is up - 2 and left - 1
      // if down then target is down + 2
      // if left then target is left - 2
      // if right then target is right + 2
      else if (this.name == "Pinky") {
        this.target = pacman;
        let currentPX = pacman.getMapX();
        let currentPY = pacman.getMapY();
        let currentPD = pacman.direction;
        let tX = currentPX;
        let tY = currentPY;
        if (currentPD == DIRECTION_UP) {
          tX = currentPX - 2;
          tY = currentPY - 2;
        } else if (currentPD == DIRECTION_DOWN) {
          tY = currentPY + 2;
        } else if (currentPD == DIRECTION_LEFT) {
          tX = currentPX - 2;
        } else if (currentPD == DIRECTION_RIGHT) {
          tX = currentPX + 2;
        }
        if (tX < 0 || tX >= map[0].length) {
          tX = tX < 0 ? 1 : map[0].length - 2;
        }
        if (tY < 0 || tY >= map.length) {
          tY = tY < 0 ? 1 : map.length - 2;
        }
        this.direction = this.calculateNewDirection(
          map,
          parseInt(tX),
          parseInt(tY)
        );
      } else if (this.name == "Inky") {
        this.target = pacman;
        let currentPX = pacman.getMapX();
        let currentPY = pacman.getMapY();
        let currentPD = pacman.direction;
        let tX = currentPX;
        let tY = currentPY;

        // Calculate the point two tiles ahead of Pacman
        if (currentPD == DIRECTION_UP) {
          tX = currentPX - 2;
          tY = currentPY - 2;
        } else if (currentPD == DIRECTION_DOWN) {
          tY = currentPY + 2;
        } else if (currentPD == DIRECTION_LEFT) {
          tX = currentPX - 2;
        } else if (currentPD == DIRECTION_RIGHT) {
          tX = currentPX + 2;
        }

        // Ensure the target point is within bounds
        if (tX < 0 || tX >= map[0].length) {
          tX = tX < 0 ? 1 : map[0].length - 2;
        }
        if (tY < 0 || tY >= map.length) {
          tY = tY < 0 ? 1 : map.length - 2;
        }

        // Get Blinky's position
        let blinky = ghosts.find((ghost) => ghost.name === "Blinky");
        if (blinky) {
          let blinkyX = blinky.getMapX();
          let blinkyY = blinky.getMapY();

          // Calculate Inky's target by doubling the vector from Blinky to the point ahead of Pacman
          let targetX = tX + (tX - blinkyX);
          let targetY = tY + (tY - blinkyY);

          // Ensure the calculated target is within bounds
          if (targetX < 0 || targetX >= map[0].length) {
            targetX = targetX < 0 ? 1 : map[0].length - 2;
          }
          if (targetY < 0 || targetY >= map.length) {
            targetY = targetY < 0 ? 1 : map.length - 2;
          }

          // Set Inky's direction toward the calculated target
          this.direction = this.calculateNewDirection(
            map,
            parseInt(targetX),
            parseInt(targetY)
          );
        }
      } else {
        this.direction = this.calculateNewDirection(
          map,
          parseInt(this.target.x),
          parseInt(this.target.y)
        );
      }
    }

    if (typeof this.direction === "undefined") {
      this.direction = tempDirection;
      return;
    }

    this.moveForward();
    if (this.checkCollision()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }
  changeAnimation() {
    this.currentFrame =
      this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
  }

  getMapX() {
    return parseInt(this.x / oneBlockSize);
  }
  getMapY() {
    return parseInt(this.y / oneBlockSize);
  }
  getMapXRight() {
    return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize);
  }
  getMapYRight() {
    return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize);
  }
  draw() {
    canvasContext.save();
    canvasContext.drawImage(
      ghostFrame,
      this.ix,
      this.iy,
      this.iw,
      this.ih,
      this.x,
      this.y,
      this.w,
      this.h
    );
    canvasContext.restore();
  }
}
