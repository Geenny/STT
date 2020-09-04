import EventDispatcher from "./observer/EventDispatcher";
import { Application, Point } from "pixi.js";
import ResizeEvent from "./events/ResizeEvent";
import ApplicationEvent from "./events/ApplicationEvent";
import Event from "./observer/Event";
import Slot from "./game/slot/slot/Slot";
import UI from "./game/UI/UI";

export default class MainApplication extends EventDispatcher {


    //
    // GET/SET
    //
    get started() { return this._started; }

    get stage() {return this.pixi ? this.pixi.stage : null; }

    /**
     * Размер приложения
     */
    get size() { return this._size; }
    set size( value ) {
        this._size = value;
        this._pixiResize();
    }

    /**
     * Елемент контейнер для @Application().view
     */
    get HTMLElement() { return this._HTMLElement; }
    set HTMLElement( value ) {
        this._HTMLElement = value;
        this.start();
    }

    /**
     * Ширина приложения
     */
    get width() { return this.size.x; }
    
    /**
     * Высота приложения
     */
    get height() { return this.size.y; }


    //
    // INIT
    //

    /**
     * Инициализация приложения
     * @param { Object } CONFIG Объект конфигурации приложения
     */
    init( CONFIG = { } ) {
        this._initVars();
        this._initConfig( CONFIG );
        this._initSubscribe();
        this._initResize();
        this._initPixiView();
        this._initGame();
        this._initUI();

        this.start();

        this.onResize();
    }

    _initVars() {
        this._started = false;
        this._size = new Point( window.innerWidth, window.innerHeight );
    }
    _initSubscribe() {
        this.onResize = this.onResize.bind( this );
        window.addEventListener( Event.RESIZE, this.onResize );
    }
    _initConfig( CONFIG = {} ) {
        this.CONFIG = CONFIG;
    }
    _initResize() {
        this.onResize();
    }
    _initPixiView() {
        this._pixiApplicationCreate();
    }
    _initGame() {
        const game = new Slot( this, this.CONFIG.GAME );
        game.init();

        this.game = game;
    }
    _initUI() {
        const ui = new UI( this );
        this.UI = ui;
    }


    //
    // PROCESS MANAGE
    //

    /**
     * Запуск игры
     */
    start() {

        if ( this.started ) return;
        if ( !this.HTMLElement || !this.CONFIG ) return;

        this._pixiAddToHTMLElement();
        this._pixiResize();

        this._started = true;

        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.START, this ) );

    }

    _pixiApplicationCreate() {
        const PIXI_OPTIONS = this._pixiOptionsGet();
        const pixi = new Application( PIXI_OPTIONS );

        this.pixi = pixi;
    }
    _pixiAddToHTMLElement() {
        this.HTMLElement.appendChild( this.pixi.view );
    }

    _pixiOptionsGet() {
        const { width, height } = this;
        return { width, height, backgroundColor: 0x202020 };
    }

    _pixiResize() {

        if ( !this.pixi ) return;

        this.pixi.renderer.autoResize = true;
        this.pixi.renderer.resize( this.width, this.height );

    }


    //
    // RESIZE
    //

    onResize() {

        this.size = new Point( window.innerWidth, window.innerHeight );

        this.dispatchEvent( new ResizeEvent( ResizeEvent.CHANGE, this.width, this.height ) );
        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.RESIZE, this ) );

    }


    //
    //
    //


}