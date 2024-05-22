import { GenericSingleton } from "../Common/GenericSingleton";

const {ccclass, property} = cc._decorator;

export enum SoundClipType {
    GAMEPLAY_BGM,
    COLLECT_SFX,
    VICTORY_SFX,
    FAILURE_SFX,
}

@ccclass
export default class AudioManager extends GenericSingleton<AudioManager>{

    _forceBGMDisable: boolean = false;

    @property(cc.AudioSource)
    sfxAudioSource: cc.AudioSource = null;

    @property(cc.AudioSource)
    bgmAudioSource: cc.AudioSource = null;

    @property({ type: cc.AudioClip })
    bgmAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    collectSfx: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    victorySfx: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    failureSfx: cc.AudioClip = null;

    private _isMuted: boolean = false;
    private _bgmEnabled: boolean = true;
    private _sfxEnabled: boolean = true;

    public toggleAudio() : Boolean {
        this._isMuted = !this._isMuted;
        this.toggleSfx();
        this.toggleBgm();
        return this._isMuted;
    }

    protected onLoad(): void {
        super.onLoad();
    }

    public playSfx(soundClipType: SoundClipType) {
        if (!this._sfxEnabled)
            return
        const sound = this.GetSoundClip(soundClipType);
        if (sound) {
            this.sfxAudioSource.clip = sound;
            this.sfxAudioSource.play(); //playOneShot(sound);
        } else {
            console.log('Sound clip not found: ' + SoundClipType[soundClipType]);
        }
    }

    public playBGM(soundClipType: SoundClipType) {
       if( this._forceBGMDisable ==true)
       {
            return;
       }
        const sound = this.GetSoundClip(soundClipType);
        if (sound ) {
            this.bgmAudioSource.clip = sound;
            if (this._bgmEnabled) {
            this.bgmAudioSource.play();
            }
        } else {
            console.log('Sound clip not found: ' + SoundClipType[soundClipType]);
        }
    }

    public stopBGM()
    {
        this.bgmAudioSource.stop();
    }

    private GetSoundClip(clipType: SoundClipType): cc.AudioClip {
        switch (clipType) {

            case SoundClipType.GAMEPLAY_BGM:
                return this.bgmAudio;

            case SoundClipType.COLLECT_SFX:
                return this.collectSfx;

            case SoundClipType.VICTORY_SFX:
                return this.victorySfx;

            case SoundClipType.FAILURE_SFX:
                return this.failureSfx;
        }
    }

    public toggleBgm() {
        if( this._forceBGMDisable ==true)
        {
            return;
        }
        this._bgmEnabled = !this._bgmEnabled;
        if (this._bgmEnabled) {
            this.bgmAudioSource.play();
        } else {
            this.bgmAudioSource.pause();
        }
    }

    public toggleSfx() {
        this._sfxEnabled = !this._sfxEnabled;
    }


    public disablGameBGM(){
        this._forceBGMDisable = true;
        this.bgmAudioSource.stop();
        this.bgmAudioSource.enabled = false;
    }

    public pauseAllSounds(){
        this.sfxAudioSource.pause();
        this.bgmAudioSource.pause();
    }

    public resumeAllSounds()
    {
        if(this._sfxEnabled){
            this.sfxAudioSource.resume();
        }

        if(this._bgmEnabled){
            this.bgmAudioSource.resume();
        }
    }
}
