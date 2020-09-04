import { Sprite, Loader, Point, Texture } from "pixi.js";
import EventDispatcher from "../../../observer/EventDispatcher";
import SymbolView from "./SymbolView";
import ResourceLoader from "../../loader/ResourceLoader";

export default class Symbol extends EventDispatcher {

    constructor( CONFIG = {} ) {

        super();

        this.CONFIG = CONFIG;

        this._loadSymbol();

    }


    //
    // GET/SET
    //
    get ID() { return this.CONFIG.ID; }
    get position() { return this.CONFIG.position; }

    get name() { return this.CONFIG.name; }
 
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
        this._initSymbolView();
        this._loadSymbol();
    }

    _initSymbolView() {
        this.view = new SymbolView( Texture.EMPTY );
    }


    //
    // LOADER
    //
    _loadSymbol() {
        if ( !this.sourceLink ) return;

        ResourceLoader.load( this.sourceLink, texture => {
            this.texture = texture;
        } );
    }


}