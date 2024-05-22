// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class OrientationManager {

    //4 all orientation
    //0, 2 portrait
    //1, 3 landscape
    static changeOrientation(value) {
        let isSupportOrientation = null;

        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_IOS) {                                
                if (jsb) {
                    isSupportOrientation = jsb.reflection.callStaticMethod("AppController", "isSupportOrientation");

                    try {
                        jsb.reflection.callStaticMethod("AppController", "rotateScreen:", value);
                    } catch (e) {
                        cc.log("changeOrientation e: " + JSON.stringify(e));
                    }
                }
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                if (jsb) {
                    try {
                        let className = "org/cocos2dx/javascript/AppActivity";
                        let methodName = "setOrientation";
                        let methodSignature = "(I)V";

                        if (jsb) {
                            isSupportOrientation = jsb.reflection.callStaticMethod(className, "isSupportOrientation", "()Z");
                            jsb.reflection.callStaticMethod(className, methodName, methodSignature, value);
                        }
                    } catch (e) {
                        cc.log("changeOrientation e: " + JSON.stringify(e));
                     }
                }
            }
        }

        cc.log("isSupportOrientation: " + isSupportOrientation);
        
        if (value == 0 || value == 2) {
            cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        } else if (value == 1 || value == 3) {
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        } else {
            cc.view.setOrientation(cc.macro.ORIENTATION_AUTO);
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
