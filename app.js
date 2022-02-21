let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let scoreElement = document.querySelector('#scoreEle')

canvas.width = 1024
canvas.height = 576
const playerScale = 0.15
const playerImage = new Image();
playerImage.src = './Chris Courses - Space Invaders/spaceship.png'
const invaderImage = new Image();
invaderImage.src = './Chris Courses - Space Invaders/invader.png'
class Player {
  constructor({ image }) {
    this.velocity = {
      x: 0,
      y: 0
    }
    this.opacity = 1
    this.rotation = 0
    this.height = image.height * playerScale
    this.width = image.width * playerScale
    this.image = image
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height - this.height
    }
  }
  draw() {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
    ctx.rotate(this.rotation)
    ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    ctx.restore()
  }
  update() {
    this.position.x += this.velocity.x
    this.draw()
  }
}
class Invader {
  constructor({ image, position }) {
    this.velocity = {
      x: 0,
      y: 0
    }
    this.height = image.height
    this.width = image.width
    this.image = image
    this.position = {
      x: position.x,
      y: position.y
    }
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  }
  update({ velocity }) {
    this.position.x += velocity.x
    this.position.y += velocity.y
    this.draw()
  }
  shoot() {
    Invadorprojectiles.push(new InvaderProjectile({
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height
      },
      velocity: {
        x: 0,
        y: 4
      }
    }))
  }
}
class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 3,
      y: 0
    }
    this.invaders = []
    const columns = Math.floor(Math.random() * 10 + 5)
    const rows = Math.floor(Math.random() * 5 + 2)
    this.width = columns * 30
    this.height = rows * 30
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            image: invaderImage,
            position: {
              x: x * 30,
              y: y * 30
            }
          }))
      }
    }
  }
  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.y = 0
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
  }
}
class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity
    this.radius = 3
  }
  draw() {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'red'
    ctx.fill()
    ctx.closePath()
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}
class Particle {
  constructor({ position, velocity, radius, color, fade = true }) {
    this.position = position;
    this.velocity = velocity
    this.radius = radius
    this.color = color;
    this.opacity = 1
    this.fade = fade
  }
  draw() {
    ctx.save()
    ctx.beginPath()
    ctx.globalAlpha = this.opacity
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
  update() {
    this.draw()
    if (this.fade) {
      this.opacity -= 0.01
    }
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}
class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity
    this.width = 3
    this.height = 10
  }
  draw() {
    ctx.fillStyle = 'red'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}
let score = 0
const player = new Player({ image: playerImage })
const projectiles = []
const particles = []
const Invadorprojectiles = []
const grids = [new Grid()]
const game = {
  over: false,
  active: true,
}
let frames = 0
let randomInterval = Math.floor(Math.random() * 500) + 500
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  }
}
function createStart() {
  for (let i = 0; i < 120; i++) {
    particles.push(new Particle({
      position: {
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random()
      },
      velocity: {
        x: 0,
        y: 0.3
      },
      radius: Math.random() * 3,
      color: '#fff',
      fade: false
    }))
  }
}
createStart()
function createCollapse({ object, color }) {
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle({
      position: {
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2
      },
      velocity: {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3
      },
      radius: Math.random() * 3,
      color: color || '#BAA0DE'
    }))
  }
}
function animation() {
  if (!game.active) return
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  //player
  player.update()
  if (keys.a.pressed && player.position.x > 0) {
    player.velocity.x = -5
    player.rotation = -0.15
  } else if (keys.d.pressed && player.position.x + player.width < canvas.width) {
    player.velocity.x = 5
    player.rotation = 0.15
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }
  console.log(particles.length)
  //particles
  particles.forEach((particle, i) => {
    if (particle.position.y + particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = Math.random() * canvas.height - canvas.height / 2
    }
    if (particle.opacity <= 0) {
      particles.splice(i, 1)
    } else {
      particle.update()
    }
  })

  //projectiles
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    } else {
      projectile.update()
    }
  })
  Invadorprojectiles.forEach((Invadorprojectile, index) => {
    if (Invadorprojectile.position.y + Invadorprojectile.height >= canvas.height) {
      setTimeout(() => {
        Invadorprojectiles.splice(index, 1)
      }, 0)
    } else {
      Invadorprojectile.update()
    }
    if (
      Invadorprojectile.position.y + Invadorprojectile.height >= player.position.y &&
      Invadorprojectile.position.x + Invadorprojectile.width >= player.position.x &&
      Invadorprojectile.position.x <= player.position.x + player.width
    ) {
      console.log('you lose')
      setTimeout(function () {
        Invadorprojectiles.splice(index, 1)
        player.opacity = 0
        game.over = true
      }, 0)
      setTimeout(function () {
        game.active = false
      }, 2000)
      createCollapse({ object: player, color: '#fff' })
    }
  })
  //invaders
  grids.forEach((grid, gridIndex) => {
    grid.update()
    //spawing invaderProjectiles
    if (frames % 100 === 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot()
    }
    grid.invaders.forEach((invader, index) => {
      invader.update({ velocity: grid.velocity })

      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {

          setTimeout(() => {
            score += 100
            scoreElement.innerHTML = score
            const FindProjectile = projectiles.find(projectile2 => projectile2 == projectile)
            const FindInvader = grid.invaders.find(invader2 => invader2 == invader)
            if (FindProjectile && FindInvader) {
              grid.invaders.splice(index, 1)
              projectiles.splice(j, 1)
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0]
                const lastInvader = grid.invaders[grid.invaders.length - 1]
                grid.width = lastInvader.position.x - firstInvader.position.x + firstInvader.width
                grid.position.x = firstInvader.position.x
              } else {
                grids.splice(gridIndex, 1)
              }
            }
            //spawn particles when collapse invader
            createCollapse({
              object: invader
            })

          }, 0)
        }
      })
    })
  })
  //frames
  frames++;
  //spawing enemies
  if (frames % randomInterval === 0) {
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500) + 500
  }

  requestAnimationFrame(animation)
}
animation()
addEventListener('keydown', e => {
  if (game.over) return
  switch (e.key) {
    case 'a':
      keys.a.pressed = true
      console.log('left')
      break
    case 'd':
      keys.d.pressed = true
      console.log('right')
      break
    case 'w':
      console.log('top')
      break
    case 's':
      console.log('down')
      break
    case ' ':
      projectiles.push(new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -15
        }
      }))
      console.log('space')
      break
  }
})
addEventListener('keyup', e => {
  switch (e.key) {
    case 'a':
      keys.a.pressed = false
      console.log('left')
      break
    case 'd':
      keys.d.pressed = false
      console.log('right')
      break
    case 'w':
      console.log('top')
      break
    case 's':
      console.log('down')
      break
  }
})