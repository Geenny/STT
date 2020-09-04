import { Sprite, Loader, Point, Texture } from "pixi.js";
import EventDispatcher from "../../../observer/EventDispatcher";
import SymbolView from "../../slot/symbol/SymbolView";
import ResourceLoader from "../../loader/ResourceLoader";

export default class Button extends EventDispatcher {

    constructor( CONFIG = {} ) {

        super();

        this.CONFIG = CONFIG;

    }


    //
    // GET/SET
    //
    get sourceLink() { return this.CONFIG.src; }

    get width() { return this.CONFIG.width; }
    get height() { return this.CONFIG.height; }
    get size() { return new Point( this.width, this.height ); }

    /**
     * Обновление текстуры @SymbolView
     */
    get texture() { return this.view.texture; }
    set texture( value ) {
        this.view.texture = value;
        this.view.width = this.width;
        this.view.height = this.height;
    }
    


    //
    // INIT
    //
    init() {
        this._initButtonView();
        this._loadButton();
    }

    _initButtonView() {
        this.view = new SymbolView( Texture.EMPTY );
        this.view.interactive = true;
        this.view.buttonMode = true;
    }


    //
    // LOADER
    //
    _loadButton() {

        if ( !this.sourceLink ) return;

        ResourceLoader.load( this.sourceLink, texture => {
            this.texture = texture;
        } );
    }


    //
    //
    //
    on( eventName, callback ) {
        this.view.on( eventName, callback );
    }


}