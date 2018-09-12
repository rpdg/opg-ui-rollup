import { ItemRender } from "./../util/BindList";
import * as Helper from "../util/Helper";
import { IFormComponent, FormComponentConfig } from "./IComponent";
import { ListDisplayObject } from "./ListDisplayObject";
import { bindList, BindListOption } from "../util/BindList";
import {deepExtend} from '../util/Helper';
import  ComponentEvents  from "./ComponentEvents";
import AjaxForm from './Form';

export interface ListBoxConfig extends FormComponentConfig {
	prependBlank?: boolean;
}

export class ListBox extends ListDisplayObject implements IFormComponent {
	name: string = "";
	private prependBlank: boolean = true;

	constructor(dom: HTMLElement, cfg: ListBoxConfig) {
		super(dom, cfg);
	}

	init(dom: HTMLElement, cfg: ListBoxConfig) {
		this.name = cfg.name || `Select_${Helper.componentUid()}`;
		this.prependBlank = !!cfg.prependBlank;

		let bOpt: BindListOption = deepExtend(this.bindOpt , cfg.bindOpt) as BindListOption;

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
        
        this.bindOpt = bOpt;
	}
    set data(data: Array<any>) {
        let arr: Array<any> = deepExtend({} , data);
        if(this.prependBlank){
            arr.unshift({});
        }
		this.bind(arr);
		this._data = arr;
		this.trigger(ComponentEvents.dataBound, arr);
    }
    
	get text(): string {
		let selectElem: HTMLSelectElement = <HTMLSelectElement>this.dom;
		return (selectElem.options[selectElem.selectedIndex] as HTMLOptionElement).text;
	}
	set text(v: string) {
		AjaxForm.recheckDroplist(<HTMLSelectElement>this.dom , v , true);
	}

	get value(): string {
		let selectElem: HTMLSelectElement = <HTMLSelectElement>this.dom;
		return (selectElem.options[selectElem.selectedIndex] as HTMLOptionElement).value;
	}
	set value(v: string) {
        AjaxForm.recheckDroplist(<HTMLSelectElement>this.dom , v );
    }
}
