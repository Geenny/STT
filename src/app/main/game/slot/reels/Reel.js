import EventDispatcher from "../../../observer/EventDispatcher";
import ReelView from "./ReelView";
import { Point } from "pixi.js";
import Symbol from "../symbol/Symbol";

export default class Reel extends EventDispatcher {

    constructor( CONFIG ) {

        super();

        this.CONFIG  = CONFIG;

    }


    //
    // GET / SET
    //
    get ID() { return this.CONFIG.ID; }
    get line() { return this.CONFIG.line; }
    get lineType() { return this.line.type; }
    get lineSymbols() { return this.line.line; }
    get size() { return this.CONFIG.size; }
    get symbolConfig() { return this.CONFIG.symbol; }
    get symbolSize() { return this.symbolConfig.size; }
    get symbolBorder() { return this.symbolConfig.border; }
    get symbolsConfig() { return this.CONFIG.symbolsConfig; }



    //
    // INIT
    //
    init() {
        this._initReelVars();
        this._initReelView();
        this._initSymbolMap();
        this.viewUpdate();
    }

    _initReelVars() {
        this.position = 0;
        this.symbolList = [];
        this.symbolWidth = this.symbolSize.x + this.symbolBorder.x + this.symbolBorder.x;
        this.symbolHeight = this.symbolSize.x + this.symbolBorder.x + this.symbolBorder.x;
    }

    _initReelView() {
        this.view = new ReelView();

        const maskSize = new Point( this.symbolWidth, this.symbolHeight * this.size );
        this.view.reelMaskSizeUpdate( maskSize );
    }

    _initSymbolMap() {
        for ( let i = 0; i < this.lineSymbols.length; i++ ) {
            const ID = this.lineSymbols[ i ];
            const symbol = this._symbolCreate( ID, i );
            this.symbolList.push( symbol );
        }
    }


    //
    // 
    //
    positionSet( position, updateView = true ) {
        this.position = position;
        if ( updateView ) this.viewUpdate();
    }


    //
    // VIEW
    //
    viewUpdate() {
        const symbolsForView = this._symbolsForViewGet();
        for ( let i = 0; i < this.symbolList.length; i++ ) {
            const symbol = this.symbolList[ i ];
            this._symbolVisibilityCheck( symbol, symbolsForView );
            this._symbolPositionSet( symbol );
        }
    }

    _symbolVisibilityCheck( symbol, list ) {
        if ( list.indexOf( symbol ) >= 0 ) {
            if ( !symbol.view.parent )
                this.view.reelContainer.addChild( symbol.view );
        } else {
            if ( symbol.view.parent === this.view.reelContainer )
                this.view.reelContainer.removeChild( symbol.view );
        } 
    }

    _symbolCreate( ID, position ) {
        const symbolData = this._symbolDataByIDGet( ID );
        const SYMBOL_CONFIG = { ...symbolData, position, width: this.symbolSize.x, height: this.symbolSize.y };
        const symbol = new Symbol( SYMBOL_CONFIG );
        symbol.init();
        return symbol;
    }

    _symbolDataByIDGet( ID ) {
        for ( let i = 0; i < this.symbolsConfig.length; i++ ) {
            const symbolConfig = this.symbolsConfig[ i ];
            if ( symbolConfig.id === ID ) return symbolConfig;
        }
        return this.symbolsConfig[ 0 ];
    }

    _symbolsForViewGet() {
        const symbolList = []; 
        for ( let i = 0; i < this.size + 1; i++ ) {
            const index = i < 0 ? this.symbolList.length - i : i;
            const symbolPosition = Math.floor( ( this.position + index ) % this.symbolList.length );
            const symbol = this.symbolList[ symbolPosition ];
            symbolList.push( symbol );

            if ( !symbol ) debugger;
        }
        return symbolList;
    }

    _symbolPositionSet( symbol ) {
        if ( !symbol ) return;

        const positionOnReel = this.position - symbol.position > this.symbolList.length - this.size ? this.position - symbol.position - this.symbolList.length : this.position - symbol.position;
        const positionX = this.symbolBorder.x;
        const positionY = this.symbolBorder.y + this.symbolHeight * 2 + this.symbolHeight * positionOnReel;
        symbol.view.position.set( positionX, positionY );
    }

}