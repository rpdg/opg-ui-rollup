import { DisplayObject } from "./DisplayObject";
import {deepExtend} from '../util/Helper';

const defaults: Object = {
    text: "default string"
};

class Span extends DisplayObject {

	constructor(dom: HTMLElement,  cfg: any) {
        cfg = deepExtend({}, defaults, cfg);
        super(dom, cfg);
        this.dom.innerHTML = cfg.text;
	}
}

export default Span;