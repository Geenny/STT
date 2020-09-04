import EventDispatcher from "../observer/EventDispatcher";
import ResizeEvent from "../events/ResizeEvent";
import { Point } from "pixi.js";

export default class GameAbstract extends EventDispatcher {

    constructor( application ) {

        super();

        this.application = application;

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
    }

    _initSubscribe() {
        this.subscribe();
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


    /**
     * Метод измения размера
     * @param { Point } size Размер в виде @Point
     */
    resize( size ) { }


}