import * as Helper from '../util/Helper';
import { IFormComponent , FormComponentConfig} from "./IFormComponent";
import { ListDisplayObject} from "./ListDisplayObject";


export interface ListBoxConfig extends FormComponentConfig{
    prependBlank ?:boolean;
}

export class ListBox extends ListDisplayObject implements IFormComponent {
    name :string;
    private prependBlank:boolean;

    constructor(dom: HTMLElement, cfg: ListBoxConfig){
        super(dom, cfg);

        this.name = cfg.name || `Select_${Helper.componentUid()}`;
        this.prependBlank = !!cfg.prependBlank;
    }

    get text():string {
        let selectElem: HTMLSelectElement = <HTMLSelectElement> this.dom;
		return (selectElem.options[selectElem.selectedIndex] as HTMLOptionElement).text;
    }
    set text(v:string){
        //todo:
    }
    
    get value():string{
        let selectElem: HTMLSelectElement = <HTMLSelectElement> this.dom;
		return (selectElem.options[selectElem.selectedIndex] as HTMLOptionElement).value;
    }
    set value(v:string){

    }
}