import Span from './ui/Span';
import { AjaxDisplayObjectConfig } from './ui/AjaxDisplayObject';
import { CheckBox , CheckBoxConfig } from './ui/CheckBox';
import { FormComponentConfig } from './ui/IComponent';
import { ListBox , ListBoxConfig} from './ui/ListBox';
import { RadioBox , RadioBoxConfig} from './ui/RadioBox';
import { AjaxForm , AjaxFormConfig} from './ui/AjaxForm';
import { Table , TableConfig } from './ui/Table';


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

	checkBox(cfg: CheckBoxConfig): CheckBox {
		return new CheckBox(this.dom, cfg);
	}

	radioBox(cfg: RadioBoxConfig): RadioBox {
		return new RadioBox(this.dom, cfg);
	}

	table(cfg: TableConfig): Table {
		return new Table(this.dom, cfg);
	}

	form(cfg: AjaxFormConfig): AjaxForm {
		return new AjaxForm(this.dom, cfg);
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