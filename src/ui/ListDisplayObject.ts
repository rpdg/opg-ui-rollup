import { AjaxDisplayObject, AjaxDisplayObjectConfig, AjaxEvents } from "./AjaxDisplayObject";

export interface ListDisplayObjectConfig extends AjaxDisplayObjectConfig {

}



export abstract class ListDisplayObject extends AjaxDisplayObject {

	constructor(dom: HTMLElement, cfg: ListDisplayObjectConfig) {
		super(dom, cfg);
	}

	protected bind(arr: Array<any>) {
		this.trigger(AjaxEvents.dataBind, arr);
	}

	get data(): Array<any> {
		return this._data;
	}
	set data(data: Array<any>) {
		this._data = data;
	}
}
