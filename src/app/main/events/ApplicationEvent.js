import Event from "../observer/Event";

export default class ApplicationEvent extends Event {

    constructor( type, application ) {

        super( type );

        this.application = application;

    }

}

ApplicationEvent.INIT = "mainInit";
ApplicationEvent.RESIZE = "mainResize";
ApplicationEvent.START = "mainStart";
ApplicationEvent.STOP = "mainStop";