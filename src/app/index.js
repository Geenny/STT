import MainApplication from "./main/MainApplication";

const HTMLElement = document.getElementById( 'ApplicationContainer' );
const CONFIG = {}; // require('./core/config/CONFIG');

function onStart() {

    const application = new MainApplication();
    application.HTMLElement = HTMLElement;
    application.init( CONFIG );

}

window.onload = function() {
    
    onStart();

};




