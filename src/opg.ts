import Span from './ui/Span';
import { AjaxDisplayObjectConfig } from './ui/AjaxDisplayObject';
import { CheckBox } from './ui/CheckBox';
import { FormComponentConfig } from './ui/IComponent';
import { ListBox , ListBoxConfig} from './ui/ListBox';


class OpgUi {

	dom : HTMLElement;

	constructor(selc: HTMLElement | string) {
		if(typeof selc === 'string'){
			let _dom = document.getElementById(selc.substr(1));
			if(_dom){
				this.dom = _dom ;
			}
			else{
				throw new Error('There is no dom object to be processed.');
			}
		}
		else{
			this.dom = selc;
		}
	}


	listBox(cfg: ListBoxConfig): ListBox {
		return new ListBox(this.dom, cfg);
	}

	checkBox(cfg: FormComponentConfig): CheckBox {
		return new CheckBox(this.dom, cfg);
	}

	span(cfg: any): Span {
		return new Span(this.dom, cfg);
	}

}

interface OpgStatic {
    (se: JQuery | any[] | Element | DocumentFragment | Text | string): OpgUi;
}

let opg: OpgStatic = <OpgStatic> function (selec : HTMLElement | string) {
    return new OpgUi(selec);
};


declare global {
    interface Window {
        opg: OpgStatic;
    }
}

window.opg = opg;

export default opg;