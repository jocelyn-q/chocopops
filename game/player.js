var Player = function (name, color, position, direction) {
  this.name = name;
  this.position = position;
  this.life = 3;
  this.bullets = new Array();
  this.direction = direction;
  this.speed = 0;
  this.isDead = false;
  this.isWin = false;
  this.isInvicible = false;

  this.material = new THREE.MeshLambertMaterial({
    color: color,
  });

  var singleGeometry = new THREE.Geometry();

  if (this.name === "player2") {
    vehiculeMesh = new THREE.BoxGeometry(20, 20, 20);
  } else {
    vehiculeMesh = new THREE.ConeGeometry(5, 20, 32);
  }
  this.graphic = new THREE.Mesh(vehiculeMesh, this.material);
  this.graphic.position.z = 6;

  this.graphic.rotateOnAxis(new THREE.Vector3(0, 0, 1), this.direction + (3 * Math.PI) / 2);
};

Player.prototype.dead = function () {
  this.graphic.position.z = this.graphic.position.z - 0.1;
  //Nettoyage de la div container
  $("#container").html("");
  jQuery("#" + this.name + " >.life").text("Tu es mort !");
  init();
};

Player.prototype.hurt = function () {
  this.life--;
  this.isInvicible = true;

  if (this.life <= 0) {
    this.dead();
  } else {
    setTimeout(() => {
      this.isInvicible = false;
    }, 3000);
  }
};

Player.prototype.win = function () {
  this.graphic.position.z = this.graphic.position.z - 0.1;
  this.isWin = true;

  // Create a new div element
  const winDiv = document.createElement("div");
  winDiv.textContent = "Tu as gagné !";

  // Add a class or ID to the new div if needed
  winDiv.className = "win-message"; // You can style it using CSS later

  // Append the div to the container with the ID "container"
  const container = document.getElementById("container");
  container.appendChild(winDiv);

  setTimeout(() => {
    // Remove the div after 3 seconds
    container.removeChild(winDiv);
    //Nettoyage de la div container
    $("#container").html("");
    this.isWin = false;
    init();
  }, 3000);
};

Player.prototype.accelerate = function (distance) {
  var max = 2;

  this.speed += distance / 4;
  if (this.speed >= max) {
    this.speed = max;
  }
};

Player.prototype.decelerate = function (distance) {
  var min = -1;

  this.speed -= distance / 16;
  if (this.speed <= min) {
    this.speed = min;
  }
};

Player.prototype.displayInfo = function () {
  if (this.isWin) return;

  jQuery("#" + this.name + " >.life").text(this.life);
};

Player.prototype.turnRight = function (angle) {
  this.direction -= angle;
  this.graphic.rotateOnAxis(new THREE.Vector3(0, 0, -1), angle);
};

Player.prototype.turnLeft = function (angle) {
  this.direction += angle;
  this.graphic.rotateOnAxis(new THREE.Vector3(0, 0, 1), angle);
};

Player.prototype.move = function () {
  var moveTo = new THREE.Vector3(this.speed * Math.cos(this.direction) + this.position.x, this.speed * Math.sin(this.direction) + this.position.y, this.graphic.position.z);

  this.position = moveTo;

  if (this.speed > 0) {
    this.speed = this.speed - 0.04;
  } else if (this.speed < 0) {
    this.speed = this.speed + 0.04;
  }

  this.graphic.position.x = this.position.x;
  this.graphic.position.y = this.position.y;

  light1.position.x = this.position.x;
  light1.position.y = this.position.y;
  light1.position.z = this.graphic.position.z + 500;
};
