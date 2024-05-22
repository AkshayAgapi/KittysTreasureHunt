const { ccclass, property } = cc._decorator;

import OrientationManager from '../LoadScene/OrientationManager';
import Cat from './Cat';
import GameEvents, { GameEventNames } from './Common/GameEvents';
import LevelManager from './LevelManager';
import MainMenuScreen from './MainMenuScreen';
import AudioManager, { SoundClipType } from './Manager/AudioManager';
import ScreenManager from './Manager/ScreenManager';
import GameOverScreen from './Screen/GameOverScreen';
import GamePlayScreen from './Screen/GamePlayScreen';

@ccclass
export default class GameController extends cc.Component {
    @property(cc.Node)
    cat: cc.Node = null;

    @property(cc.Node)
    fallingItemParent: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property([cc.SpriteFrame])
    itemSequence: cc.SpriteFrame[] = [];

    @property(cc.Node)
    sequenceDisplay: cc.Node = null; // Node to display the sequence

    @property(LevelManager)
    levelManager: LevelManager = null;

    @property
    spawnInterval: number = 1;

    @property(cc.Node)
    tutorialNode: cc.Node = null; // Tutorial node

    @property
    minX: number = -300; // Set the minimum x boundary for item instantiation

    @property
    maxX: number = 300; // Set the maximum x boundary for item instantiation

    minFallDuration: number = 3; // Minimum fall duration
    maxFallDuration: number = 7; // Maximum fall duration

    private displaySequenceList: cc.SpriteFrame[] = [];
    private sequenceIndex: number = 0;
    private isGameOver: boolean = false;
    private currentTween: cc.Tween = null;
    private currentItem: cc.Node = null;
    private tutorialShown: boolean = false; // Track if the tutorial has been shown

    onLoad() {
        GameEvents.on(GameEventNames.GameStart, this.onGameStart);
        OrientationManager.changeOrientation(1);
    }

