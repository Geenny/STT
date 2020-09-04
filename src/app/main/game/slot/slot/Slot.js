import GameAbstract from "../../GameAbstract";
import SlotEvent from "./events/SlotEvent";
import SlotState from "./states/SlotState";
import SlotView from "./SlotView";
import { Point, Ticker, Graphics, Container } from "pixi.js";
import Reels from "../reels/Reels";
import { Tween, Ease } from "@createjs/tweenjs";
import { SLOT_CONFIG_DEFAULT, LINE_TYPE_DEFAULT } from "../../../../../config/CONFIG";


export default class Slot extends GameAbstract {

    constructor( application, CONFIG = SLOT_CONFIG_DEFAULT ) {

        super( application );

        this.CONFIG = CONFIG;

    }


    // GET / SET
    get stage() { return this.application.stage; }

    get position() { return this._position; }

    get lineType() { return this._lineType || LINE_TYPE_DEFAULT }
    get lines() { return this._lines; }
    get lineLength() { return this.lines.line.length; }

    get slotConfig() { return this.CONFIG.config; }
    get symbolsConfig() { return this.CONFIG.symbols; }
    get symbolWidth() { return this.slotConfig.symbol.size.x; }
    get symbolHeight() { return this.slotConfig.symbol.size.y; }
    get symbolBorderWidth() { return this.slotConfig.symbol.border.x; }
    get symbolBorderHeight() { return this.slotConfig.symbol.border.y; }

    get reels() { return this._reels; }
    get reelsSizes() { return this.slotConfig.reels.sizes; }
    get reelsSpeed() { return this.slotConfig.reels.speed; }
    get reelsTime() { return this.slotConfig.reels.time; }

    get size() { return this._size || new Point(); }
    set size( value ) { this._size = value; }

    get state() { return this._state || SlotState.INIT; }
    set state( value ) {
        if ( !value ) return;
        this._state = value;
        this.dispatchEvent( new SlotEvent( SlotEvent.STATE_CHANGE, this, { state: value } ) );
    }



    //
    // RESIZE
    //
    resize( size ) {
        this.size = size;
        this.slotResize();
    }
    slotResize() {
        const { size } = this;
        
        this.view.x = size.x * 0.5 - this.slotWidth * 0.5;
        this.view.y = size.y * 0.4 - this.slotHeight * 0.5;
    }



    //
    // INIT
    //
    init() {
        super.init();
        this._initSubscribe();
        this._initSlotConfig();
        this._initSlotVars();
        this._initSlot();
        this._spinInit();
        this._initParticlesContainer();

        this._state = SlotState.IDLE;

        // this.spin();
    }

    _initSlotVars() {
        this._position = 0;
        this._lines = this._linesCreate();
    }

    _initSlotConfig() {
        const { config = {} } = this.CONFIG;
        this._lineType = config.lineType;
    }

    _initSlot() {
        this._initSlotView();
        this._initReels();
        this._initSlotSize();
    }

    _initReels() {
        this._reels = this._reelsCreate();
        this.view.addChild( this.reels.view );
    }

    _initSlotView() {
        this.view = new SlotView();
        this.stage.addChild( this.view );
    }

    _initSlotSize() {
        const symbolWidth = this.symbolWidth + this.symbolBorderWidth + this.symbolBorderWidth;
        const symbolHeight = this.symbolWidth + this.symbolBorderWidth + this.symbolBorderWidth;

        this.slotWidth = symbolWidth * this.reelsSizes.length;
        this.slotHeight = symbolHeight * this.reelsSizes[ 0 ];
    }

    _initParticlesContainer() {
        this.particlesContainer = new Container();
        this.stage.addChild( this.particlesContainer );
    }



    //
    // SUBSCRIBE LISTENERS
    //
    subscribe() {
        super.subscribe();
        this.application.addEventListener( SlotEvent.SPIN_REQUEST, this.spin, this );
        this.addEventListener( SlotEvent.STATE_CHANGE, this.onStateChange, this );
    }
    unsubscribe() {
        super.unsubscribe();
        this.application.removeEventListener( SlotEvent.SPIN_REQUEST, this.spin );
        this.removeEventListener( SlotEvent.STATE_CHANGE, this.onStateChange );
    }

    onStateChange( event ) {
        switch( this.state ) {
            case SlotState.WIN:
                this.randomParticlesShow();
                break;
        }
    }



    //
    // LINES
    //

    lineTypeSet( lineType = LINE_TYPE_DEFAULT ) {
        if ( !this.lineTypeAvailable( lineType ) ) return;
        this._lineType = lineType;
        this.reelsUpdate();
        this.dispatchEvent( new SlotEvent( SlotEvent.LINE_TYPE_CHANGE, this, { lineType: this.lineType } ) );
    }

    lineByTypeGet( lineType = LINE_TYPE_DEFAULT ) {
        for( let i = 0; i < this.CONFIG.lines.length; i++ ) {
            const lineData = this.CONFIG.lines[ i ];
            if ( lineData.type === lineType )
                return lineData;
        }
        return null;
    }

    lineTypeAvailable( lineType ) {
        return !!this.lineByTypeGet( lineType );
    }

    _linesCreate() {
        return this.lineByTypeGet( this.lineType );
    }


    //
    // REELS
    //
    reelsUpdate() {
        if ( !this.reels ) return;
        this.reels.update( this.lines );
    }

