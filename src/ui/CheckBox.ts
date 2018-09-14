import * as Helper from '../util/Helper';
import { IFormComponent , FormComponentConfig} from "./IComponent";
import { ListDisplayObject} from "./ListDisplayObject";



export class CheckBox extends ListDisplayObject implements IFormComponent {
    name :string;

    constructor(dom: HTMLElement, cfg: FormComponentConfig){
        super(dom, cfg);
        this.name = cfg.name || `CheckBox_${Helper.componentUid()}`;
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
    get selectedData():any{
        return null;
    }
}