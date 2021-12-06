import Game from "../game.class.js";
import MovableObject from "../movable-object.class.js";

export default class Pufferfish extends MovableObject {

    name = 'bubble'
    height = 90
    width = 90
    speed = 2

    hitboxRight = 20
    hitboxLeft = 20
    hitboxTop = 20
    hitboxBottom = 20
    
    poisonBubble = false

    /**
     * constructor
     */
    constructor(index) {
        super();

        this.game = new Game()

        this.character = this.game.world.level.character
        this.left = this.character.drawReverse
        this.index = index

        this.loadBubble()
        this.setPosition()
        this.move()
        this.collisionCheck()

        this.selfDestructionTimeout = setTimeout(() => {
            this.selfDestruct()
        }, 4000)
    };

    loadBubble() {
        if(this.character.poisonBubbles) {
            this.img = this.game.poisonBubble
            this.poisonBubble = true
        } else {
            this.img = this.game.bubble
        }
    }

    setPosition() {
        if(this.character.drawReverse) {
            this.x = this.character.x  + 50
            this.y = this.character.y  + this.character.height / 2 + 20
        } else {
            this.x = this.character.x + this.character.width - 130
            this.y = this.character.y  + this.character.height / 2 + 20
        }
    }

    move() {
        if(this.left) {
            gsap.to(this, { duration: 4, x: this.x - 2100})
        } else {
            gsap.to(this, { duration: 4, x: this.x + 2100})
        }
    }

    collisionCheck() {
        this.collisionInterval = setInterval(() => {
            this.game.world.level.enemies.forEach(enemy => {
                this.checkCollisionsWith(enemy)
            })
            this.game.world.level.barriers.forEach(barrier => {
                this.checkCollisionsWith(barrier)
            })
            this.checkCollisionsWith(this.game.world.level.boss)
        }, 50)
    }

    checkCollisionsWith(object) {
        if(this.isCollidingWith(object)) {
            if(object.name == 'jellyfish' || object.name == 'pufferfish' || object.name == 'barrier' || object.name == 'boss') {
                this.selfDestruct()
            }
            if(object.name == 'jellyfish' && object.type == 'regular' && !object.isDead) {
                object.die()
            } 
            if(object.name == 'boss' && this.poisonBubble) {
                object.takeDmg()
            }
        }
    }

    selfDestruct() {
        this.game.world.bubbles.splice( this.game.world.bubbles.indexOf(this), 1)
        clearInterval(this.collisionInterval)
        clearTimeout(this.selfDestructionTimeout)
    }
};