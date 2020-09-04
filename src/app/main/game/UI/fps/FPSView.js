import { Container, Text, TextStyle } from "pixi.js";

export default class FPSView extends Container {

    /**
     * Обновить текстовые данные поля @textField 
     */
    get text() { return this._text || "60 FPS"; }
    set text( value ) {
        this._text = value;
        this.textField.text = value;
    }


    init() {
        this._initTextView();
    }
    _initTextView() {
        const TEXT_STYLE_OPTIONS = {
            fontFamily: 'tahoma',
            fontSize: 50,
            fill: 0xFF0000
        };
        const textStyle = new TextStyle( TEXT_STYLE_OPTIONS );
        const textField = new Text( this.text, textStyle );
        textField.anchor.set( 0.5, 0.5 );
        this.addChild( textField );

        this.textField = textField;
    }



}