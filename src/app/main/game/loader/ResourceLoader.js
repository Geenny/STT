import { Loader } from "pixi.js";

const LoaderState = {
    NONE: "none",
    LOADING: "loading",
    READY: "ready"
};

export default class ResourceLoader {

    static load( link, onComplete ) {
        if ( !ResourceLoader.instance ) new ResourceLoader();
        ResourceLoader.instance.load( link, onComplete );
    }

    constructor() {
        ResourceLoader.instance = this;
        this.init();
    }

    init() {
        this.list = [];
    }

    load( link, onComplete ) {
        const loaderData = this._loadAdd( link, onComplete );
        if ( !this._loaderIsLoading( link ) ) this._loadStart( loaderData );
    }

    _loadAdd( link, onComplete ) {
        const object = { state: LoaderState.NONE, link, onComplete };
        this.list.push( object );
        return object;
    }

    _loadStart( loaderData ) {
        const loader = new Loader();
        loaderData.loader = loader;
        loaderData.state = LoaderState.LOADING;

        loader.onComplete.add( ( loader, resources ) => {
            this._loaderContentSet( loaderData, resources[ loaderData.link ].texture );
            this._loaderComplete( loaderData );
        } );
        
        loader.add( loaderData.link );
        loader.load();
    }

    _loaderComplete( loaderDataComplete ) {
        for ( let i = 0; i < this.list.length; i++ ) {
            const loaderData = this.list[ i ];
            if ( loaderData.state === LoaderState.READY ) continue;
            if ( loaderData.link === loaderDataComplete.link ) {
                this._loaderContentSet( loaderData, loaderDataComplete.content );
                loaderData.onComplete( loaderData.content );
                loaderData.state = LoaderState.READY;
            }
        }
    }

    _loaderContentSet( loaderData, content ) {
        if ( loaderData.content === content ) return;
        loaderData.content = content;
    }

    _loaderIsLoading( link ) {
        for ( let i = 0; i < this.list.length; i++ ) {
            const loaderData = this.list[ i ];
            if ( loaderData.link === link && loaderData.state != LoaderState.NONE ) {
                return true;
            }
        }
        return false;
    }

}