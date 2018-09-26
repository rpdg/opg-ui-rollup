import * as Helper from '../util/Helper';
import AjaxForm from './AjaxForm';
import ComponentEvents from './ComponentEvents';
import { FormComponentConfig, IFormComponent } from './IComponent';
import { ItemRender, bindList, BindListOption  } from './../util/BindList';
import { ListDisplayObject } from './ListDisplayObject';

export interface ListBoxConfig extends FormComponentConfig {
	prependBlank?: boolean|string;
}


export class ListBox extends ListDisplayObject implements IFormComponent {

	private prependBlank: string ;


	constructor(dom: HTMLElement, cfg: ListBoxConfig) {
		super(dom,  cfg);

		let eleName = cfg.name || `uiSelect_${Helper.componentUid()}`;

		if(this.dom.tagName != 'SELECT'){
			throw new Error(eleName + 'must bind to a select dom');
		}

		
		let selElem:HTMLSelectElement = this.dom as HTMLSelectElement;

		if(selElem.name != eleName){
			selElem.name = eleName;
		}
		
        if(cfg.prependBlank === undefined || cfg.prependBlank=== true){
            this.prependBlank = '--';
        }
        else if(cfg.prependBlank === false){
				this.prependBlank = '';
		}
		else{
			this.prependBlank = cfg.prependBlank;
        }
		

		let bOpt = Helper.deepExtend(this.bindOpt , cfg.bindOpt) ;

		if (!bOpt.itemRender) {
			bOpt.itemRender = {};
		}

		if (!cfg.text) {
			cfg.text = "name";
		}

		if (cfg.textRender) {
			bOpt.itemRender["__TextRender"] = cfg.textRender;
			cfg.text += ":=__TextRender";
		}

		if (!cfg.value) {
			cfg.value = "id";
		}

		if (cfg.valueRender) {
			bOpt.itemRender["__ValueRender"] = cfg.valueRender;
			cfg.value += ":=__ValueRender";
		}

		if (!bOpt.template) {
			bOpt.template = '<option value="${' + cfg.value + '}">${' + cfg.text + "}</option>";
        }
		
		bindList(this.dom , this.bindOpt);

	}

	protected bind(arr: Array<any>) {
		super.bind(arr);
		if(this.prependBlank){
			arr.unshift(undefined);
			let elChild :HTMLOptionElement = document.createElement('option');
			elChild.text = this.prependBlank;
			elChild.selected = true;
			this.dom.insertBefore(elChild, this.dom.firstChild);
        }
	}

    
	get text(): string {
		let selectElem: HTMLSelectElement = <HTMLSelectElement>this.dom;
		if(selectElem.selectedIndex > -1){
			return (selectElem.options[selectElem.selectedIndex] as HTMLOptionElement).text;
		}
		return '';
	}
	set text(v: string) {
		let selectElem: HTMLSelectElement = <HTMLSelectElement>this.dom;
		let oldIndex = selectElem.selectedIndex;
		if(oldIndex > -1){
			let newIndex = AjaxForm.recheckDroplist(selectElem , v , true);
			if(newIndex != oldIndex){
				let event = new Event('change');
				selectElem.dispatchEvent(event);
			}
		}
	}

	get value(): string{
		let selectElem: HTMLSelectElement = <HTMLSelectElement>this.dom;
		if(selectElem.selectedIndex > -1){
			return selectElem.value;
		}
		return '';
	}
	set value(v: string) {
		let selectElem: HTMLSelectElement = <HTMLSelectElement>this.dom;
		let oldIndex = selectElem.selectedIndex;
		if(oldIndex > -1){
			let newIndex = AjaxForm.recheckDroplist(selectElem , v );
			if(newIndex != oldIndex){
				let event = new Event('change');
				selectElem.dispatchEvent(event);
			}
		}
	}
	
	get selectedData():any{
		let i = (this.dom as HTMLSelectElement).selectedIndex;
		if(i > -1){
			return this._data[i];
		}
		return null;
	}
}
