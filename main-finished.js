// counting balls
var paragraph = document.querySelector('p');
var count = 0;

// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// use full screen for the canvas and store width and height properties
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// this function generates a random number between min and max
function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}


// constructors ------------------------------------------------------------------------------

// define Shape constructor (highest user defined level)
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// define Ball constructor
function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// define EvilCircle constructor
function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// prototyping ------------------------------------------------------------------

// define EvilCircle draw method
EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// define EvilCircle update method
EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

EvilCircle.prototype.setControls = function () {

  // This is necessary, because within the onkeydown function, this refers to something else!
  var _this = this;

  // 65 = A = move to the left
  // 68 = D = move to the right
  // 87 = W = move up
  // 83 = X = move down
  window.onkeydown = function (e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  }
}

// define EvilCircle collision detection
EvilCircle.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    // Elements are NOT removed from the balls array.
    // Instead, the 'exists' property is set to 'false'
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        paragraph.textContent = 'Ball count: ' + count;
      }
    }
  }
};

// define ball draw method
Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// define ball update method
Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection
Ball.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
      }
    }
  }
};

// define array to store balls and populate it
var balls = [];

while (balls.length < 25) {
  var size = random(10, 20);
  var ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size
  );
  balls.push(ball);
  count++;
  paragraph.textContent = 'Ball count: ' + count;
}

// create the EvilCircle object and put it randomly on the screen
var evil = new EvilCircle(random(0, width), random(0, height), true);
evil.setControls();


// define loop that keeps drawing the scene constantly
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < balls.length; i++) {
    // We just ignore the balls that don't exist anymore
    // So they don't get redrawn
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();
  
  requestAnimationFrame(loop);
}


loop();