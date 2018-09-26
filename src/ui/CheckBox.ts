import * as Helper from "../util/Helper";
import AjaxForm from "./AjaxForm";
import ComponentEvents from "./ComponentEvents";
import { FormComponentConfig, IFormComponent } from "./IComponent";
import { ItemRender, bindList, BindListOption } from "./../util/BindList";
import { ListDisplayObject } from "./ListDisplayObject";

export interface CheckBoxConfig extends FormComponentConfig {
	labelClass?: string;
	joiner?: string;
}

export class CheckBox extends ListDisplayObject implements IFormComponent {
	private elementName: string;
	private elements: Array<HTMLInputElement> = [];

	constructor(dom: HTMLElement, cfg: CheckBoxConfig) {
		super(dom, cfg);

		this.elementName = cfg.name || `uiCheckBox_${Helper.componentUid()}`;

		let bOpt = Helper.deepExtend(this.bindOpt, cfg.bindOpt);

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
			bOpt.template =
				'<label class="' +
				(cfg.labelClass || "") +
				'"><input name="' +
				this.elementName +
				'" type="checkbox" value="${' +
				cfg.value +
				'}">${' +
				cfg.text +
				"}</label>" +
				(cfg.joiner === undefined ? " " : cfg.joiner);
		}

		/* if(cfg.joiner){
            bOpt.joiner = cfg.joiner;
        } */

		bindList(this.dom, this.bindOpt);
	}

	protected bind(arr: Array<any>) {
		super.bind(arr);

		let chks = this.dom.querySelectorAll<HTMLInputElement>('input[name="' + this.elementName + '"]');
		this.elements = Array.prototype.slice.call(chks);
	}

	get text(): string[] {
		let val: string[] = [];

		let arr: HTMLInputElement[] = this.selectedItems;

		if (arr.length) {
			arr.forEach(function(ele: HTMLInputElement) {
				val.push((ele.parentNode as HTMLLabelElement).innerText);
			});
		}

		return val;
	}

	set text(texts: string[]) {
        let lbs = this.dom.querySelectorAll('label');
        for (let i = 0, l = lbs.length; i < l; i++) {
			let lb = lbs[i];
			if (texts.indexOf(lb.innerText) > -1) {
                let ipt = lb.querySelector<HTMLInputElement>('input[name="' + this.elementName + '"]');
                if(ipt){
                    ipt.checked = true;
                }
			}
		}
    }

	get value(): string[] {
		let val: string[] = [];

		let arr: HTMLInputElement[] = this.selectedItems;

		if (arr.length) {
			arr.forEach(function(ele: HTMLInputElement) {
				val.push(ele.value);
			});
		}
		return val;
	}

	set value(vals: string[]) {
		let ipts = this.elements;
		for (let i = 0, l = ipts.length; i < l; i++) {
			let ipt = ipts[i];
			if (vals.indexOf(ipt.value) > -1) {
				ipt.checked = true;
			}
		}
	}

	get selectedItems(): HTMLInputElement[] {
		let chked = this.dom.querySelectorAll<HTMLInputElement>('input[name="' + this.elementName + '"]:checked');
		let arr: HTMLInputElement[] = Array.prototype.slice.call(chked);

		return arr;
	}

	get selectedData(): any[] {
		let ipts = this.elements,
			arr: any[] = [],
			that = this;

		ipts.forEach((chkBx, i) => {
			if (chkBx.checked) {
				arr.push(that._data[i]);
			}
		});

		return arr;
	}
}
