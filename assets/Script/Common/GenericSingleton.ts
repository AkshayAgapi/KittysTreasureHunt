const {ccclass, property} = cc._decorator;

@ccclass
export abstract class GenericSingleton<T> extends cc.Component {

    @property
    private destroryOnLoad = true;

    private static _instances: Map<string, cc.Component> = new Map();

    public static Instance<T extends cc.Component>(this: new () => T): T {
        let className = cc.js.getClassName(this);
        // let className = this.prototype.constructor.name;

        if (!GenericSingleton._instances[className]) {
            let newNode = new cc.Node(className);
            let newComponent = newNode.addComponent(this);
            GenericSingleton._instances[className] = newComponent;
            console.log("Generic Singleton new " + className);
        }
 
        return GenericSingleton._instances[className] as T;
    }

    public static IsExist<T extends cc.Component>(this: new () => T): boolean {
        return GenericSingleton._instances.hasOwnProperty(this.prototype.constructor.name);
    }

    protected onLoad(): void {
        let className = cc.js.getClassName(this);

        if(GenericSingleton._instances[className] && this.destroryOnLoad)
        {
            let existingInstance = GenericSingleton._instances[className];
            if(existingInstance && existingInstance.node)
            {
                GenericSingleton._instances.delete(className);
                existingInstance.node.destroy();
            }
            
        }

        if (GenericSingleton._instances[className] && GenericSingleton._instances[className] !== this && !this.destroryOnLoad) {
            
            this.node.destroy();
            return;
        }

        GenericSingleton._instances[className] = this;
    }
}