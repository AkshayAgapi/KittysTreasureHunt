const { ccclass, property } = cc._decorator;

@ccclass
export abstract class ScreenBase extends cc.Component {

    public onShow(params?: any[]): void {
        this.node.active = true;
        this.setupPopup(params);
    }

    protected abstract setupPopup(params?: any[]): void;

    public onHide(): void {
        this.node.active = false; 
    }
}