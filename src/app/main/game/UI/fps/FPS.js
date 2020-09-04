import FPSView from "./FPSView";
import { Ticker } from "pixi.js";

export default class FPS {

    
    /**
     * Обновить текстовые данные поля @textField 
     */
    get text() { return this.view.text; }
    set text( value ) { this.view.text = value; }


    init() {
        this._initFPSView();
        this._initFPSTicker();
    }
    _initFPSView() {
        this.view = new FPSView();
        this.view.init();
    }
    _initFPSTicker() {
        this.fps = 0;
        this.fpsTime = Date.now();
        this.fpsTicker = Ticker.shared;
        this.fpsTicker.add( this._fpsTick, this );
    }

    _fpsTick() {
        const dateNow = Date.now();
        const time = dateNow - this.fpsTime;
        const fps = time > 0 ? ~~( 1000 / time ) : 60;
        if ( fps > this.fps && fps > this.fps + 1 && fps > this.fps + 2 ) this.fps ++;
        if ( fps < this.fps && fps < this.fps - 1 && fps < this.fps - 2 ) this.fps --;
        this.text = `${this.fps} FPS`;
        this.fpsTime = dateNow;
    }


}