import { ScreenBase } from "../Base/ScreenBase";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import MainMenuScreen from "../MainMenuScreen";
import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import ScreenManager from "../Manager/ScreenManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverScreen extends ScreenBase {

    @property(cc.Label)
    gameStatusLabel: cc.Label = null;

    @property(cc.Label)
    tapToContinueLabel: cc.Label = null;

    @property(cc.ParticleSystem)
    confettieParticle_l: cc.ParticleSystem = null;

    @property(cc.ParticleSystem)
    confettieParticle_r: cc.ParticleSystem = null;

    isLost: Boolean = false;

    protected start(): void {
        this.enableTapToContinue();
        this.node.on('touchstart', this.continueGame, this);
    }

    protected setupPopup(params?: any[]): void {
        if (params && params.length > 0 && params[0] != null && this.isBoolean(params[0])) {
            let isLost = Boolean(params[0]); 
            AudioManager.Instance().stopBGM();
            this.isLost = isLost;
            if (isLost) {
                this.gameStatusLabel.string = "Good Try !";
                AudioManager.Instance().playSfx(SoundClipType.FAILURE_SFX);
            } else {
                this.confettieParticle_l.resetSystem();
                this.confettieParticle_r.resetSystem();

                this.gameStatusLabel.string = "Congrats !";
                AudioManager.Instance().playSfx(SoundClipType.VICTORY_SFX);
            }
        }
    }
    
    private isBoolean(value: any): value is boolean {
        return typeof value === 'boolean';
    }

    enableTapToContinue() {

        // Scaling effect
        cc.tween(this.tapToContinueLabel.node)
            .repeatForever(
                cc.tween()
                    .to(0.8, { scale: 1.2 }, { easing: 'sineInOut' })
                    .to(0.8, { scale: 1 }, { easing: 'sineInOut' })
            )
            .start();
    }

    continueGame() {

        if(this.isLost){
            ScreenManager.Instance().showScreen(MainMenuScreen);
        }else{
            GameEvents.dispatchEvent(GameEventNames.GameStart);
        }
    }

    protected onDestroy(): void {
        this.node.off('touchstart', this.continueGame, this);
    }
}
