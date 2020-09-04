import EventDispatcher from "../../observer/EventDispatcher";
import ResizeEvent from "../../events/ResizeEvent";
import Button from "./button/Button";
import { BUTTON_CONFIG } from "../../../../config/CONFIG";
import { Container, Point } from "pixi.js";
import SlotEvent from "../slot/slot/events/SlotEvent";
import FPS from "./fps/FPS";

const POINTERUP = 'pointerup';
const POINTEROVER = 'pointerover';
const POINTEROUT = 'pointerout';

export default class UI extends EventDispatcher {

    constructor( application ) {

        super();

        this.application = application;

        this.init();

    }


    // GET/SET

    /**
     * @Stage pixi фреймворка
     */
    get stage() { return this.application.pixi.stage; }



    //
    // INIT
    //

    init() {
        this._initSubscribe();
        this._initUIView();
        this._initButton();
        this._initFPS();
    }

    _initSubscribe() {
        this.subscribe();
    }
    _initUIView() {
        const container = new Container();
        this.stage.addChild( container );

        this.container = container;
    }
    _initButton() {
        const button = new Button( BUTTON_CONFIG );
        button.init();

        button.on( POINTERUP, () => {
            this.application.dispatchEvent( new SlotEvent( SlotEvent.SPIN_REQUEST, null ) );
        } );
        button.on( POINTEROVER, () => {
            button.view.alpha = 0.9;
        } );
        button.on( POINTEROUT, () => {
            button.view.alpha = 1;
        } );

        this.container.addChild( button.view );

        this.spinButton = button;
    }
    _initFPS() {
        const fps = new FPS();
        fps.init();

        this.container.addChild( fps.view );

        this.fps = fps;
    }



    //
    // SUBSCRIBE LISTENERS
    //
    subscribe() {
        if ( this.isSubscribe ) return;
        this.isSubscribe  = true;
        this.application.addEventListener( ResizeEvent.CHANGE, this.onResize, this );
    }
    unsubscribe() {
        this.isSubscribe = false;
        this.application.removeEventListener( ResizeEvent.CHANGE, this.onResize );
    }
    onResize( event ) {
        const size = new Point( event.width, event.height );
        this.resize( size );
    }


    //
    // RESIZE
    //
    resize( size ) {
        this.size = size;
        this.buttonUpdate();
        this.fpsUpdate();
    }
    buttonUpdate() {
        if ( !this.spinButton ) return;
        this.spinButton.view.x = this.size.x * 0.5 - this.spinButton.width * 0.5;
        this.spinButton.view.y = this.size.y * 0.85 - this.spinButton.height * 0.5;
    }
    fpsUpdate() {
        if ( !this.fps ) return;
        this.fps.view.x = this.size.x * 0.5;
        this.fps.view.y = this.size.y * 0.05;
    }

}