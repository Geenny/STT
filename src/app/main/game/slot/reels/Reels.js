import EventDispatcher from "../../../observer/EventDispatcher";
import ReelsView from "./ReelsView";
import Reel from "./Reel";

export default class Reels extends EventDispatcher {


    //
    // GET / SET
    //
    get lines() { return this.slot.lines; }
    get position() { return this.slot.position; }
    get reelsSizes() { return this.slot.reelsSizes; }
    get reelsSpeed() { return this.slot.reelsSpeed; }
    get slotConfig() { return this.slot.slotConfig; }
    get symbolsConfig() { return this.slot.symbolsConfig; }


    //
    // INIT
    //
    init( slot ) {
        if ( !slot ) return;
        this._initSlot( slot );
        this._initReelsVars();
        this._initReels();
    }

    _initSlot( slot ) {
        this.slot = slot;
    }

    _initReelsVars() {
        this._reels = [];
    }

    _initReels() {
        this._initReelsView();
        this._reelsCreate();
    }

    _initReelsView() {
        this.view = new ReelsView();
    }



    //
    // REELS
    //

    _reelsCreate() {
        for ( let i = 0; i < this.reelsSizes.length; i++ ) {
            const REEL_CONFIG = this._reelConfigGet( i );
            const reel = this._reelCreate( REEL_CONFIG );
            reel.init();
            this._reelAddToList( reel );
            this._reelAddToContainer( reel );
        }
    }

    _reelLineByIDGet( ID ) {
        const defaultLine = Array.isArray( this.lines ) ? this.lines[ 0 ] : this.lines;
        const line = Array.isArray( this.lines ) ? this.lines[ ID ] : this.lines;
        return line || defaultLine;
    }

    _reelConfigGet( ID ) {
        const size = this.reelsSizes[ ID ];
        const line = this._reelLineByIDGet( ID );

        return { ...this.slotConfig, symbolsConfig: this.symbolsConfig, ID, line, size };
    }

    _reelAddToList( reel ) {
        this._reels.push( reel );
    }

    _reelAddToContainer( reel ) {
        this.view.addChild( reel.view );
    }

    _reelCreate( reelConfig ) {
        return new Reel( reelConfig );
    }



    //
    // SPIN
    // 
    spinTick() {
        for ( let i = 0; i < this._reels.length; i++ ) {
            const reel = this._reels[ i ];
            reel.positionSet( this.position );
        }
    }
}