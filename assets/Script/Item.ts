const { ccclass, property } = cc._decorator;

@ccclass
export default class Item extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    onLoad() {
        // Any item-specific initialization can go here
    }
}
