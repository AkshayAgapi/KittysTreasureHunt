import { ScreenBase } from "../Base/ScreenBase";
import { GenericSingleton } from "../Common/GenericSingleton";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupManager extends GenericSingleton<PopupManager> {

    @property([ScreenBase])
    popupPrefabs: ScreenBase[] = [];

    private _popups: Map<string, ScreenBase> = new Map();

    protected onLoad() {
        super.onLoad();
        this.registerAllScreen();
    }

    private registerAllScreen() {
        this.popupPrefabs.forEach(prefab => {
            this._popups.set(prefab.name, prefab);
            prefab.node.active = false;
        });
    }

    public showScreen<T extends ScreenBase>(ctor: { new(): T }, params?: any[]): void {
        const screen = this.getScreenByConstructor(ctor);
        if (screen) {
            this._popups.forEach(p => {
                if (p !== screen) {
                    p.onHide();
                }
            });
            screen.onShow(params);
        } else {
            console.warn(`PopupManager: Popup not found.`);
        }
    }

    public hideScreen<T extends ScreenBase>(ctor: { new(): T }): void {
        const popup = this.getScreenByConstructor(ctor);
        if (popup) {
            popup.onHide();
        } else {
            console.warn(`PopupManager: Popup not found.`);
        }
    }

    private getScreenByConstructor<T extends ScreenBase>(ctor: { new(): T }): ScreenBase | undefined {
        for (let [key, popup] of this._popups) {
            if (popup instanceof ctor) {
                return popup;
            }
        }
        return undefined;
    }
}
