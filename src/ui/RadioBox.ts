import * as Helper from "../util/Helper";
import AjaxForm from "./AjaxForm";
import ComponentEvents from "./ComponentEvents";
import { FormComponentConfig, IFormComponent } from "./IComponent";
import { ItemRender, bindList, BindListOption } from "./../util/BindList";
import { ListDisplayObject } from "./ListDisplayObject";

export interface RadioBoxConfig extends FormComponentConfig {
	labelClass?: string;
	joiner?: string;
}

export class RadioBox extends ListDisplayObject implements IFormComponent {
	private elementName: string;
	private elements: Array<HTMLInputElement> = [];

	constructor(dom: HTMLElement, cfg: RadioBoxConfig) {
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
				'" type="radio" value="${' +
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

	get text(): string  {
		let val: string = '';

		let checked = this.selectedItem;

		if (checked) {
			val = (checked.parentNode as HTMLLabelElement).innerText;
		}

		return val;
	}

	set text(text: string) {
		let lbs = this.dom.querySelectorAll("label");
		for (let i = 0, l = lbs.length; i < l; i++) {
            let lb = lbs[i];
            let ipt = lb.querySelector<HTMLInputElement>('input[name="' + this.elementName + '"]');
            if (ipt) {
				ipt.checked = (text === lb.innerText);
            }
		}
	}

	get value(): string {
		let val: string = '';

		let checked = this.selectedItem;

		if (checked) {
			val = checked.value;
		}
		return val;
	}

	set value(val: string) {
		let ipts = this.elements;
		for (let i = 0, l = ipts.length; i < l; i++) {
			let ipt = ipts[i];
			ipt.checked = (val === ipt.value);
		}
	}

	get selectedItem(): HTMLInputElement | null {
		return this.dom.querySelector<HTMLInputElement>('input[name="' + this.elementName + '"]:checked');
	}

	get selectedData(): any {
        let ipts = this.elements,
            val:any,
			that = this;

		ipts.forEach((chkBx, i) => {
			if (chkBx.checked) {
                val = that._data[i];
                return false;
			}
		});

		return val;
	}
}
