const { ccclass, property } = cc._decorator;

@ccclass
export default class Cat extends cc.Component {

    speed: number = 400;
    minX: number = -400; // Set the minimum x boundary
    maxX: number = 400; // Set the maximum x boundary

    private direction: number = 0;

    onLoad() {
        this.direction = 0;
    }

    update(dt: number) {
        this.node.x += this.direction * this.speed * dt;

        // Boundary check
        if (this.node.x < this.minX) {
            this.node.x = this.minX;
        } else if (this.node.x > this.maxX) {
            this.node.x = this.maxX;
        }
    }

    moveLeft() {
        this.direction = -1;
    }

    moveRight() {
        this.direction = 1;
    }

    stopMove() {
        this.direction = 0;
    }
}
