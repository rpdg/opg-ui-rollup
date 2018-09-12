import { Is } from './../util/Helper';
import { ApiInstance } from './../util/Ajax';
import { AjaxDisplayObject, AjaxDisplayObjectConfig } from "./AjaxDisplayObject";
import {bindList ,BindListOption} from '../util/BindList';
import {deepExtend} from '../util/Helper';
import  ComponentEvents  from "./ComponentEvents";

export interface ListDisplayObjectConfig extends AjaxDisplayObjectConfig {
	bindOpt?: BindListOption;
}


export abstract class ListDisplayObject extends AjaxDisplayObject {
	bindOpt: BindListOption = {
		itemRender  : {}
	};
	constructor(dom: HTMLElement, cfg: ListDisplayObjectConfig) {
		super(dom, cfg);
		bindList(dom , this.bindOpt);
	}

	protected bind(arr: Array<any>) {
		bindList(this.dom , arr);
	}

	get data(): Array<any> {
		return this._data;
	}
	set data(data: Array<any>) {
		let arr = deepExtend({} , data);
		this.bind(arr);
		this._data = arr;
		this.trigger(ComponentEvents.dataBound, arr);
	}
}