    protected start(): void {
        ScreenManager.Instance().showScreen(MainMenuScreen);
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameStart, this.onGameStart);
    }

    update(dt: number) {
        this.checkCollision();
    }

    private onGameStart = () => {
        AudioManager.Instance().playBGM(SoundClipType.GAMEPLAY_BGM);
        this.clearFallingItems();
        this.cat.setPosition(0, -162.722);
        this.isGameOver = false;
        ScreenManager.Instance().showScreen(GamePlayScreen);
        this.unschedule(this.spawnItem);
        this.schedule(this.spawnItem, this.spawnInterval);
        this.sequenceIndex = 0; // Reset sequenceIndex
        this.displaySequence();
        this.cat.active = true;
        this.highlightCurrentSequenceItem();

         // Show the tutorial after 2 seconds
         if (!this.tutorialShown) {
            this.tutorialShown = true;
            this.scheduleOnce(() => {
                this.showTutorial();
            }, 2);
        }
    };

    spawnItem() {
        if (this.isGameOver) return;

        let item = cc.instantiate(this.itemPrefab);
        item.getComponent(cc.Sprite).spriteFrame = this.getRandomItem();

        let randomX = this.minX + Math.random() * (this.maxX - this.minX);
        item.setPosition(cc.v2(randomX, this.node.height / 2));
        item.name = "item";  // Give the item a name to identify it in the collision check
        this.fallingItemParent.addChild(item);

        // Generate a random fall duration
        let randomFallDuration = this.minFallDuration + Math.random() * (this.maxFallDuration - this.minFallDuration);

        let fallAction = cc.moveTo(randomFallDuration, cc.v2(randomX, -this.node.height / 2));
        let destroyItem = cc.callFunc(() => {
            item.destroy();
        });

        item.runAction(cc.sequence(fallAction, destroyItem));
    }

    private showTutorial() {
        this.tutorialNode.active = true; // Show the tutorial node
        this.tutorialNode.once(cc.Node.EventType.TOUCH_END, this.hideTutorial, this);
   
        cc.director.pause();   
        cc.director.getScheduler().pauseTarget(this); // Pause all scheduled actions in this component
    }

    private hideTutorial() {
        this.tutorialNode.active = false; // Hide the tutorial node
        cc.director.resume();
        cc.director.getScheduler().resumeTarget(this); // Resume all scheduled actions in this component
    }


    checkCollision() {
        let catBox = this.cat.getBoundingBoxToWorld();

        this.fallingItemParent.children.forEach((child) => {
            if (child.name === "item") {
                let itemBox = child.getBoundingBoxToWorld();
                if (catBox.intersects(itemBox)) {
                    child.destroy();
                    if (this.checkSequence(child)) {
                        AudioManager.Instance().playSfx(SoundClipType.COLLECT_SFX);
                        this.resetCurrentSequenceItemScale();
                        this.sequenceIndex++;
                        if (this.sequenceIndex >= this.displaySequenceList.length) {
                            this.sequenceIndex = 0; // Restart the sequence
                            this.levelUp();
                            this.displaySequence();
                            this.gameOver(false);
                        } else {
                            this.highlightCurrentSequenceItem();
                        }
                    } else {
                        this.gameOver(true);
                    }
                }
            }
        });
    }

    checkSequence(item: cc.Node): boolean {
        let itemSpriteFrame = item.getComponent(cc.Sprite).spriteFrame;
        return itemSpriteFrame === this.displaySequenceList[this.sequenceIndex];
    }

    displaySequence() {
        this.sequenceDisplay.removeAllChildren();
        const numberOfItems = this.levelManager.getNumberOfItems();
        this.displaySequenceList = this.getRandomSequence(numberOfItems);

        this.displaySequenceList.forEach((spriteFrame) => {
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            this.sequenceDisplay.addChild(item);
        });

        this.highlightCurrentSequenceItem(); // Highlight the first item initially
    }

    highlightCurrentSequenceItem() {
        this.resetCurrentSequenceItemScale(); // Reset the previous item scale before highlighting the new one

        if (this.sequenceIndex < this.displaySequenceList.length) {
            this.currentItem = this.sequenceDisplay.children[this.sequenceIndex];
            this.currentTween = cc.tween(this.currentItem)
                .repeatForever(
                    cc.tween()
                        .to(0.5, { scale: 1.2 })
                        .to(0.5, { scale: 1 })
                )
                .start();
        }
    }

    resetCurrentSequenceItemScale() {
        if (this.currentItem) {
            if (this.currentTween) {
                this.currentTween.stop(); // Stop the current tween for the item
                this.currentTween = null; // Clear the reference
            }
            this.currentItem.scale = 1; // Reset scale to default
            this.currentItem = null; // Clear the reference to the current item
        }
    }

    clearFallingItems() {
        this.fallingItemParent.removeAllChildren(); // Remove all children from fallingItemParent
    }

    getRandomItem(): cc.SpriteFrame {
        const randomIndex = Math.floor(Math.random() * this.itemSequence.length);
        return this.itemSequence[randomIndex];
    }

    getRandomSequence(length: number): cc.SpriteFrame[] {
        const shuffled = this.itemSequence.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, length);
    }

    levelUp() {
        this.levelManager.levelUp();
        this.sequenceIndex = 0;
        cc.log("Level Up! Current Level: " + this.levelManager.getCurrentLevel());
    }

    gameOver(isLost: boolean) {
        let catScript = this.cat.getComponent(Cat);
        if (catScript) {
            catScript.stopMove();  
        }
        ScreenManager.Instance().hideScreen(GamePlayScreen);
        this.cat.active = false;
        this.isGameOver = true;
        GameEvents.dispatchEvent(GameEventNames.GameEnd);
        ScreenManager.Instance().showScreen(GameOverScreen, [isLost]);
    }
}
