import Event from "../observer/Event";

export default class ResizeEvent extends Event {

    constructor( type, width, height ) {

        super( type );

        this.width = width;
        this.height = height;

    }

}

ResizeEvent.CHANGE = "resizeChange";