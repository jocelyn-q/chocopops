var bulletTime1 = 0;

var bullet_player1_material = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  transparent: false,
});

function shoot() {
  if (keyboard.pressed("space") && bulletTime1 + 0.8 < clock.getElapsedTime()) {
    bullet = new THREE.Mesh(new THREE.SphereGeometry(2), bullet_player1_material);
    scene.add(bullet);
    bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
    bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
    bullet.angle = player1.direction;
    player1.bullets.push(bullet);
    bulletTime1 = clock.getElapsedTime();
  }

  // move bullets
  var moveDistance = 5;

  for (var i = 0; i < player1.bullets.length; i++) {
    player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
    player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);
  }
}

function collisions() {
  bullet_collision();
  player_collision();
  player_falling();
  bullet_hit();
  player_hit_by_enemy();
  move_enemy();
}

function bullet_collision() {
  //collision between bullet and walls
  for (var i = 0; i < player1.bullets.length; i++) {
    if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 || Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2) {
      scene.remove(player1.bullets[i]);
      player1.bullets.splice(i, 1);
      i--;
    }
  }
}

function bullet_hit() {
  //collision between bullet and walls
  if (player2.isDead) {
    return;
  }
  for (var i = 0; i < player1.bullets.length; i++) {
    if (Math.abs(player1.bullets[i].position.x) - Math.abs(player2.position.x) <= 10 && Math.abs(player1.bullets[i].position.y) - Math.abs(player2.position.y) <= 10) {
      console.log("hit");
      scene.remove(player1.bullets[i]);
      scene.remove(player2.graphic);
      player1.bullets.splice(i, 1);
      player2.isDead = true;
      player1.win();
      break;
    }
  }
}

function move_enemy() {
  if (player2.isDead) {
    return;
  }
  const speed = 1; // Adjust the speed as needed
  const wallThreshold = 20; // The distance at which player2 will change direction when near a wall

  // Calculate the new position for player2
  const newX = this.player2.position.y + speed;
  // Check if player2 is about to hit a wall on the right side
  if (newX > HEIGHT / 2 - wallThreshold) {
    // Change direction when near the wall
    this.player2.movepos *= -1;
  } else if (newX < -HEIGHT / 2 + wallThreshold) {
    this.player2.movepos *= -1;
  }
  this.player2.graphic.position.y += speed * this.player2.movepos;
  this.player2.position.y += speed * this.player2.movepos;
}

function player_hit_by_enemy() {
  //collision between bullet and walls
  if (player1.isInvicible) {
    return;
  }
  const player1Position = player1.graphic.position;
  const player2Position = player2.graphic.position;
  const collisionThreshold = 15; // Adjust the threshold as needed

  // Calculate the distance between player1 and player2
  const distanceX = Math.abs(player1Position.x - player2Position.x);
  const distanceY = Math.abs(player1Position.y - player2Position.y);

  // Check if the distance is less than the collision threshold
  if (distanceX <= collisionThreshold && distanceY <= collisionThreshold) {
    player1.hurt();
  }
}

function player_collision() {
  //collision between player and walls
  var x = player1.graphic.position.x + WIDTH / 2;
  var y = player1.graphic.position.y + HEIGHT / 2;

  if (x > WIDTH) {
    player1.position.x -= x - WIDTH;
    player1.graphic.position.x -= x - WIDTH;
  }
  if (x < 0) {
    player1.position.x -= x;
    player1.graphic.position.x -= x;
  }
  if (y < 0) {
    player1.position.y -= y;
    player1.graphic.position.y -= y;
  }
  if (y > HEIGHT) {
    player1.position.y -= y - HEIGHT;
    player1.graphic.position.y -= y - HEIGHT;
  }
}

function player_falling() {
  var nb_tile = 10;
  var sizeOfTileX = WIDTH / nb_tile;
  var sizeOfTileY = HEIGHT / nb_tile;
  var x = player1.graphic.position.x | 0;
  var y = player1.graphic.position.y | 0;
  var length = noGround.length;
  var element = null;

  for (var i = 0; i < length; i++) {
    element = noGround[i];

    if (element) {
      var tileX = (element[0] - sizeOfTileX / 2) | 0;
      var tileY = (element[1] - sizeOfTileY / 2) | 0;
      var mtileX = (element[0] + sizeOfTileX / 2) | 0;
      var mtileY = (element[1] + sizeOfTileY / 2) | 0;

      if (this.x > tileX && x < mtileX && y > tileY && y < mtileY) {
        player1.dead();
      }
    }
  }
}
