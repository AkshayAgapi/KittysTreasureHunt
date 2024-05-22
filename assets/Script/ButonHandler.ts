import Cat from "./Cat";

const { ccclass, property } = cc._decorator;

enum ButtonType {
    Left,
    Right
}

@ccclass
export default class ButtonHandler extends cc.Component {
    @property(cc.Node)
    cat: cc.Node = null;

    @property({
        type: cc.Enum(ButtonType)
    })
    buttonType: ButtonType = ButtonType.Left;

    @property(cc.Button)
    button: cc.Button = null;

    private catScript: Cat = null;

    onLoad() {
        this.catScript = this.cat.getComponent('Cat');

        if (this.button) {
            this.button.node.on('touchstart', this.onButtonPressed, this);
            this.button.node.on('touchend', this.onButtonReleased, this);
            this.button.node.on('touchcancel', this.onButtonReleased, this);
        }
    }

    onButtonPressed() {
        if (this.buttonType === ButtonType.Left) {
            this.catScript.moveLeft();
        } else if (this.buttonType === ButtonType.Right) {
            this.catScript.moveRight();
        }
    }

    onButtonReleased() {
        this.catScript.stopMove();
    }
}
