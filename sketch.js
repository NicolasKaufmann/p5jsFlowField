let blowers = [];
let particles = [];
let t = 0;
let abstandBlowers = 120;
let nParticles = 1000;

function setup() {
  angleMode(DEGREES);
  colorMode(HSB, 100);

  createCanvas(windowWidth, windowHeight);
  background(0);

  for (let j = 0; j < height / abstandBlowers; j++) {
    for (let i = 0; i < width / abstandBlowers; i++) {
      let posx = i * abstandBlowers + abstandBlowers / 2;
      let posy = j * abstandBlowers + abstandBlowers / 2;
      blowers.push(new Blower(posx, posy));
    }
  }

  for (let i = 0; i < nParticles; i++) {
    posx = random(width);
    posy = random(height);
    particles.push(new Particle(posx, posy));
  }
}

function draw() {
  background(0, 5);
  t += 0.05;

  for (let i = blowers.length - 1; i >= 0; i--) {
    blowers[i].update(t);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
  }
}

class Blower {
  constructor(posx, posy) {
    this.posx = posx;
    this.posy = posy;
    this.direction = 0;
  }

  update() {
    //circle(this.posx, this.posy, noise(this.posx + t, this.posy + t) * 15);
    push();
    translate(this.posx, this.posy);
    this.direction = noise(this.posx + t, this.posy + t) * 360;
    rotate(this.direction);

    stroke(0);
    //line(0, 0, 20, 0);
    pop();
  }
}


class Particle {
  constructor(posx, posy) {
    this.posX = posx;
    this.posY = posy;
    this.nextBlower = 0;
    this.speed = 1;
    this.speedX = 0;
    this.speedY = 0;
    this.rotation = 0;
    this.color = noise(this.posX + t, this.posY + t) * 100;
  }

  update() {
    let shortestDist = Infinity;
    let distance = 0;
    for (let i = blowers.length - 1; i >= 0; i--) {
      distance = dist(this.posX, this.posY, blowers[i].posx, blowers[i].posy);
      if (distance < shortestDist) {
        shortestDist = distance;
        this.nextBlower = blowers[i];
        this.rotation = lerp(this.rotation, this.nextBlower.direction + 90, 0.6);
      }
    }

    this.speedX = sin(-this.rotation) * -this.speed;
    this.speedY = cos(-this.rotation) * -this.speed;
    this.posX += this.speedX;
    this.posY += this.speedY;

    if (this.posX < -10) {
      this.posX = width;
    }
    if (this.posX > width + 10) {
      this.posX = 0;
    }
    if (this.posY < -10) {
      this.posY = height;
    }
    if (this.posY > height + 10) {
      this.posY = 0;
    }

    noStroke();
    this.color = lerp(this.color, noise(this.posX + t, this.posY + t) * 100, 0.001);
    fill(this.color, 100, 100);
    circle(this.posX, this.posY, 10)
  }
}