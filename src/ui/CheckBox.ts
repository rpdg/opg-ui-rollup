import * as Helper from '../util/Helper';
import { IFormComponent , FormComponentConfig} from "./IFormComponent";
import { ListDisplayObject} from "./ListDisplayObject";



export class CheckBox extends ListDisplayObject implements IFormComponent {

    constructor(dom: HTMLElement, cfg: FormComponentConfig){
        super(dom, cfg);

        const elementName = cfg.name || `CheckBox_${Helper.componentUid()}`;
    }

    get text():string[] {
        return [];
    }
    set text(v:string[]){
        //todo:
    }
    
    get value():string[]{
        
		return [];
    }
    set value(v:string[]){

    }
}