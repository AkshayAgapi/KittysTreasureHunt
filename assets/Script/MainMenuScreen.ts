import { ScreenBase } from "./Base/ScreenBase";
import GameEvents, { GameEventNames } from "./Common/GameEvents";
import AudioManager, { SoundClipType } from "./Manager/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMenuScreen extends ScreenBase {

    @property(cc.Node)
    titleImage: cc.Node = null;

    @property(cc.Label)
    tapToContinueLabel: cc.Label = null;

    onLoad() {
        this.tapToContinueLabel.node.active = false; // Initially disable the "Tap to continue" label
        this.showTitle();
    }

    protected setupPopup(params?: any[]): void {
    }

    showTitle() {
        // Show title for 2 seconds, then scale down and move to the top
        cc.tween(this.titleImage)
            .delay(1.5)
            .to(1, { scale: 0.7, position: cc.v3(0, this.node.height / 2 - 200, 0) }, { easing: 'sineInOut' })
            .call(() => {
                this.enableTapToContinue();
            })
            .start();
    }

    enableTapToContinue() {
        this.tapToContinueLabel.node.active = true;
        this.tapToContinueLabel.node.opacity = 255;
        this.tapToContinueLabel.node.scale = 1;

        // Scaling effect
        cc.tween(this.tapToContinueLabel.node)
            .repeatForever(
                cc.tween()
                    .to(0.8, { scale: 1.2 }, { easing: 'sineInOut' })
                    .to(0.8, { scale: 1 }, { easing: 'sineInOut' })
            )
            .start();

        // Add touch event listener to start the game
        this.node.on('touchstart', this.startGame, this);
    }

    startGame() {
        cc.log("Game Started");
        GameEvents.dispatchEvent(GameEventNames.GameStart);
    }

    protected onDestroy(): void {
        this.node.off('touchstart', this.startGame, this);
    }
}
