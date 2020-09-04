import { Sprite } from "pixi.js";

export default class SymbolView extends Sprite { 

    resize( size ) {
        if ( !size || !size.x || !size.y ) return;
        this.width = size.x;
        this.height = size.y;
    }

}