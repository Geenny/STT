import Event from "../../../../observer/Event";

export default class SlotEvent extends Event {

    constructor( type, slot = null, data = {} ) {

        super( type );

        this.slot = slot;
        this.data = data;

    }

}

SlotEvent.LINE_TYPE_CHANGE = "slotLineTypeChange";
SlotEvent.REELS_UPDATE = "slotReelsUpdate";
SlotEvent.STATE_CHANGE = "slotStateChange";
SlotEvent.SPIN_REQUEST = "slotSpinRequest";