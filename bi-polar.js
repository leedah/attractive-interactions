/*
* Created by https://github.com/leedah using p5.js
* Some functions are modified versions from http://www.generative-gestaltung.de/2/
*/

var particles = [];
var colors = [];
var particleCount = 600;
var radius = 4;
var amp = 3;

function setup() {
  
    createCanvas(windowWidth, windowHeight);
    noStroke();
    createParticles();
}

function draw() {

    fill(0);
    rect(0, 0, windowWidth, windowHeight);

    for (var i = 0; i < particles.length; i++) {
      particles[i].attractParticles(particles);
      particles[i].update();
      colors[i] = color(random(100, 255), random(100, 255),random(100, 255));
      fill(colors[i]);
      ellipse(particles[i].x, particles[i].y, radius, radius);
    }
}

function createParticles() {

    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle(windowWidth/2 + random(-1, 1),
                                  windowHeight/2 + random(-1, 1),
                                  radius,windowWidth - radius,
                                  radius,windowHeight - radius
      ))
    }
}

let Particle = function(x, y, minX, maxX, minY, maxY) {
  
  p5.Vector.call(this, x, y, 0);
  this.velocity = createVector();
  this.pVelocity = createVector();
  
  this.minX = minX;
  this.maxX = maxX;
  this.minY = minY;
  this.maxY = maxY;
  
  this.ramp = 12;
  this.force = random(-10,10);  // attract or repel
  this.zeta = 0.4;              // damping ratio
  this.radius = 100;            // scope of interaction
  this.maxVelocity = 15; 

};

// Create a particle system

Particle.prototype = Object.create(p5.Vector.prototype);

Particle.prototype.attractParticles = function(particleArray) {
  
  for (var i = 0; i < particleArray.length; i++) {
    var otherParticle = particleArray[i];
    if (otherParticle === this) continue;
    this.attract(otherParticle);
  }
};

Particle.prototype.attract = function(otherParticle) {
  
  var thisParticleVector  = createVector(this.x, this.y);
  var otherParticleVector = createVector(otherParticle.x, otherParticle.y);
  var distance = thisParticleVector.dist(otherParticleVector);

  if (distance > 0 && distance < this.radius) {
    
    var strength  =  pow(distance / this.radius, 1 / this.ramp);
    var force     =  strength * amp * 3 * this.force * (1 / (strength + 1) + 
                    ((strength - amp) / (amp + 1))) / distance;
    var df        = thisParticleVector.sub(otherParticleVector);
    df.mult(force);

    otherParticle.velocity.x += df.x;
    otherParticle.velocity.y += df.y;
  }
};

Particle.prototype.update = function() {
  
  this.velocity.limit(this.maxVelocity);

  this.x += this.velocity.x;
  this.y += this.velocity.y;

  if (this.x < this.minX) {
    this.x = this.minX;
    this.velocity.x = -this.velocity.x;
  }
  if (this.y < this.minY) {
    this.y = this.minY;
    this.velocity.y = -this.velocity.y;
  }
  if (this.x > this.maxX) {
    this.x = this.maxX;
    this.velocity.x = -this.velocity.x;
  }
  if (this.y > this.maxY) {
    this.y = this.maxY;
    this.velocity.y = -this.velocity.y;
  }
  this.velocity.mult(1 - this.zeta);
};

Particle.prototype.constructor = Particle;