class Sprite{
    constructor({position, imagesrc, scale = 1, framesmax = 1, offset = {x: 0, y:0}}){
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imagesrc
        this.scale = scale
        this.framesmax = framesmax
        this.framecurrent = 0
        this.frameelapsed = 0
        this.frameshold = 5
        this.offset = offset
    }
    draw(){
        c.drawImage(
             this.image,
             this.framecurrent * (this.image.width / this.framesmax),
             0,
             this.image.width/this.framesmax,
             this.image.height,
             this.position.x - this.offset.x,
             this.position.y - this.offset.y,
             this.image.width/this.framesmax*this.scale,
             this.image.height*this.scale)
    }

    animateframe(){
        this.frameelapsed++
        if(this.frameelapsed % this.frameshold === 0){
            if(this.framecurrent < this.framesmax - 1){
                this.framecurrent++   
            } else{
                this.framecurrent = 0
            }
        }
    }

    update(){
        this.draw()
        this.animateframe()
    }
}

class Fighter extends Sprite{
    constructor({position,velocity,color='red',imagesrc, scale = 1, framesmax = 1, offset = {x: 0, y:0}, sprites, attackbox = { offset: {}, width: undefined, height:undefined }}){
        super({
            position,
            imagesrc,
            scale,
            framesmax,
            offset
        })
        
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastkey
        this.attackbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset : attackbox.offset,
            width: attackbox.width,
            height: attackbox.height
        }
        this.color = color
        this.isattacking
        this.health = 100
        this.framecurrent = 0
        this.frameelapsed = 0
        this.frameshold = 5
        this.sprites = sprites
        this.dead = false

        for (const Sprite in this.sprites){
            sprites[Sprite].image = new Image()
            sprites[Sprite].image.src = sprites[Sprite].imagesrc
        }
        
    }

    update(){
        this.draw()
        if(!this.dead) this.animateframe()

        this.attackbox.position.x = this.position.x + this.attackbox.offset.x
        this.attackbox.position.y = this.position.y + this.attackbox.offset.y

        //c.fillRect(this.attackbox.position.x, this.attackbox.position.y,this.attackbox.width,this.attackbox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 90){
            this.velocity.y = 0
            jumps = 1
            this.position.y = 336
        }
        else this.velocity.y += gravity
    
    }
    

    attack(){
        this.switchsprite('attack1')
        this.isattacking = true

    }

    TAKEHIT(){
        if(this.health <= 0){
            this.switchsprite('death')
        }else this.switchsprite('takehit')
    }

    switchsprite(sprite){
        //death animation
        if(this.image === this.sprites.death.image){
            if(this.framecurrent === this.sprites.death.framesmax - 1) this.dead = true
            return   
        } 

        //overwriting all animations with attack
        if(this.image === this.sprites.attack1.image && this.framecurrent < this.sprites.attack1.framesmax - 1) return

        //when fighter gets hit
        if(this.image === this.sprites.takehit.image && this.framecurrent < this.sprites.takehit.framesmax - 1) return

        switch (sprite){
            case 'idle':
                if (this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesmax = this.sprites.idle.framesmax
                    this.framecurrent = 0
                }
                break
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.framesmax = this.sprites.run.framesmax
                    this.framecurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                this.image = this.sprites.jump.image
                this.framesmax = this.sprites.jump.framesmax
                this.framecurrent = 0
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                this.image = this.sprites.fall.image
                this.framesmax = this.sprites.fall.framesmax
                this.framecurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image){
                this.image = this.sprites.attack1.image
                this.framesmax = this.sprites.attack1.framesmax
                this.framecurrent = 0
                }
                break
            case 'takehit':
                if (this.image !== this.sprites.takehit.image){
                this.image = this.sprites.takehit.image
                this.framesmax = this.sprites.takehit.framesmax
                this.framecurrent = 0
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image){
                this.image = this.sprites.death.image
                this.framesmax = this.sprites.death.framesmax
                this.framecurrent = 0
                }
                break
        }
    }
}