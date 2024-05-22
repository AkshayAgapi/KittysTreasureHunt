const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelManager extends cc.Component {
    @property
    maxLevel: number = 10;

    @property
    baseFallDuration: number = 5; // Base fall duration

    private currentLevel: number = 1;

    getCurrentLevel(): number {
        return this.currentLevel;
    }

    levelUp() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
        }
    }

    public getNumberOfItems(): number {
        if (this.currentLevel == 1) {
            return 2;
        } else if (this.currentLevel >= 2 && this.currentLevel <= 4) {
            return 3;
        } else if (this.currentLevel >= 5 && this.currentLevel <= 7) {
            return 4;
        } else {
            return 5;
        }
    }

    public  getFallDuration(): number {
        return this.baseFallDuration - Math.floor((this.currentLevel - 1) / 3);
    }
}