    _reelsCreate() {
        const reels = new Reels();
        reels.init( this );
        return reels;
    }

    _reelsSpinTick() {
        this.reels.spinTick();
    }



    //
    // PLAY
    //
    spin() {
        this._spinStart();
    }
    _spinInit() {
        this.ticker = Ticker.shared;
    }
    _spinStart() {
        if ( this.state != SlotState.IDLE ) return;
        this.state = SlotState.START;
        this._spinTimerStart();
    }
    _spinStop() {
        this._spinTimerReset();
    }
    _spinTimerStart() {
        this._spinTimerReset();
        this._spinTimeStart = Date.now();
        this.ticker.add( this._spinTick, this );
    }
    _spinTick() {
        this.tickTime = Date.now();
        this._spinSpeedIncrease();
        this._positionIncrease();
        this._positionBounce();
        this._reelsSpinTick();
    }
    _spinTimerReset() {
        this.ticker.remove( this._spinTick, this );
        this.spinCurrentSpeed = 0;
        this.spinStopPosition = -1;
        this._spinTimeStart = 0;
        this.tickTime = 0;
    }
    _spinSpeedIncrease() {
        if ( this._state != SlotState.START ) return;
        if ( Math.round( this.spinCurrentSpeed ) === this.reelsSpeed ) {
            this.spinCurrentSpeed = this.reelsSpeed;
            this.state = SlotState.SPIN;
        } else {
            this.spinCurrentSpeed = this.spinCurrentSpeed + ( this.reelsSpeed - this.spinCurrentSpeed ) * 0.5;
        }
    }


    //
    // POSITION
    //
    _positionIncrease() {
        if ( this._state != SlotState.START && this._state != SlotState.SPIN ) return;
        this._position += this.spinCurrentSpeed * 0.001;
        if ( this._position >= this.lineLength ) this._position = this._position % this.lineLength;

        if ( this.tickTime - this.reelsTime > this._spinTimeStart &&
            Math.round( ( this._position * 10 ) % 10 ) === 2 )
            this.state = SlotState.STOP;
    }
    _positionBounce() {
        if ( this._state != SlotState.STOP ) return;
        
        const positionTarget = Math.floor( this._position );
        this._position = this._position + ( positionTarget - this._position ) * 0.1;

        if ( Math.round( this._position * 1000 ) === positionTarget * 1000 ) {
            this._position = positionTarget;
            this.state = SlotState.WIN;
            this._spinStop();
        }
    }



    //
    // WINLINES
    // 
    winLineShow() {
        if ( this.state != SlotState.WIN ) return;
    }



    //
    // RANDOM PARTICLES
    //
    randomParticlesShow() {

        this.particlesContainer.removeChildren();
        const positions = this._particleRandomPositionsGet();
        this._particleSetInterval( positions );

    }

    _particleRandomPositionsGet() {
        
        const { view, symbolWidth, symbolHeight } = this;
        const positions = [];

        for ( let i = 0; i < this.reelsSizes[ 0 ]; i++ ) {
            if ( Math.random() > 0.5 ) continue;
            const position = new Point( view.x + symbolWidth * 0.5, view.y + symbolHeight * 0.5 + symbolHeight * i );
            positions.push( position );
        }

        return positions;
    }

    _particleSetInterval( positions ) {
        this._particleClearInterval();
        this.particleIntervalIndex = setInterval( () => {
            if ( positions.length > 0 ) {
                const position = positions.shift();
                this._particleShow( position );
            } else {
                this._particleClearInterval();
                this.state = SlotState.IDLE;
            }
        }, 300 );
    }

    _particleClearInterval() {
        clearInterval( this.particleIntervalIndex );
    }

    _particleShow( position ) {

        const particleContainer = new Container();
        particleContainer.position = position;
        this.particlesContainer.addChild( particleContainer );

        for ( let i = 0; i < 50; i++ ) {
            const particle = this._particleCreate();
            particleContainer.addChild( particle );

            const direction = new Point();
            direction.x = Math.sin( Math.random() * Math.PI * 2 );
            direction.y = Math.cos( Math.random() * Math.PI * 2 );
            
            const distanceFrom = 20 + Math.random() * 20;
            const distanceTo = 100 + Math.random() * 100;
            const from = new Point( direction.x * distanceFrom, direction.y * distanceFrom );
            const to = new Point( direction.x * distanceTo, direction.y * distanceTo );
            const gravity = 200 + Math.random() * 100;
            const wait = 0 + Math.floor( Math.random() * 20 );

            particle.alpha = 0;
            particle.position.set( from.x, from.y );

            Tween.get( particle.position )
                .wait( wait )
                .to( { x: to.x, y: to.y }, 400, Ease.getPowOut( 6 ) )
                .to( { y: to.y + gravity }, 1000, Ease.cubicIn );

            Tween.get( particle )
                .to( { alpha: 1 }, 100, Ease.cubicIn )
                .wait( 1000 )
                .to( { alpha: 0 }, 200, Ease.cubicOut );
        }
    }
    _particleCreate() {
        const color = Math.floor( Math.random() * 0xFFFFFF );
        const graphics = new Graphics();
        graphics.beginFill( color, 1 );
        graphics.drawCircle( 0, 0, 5 * Math.floor( Math.random() * 3 ) );
        graphics.endFill();
        return graphics;
    }
}