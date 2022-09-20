const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

let jumps = 1

c.fillRect(0,0,canvas.width,canvas.height)


const gravity = 1.1

const background = new Sprite({
    position: {
        x: 0,
        y:0
    },
    imagesrc : './Img/background.png'
})

const shop = new Sprite({
    position: {
        x:626,
        y:128
    },
    imagesrc : './Img/shop.png',
    scale: 2.75,
    framesmax: 6
})

const player = new Fighter({
    position: {
    x: 100,
    y: 100
  },
  velocity: {
    x:0,
    y:10
  },
  offset:{
    x: 0,
    y: 0
  },
  imagesrc : './Img/Mack/Sprites/idle.png',
  framesmax : 8,
  scale: 2.5,
  offset: {x: 215, y: 157},
  sprites: {
    idle:{
        imagesrc:'./Img/Mack/Sprites/Idle.png',
        framesmax: 8
    },
    run:{
        imagesrc:'./Img/Mack/Sprites/Run.png',
        framesmax: 8
    },
    jump:{
        imagesrc:'./Img/Mack/Sprites/Jump.png',
        framesmax: 2
    },
    fall:{
        imagesrc:'./Img/Mack/Sprites/Fall.png',
        framesmax: 2
    },
    attack1:{
        imagesrc:'./Img/Mack/Sprites/Attack1.png',
        framesmax: 6
    },
    takehit:{
        imagesrc:'./Img/Mack/Sprites/Take Hit - white silhouette.png',
        framesmax: 4
    },
    death:{
        imagesrc:'./Img/Mack/Sprites/Death.png',
        framesmax: 6
    }
  },
  attackbox:{
    offset: {
        x: 100,
        y: 50,
    },
    width: 150,
    height:50
  }
})


const enemy = new Fighter({
    position: {
    x: 800,
    y: 100
  },
  velocity: {
    x:0,
    y:0
  },
  color:'blue',
  offset:{
    x: -50,
    y: 0
  },
  imagesrc : './Img/kenji/Sprites/idle.png',
  framesmax : 4,
  scale: 2.5,
  offset: {x: 215, y: 172},
  sprites: {
    idle:{
        imagesrc:'./Img/kenji/Sprites/Idle.png',
        framesmax: 4
    },
    run:{
        imagesrc:'./Img/kenji/Sprites/Run.png',
        framesmax: 8
    },
    jump:{
        imagesrc:'./Img/kenji/Sprites/Jump.png',
        framesmax: 2
    },
    fall:{
        imagesrc:'./Img/kenji/Sprites/Fall.png',
        framesmax: 2
    },
    attack1:{
        imagesrc:'./Img/kenji/Sprites/Attack1.png',
        framesmax: 4
    },
    takehit:{
        imagesrc:'./Img/kenji/Sprites/Take hit.png',
        framesmax: 3
    },
    death:{
        imagesrc:'./Img/kenji/Sprites/Death.png',
        framesmax: 7
    }
  },
  attackbox:{
    offset: {
        x: -180,
        y: 50,
    },
    width: 180,
    height:50
  }
})

const keys = {
    a:{
        pressed : false
    },
    d:{
        pressed : false
    },
    w:{
        pressed : false
    },
    ArrowLeft:{
        pressed : false
    },
    ArrowRight:{
        pressed : false
    }
}

decreasetimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    //player movement
    player.velocity.x = 0
    if(keys.a.pressed && player.lastkey ==='a'){
        player.velocity.x = -5
        player.switchsprite('run')
    } 
    else if(keys.d.pressed && player.lastkey ==='d'){
        player.switchsprite('run')
        player.velocity.x = 5
    }else{
        player.switchsprite('idle')
    }
    //jumping animation
    if(player.velocity.y < 0){
        player.switchsprite('jump')
    }else if(player.velocity.y > 0){
        player.switchsprite('fall')
    }

    //enemy movement
    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed && enemy.lastkey ==='ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchsprite('run')
    } 
    else if(keys.ArrowRight.pressed && enemy.lastkey ==='ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchsprite('run')
    }else{
        enemy.switchsprite('idle')
    }
    //jumping animation
    if(enemy.velocity.y < 0){
        enemy.switchsprite('jump')
    }else if(enemy.velocity.y > 0){
        enemy.switchsprite('fall')
    }

    //detect collision and enemy is hit(player 2)
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    })&&
        player.isattacking && player.framecurrent === 4){
        enemy.health -= 20
        enemy.TAKEHIT()
        player.isattacking = false
        document.querySelector('#enemyhealth').style.width = enemy.health + '%'
    }

    if(player.isattacking && player.framecurrent === 4){
        player.isattacking = false
    }

    //detect collisiona dn our player is hit(player 1)
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    })&&
        enemy.isattacking && enemy.framecurrent === 2){
        player.health -= 10
        player.TAKEHIT()
        enemy.isattacking = false
        document.querySelector('#playerhealth').style.width = player.health + '%'
    }

    if(enemy.isattacking && enemy.framecurrent === 2){
        enemy.isattacking = false
    }

    //end the game based on health
    if(enemy.health <= 0 || player.health <= 0){
        determinewinner({player,enemy, timerid})
    }
}



animate()

window.addEventListener('keydown', (event) => {
    if(!player.dead)
    {
        switch(event.key){
            case 'd':
                keys.d.pressed = true
                player.lastkey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastkey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
        }
    }
    if (!enemy.dead)
    {
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastkey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastkey = 'ArrowLeft'
                break
            case 'ArrowUp':      
                if(jumps === 1){
                enemy.velocity.y = -20
                console.log(enemy.velocity.y)
                break
                }

        } 

    }
})
if(enemy.velocity.y == 20) jumps = 0
if(enemy.velocity.y <= 0){
    jumps = 1
}
window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            player.attack()
            break
        case ' ':
            player.attack()
            break
    }
        switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.w.pressed = false
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})