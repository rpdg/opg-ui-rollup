import { Is } from './../util/Helper';
import { ApiInstance } from './../util/Ajax';
import { AjaxDisplayObject, AjaxDisplayObjectConfig } from "./AjaxDisplayObject";
import {bindList ,BindListOption} from '../util/BindList';
import {deepExtend , deepCloneArray} from '../util/Helper';
import  ComponentEvents  from "./ComponentEvents";

export interface ListDisplayObjectConfig extends AjaxDisplayObjectConfig {
	bindOpt?: BindListOption;
}


export abstract class ListDisplayObject extends AjaxDisplayObject {

	bindOpt: BindListOption ;

	constructor(dom: HTMLElement, cfg: ListDisplayObjectConfig) {
		super(dom, cfg);
		this.bindOpt = {itemRender  : {}} ;
	}


	protected bind(arr: Array<any>) {
		if(!this.bindOpt.list){
			this.bindOpt.list = arr;
			bindList(this.dom , this.bindOpt);
		}
		else{
			bindList(this.dom , arr);
		}
	}


	
	get data(): any[] {
		return this._data;
	}

	set data(list: any[]) {
		let arr = deepCloneArray(list);
		this.bind(arr);
		this._data = arr;
		this.trigger(ComponentEvents.updated, arr);
	}
	
	abstract get selectedData(): any ;
}
