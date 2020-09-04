import { Container, Graphics } from "pixi.js";

export default class Reel extends Container {

    constructor() {

        super();

        this._construct();

    }

    _construct() {
        const container = new Container();
        const mask = new Graphics();

        container.mask = mask;

        this.addChild( container );
        this.addChild( mask );

        this.reelContainer = container;
        this.reelMask = mask;
    }

    reelMaskSizeUpdate( size ) {
        this.reelMask.clear();
        this.reelMask.beginFill( 0xFF3300, 0.2 );
        this.reelMask.drawRect( 0, 0, size.x, size.y );
        this.reelMask.endFill();
    }

}