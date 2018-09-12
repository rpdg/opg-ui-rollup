import { ApiConfig, ApiInstance, ApiMethod, httpMethod , AjaxMessage} from "../util/Ajax";
import { DisplayObjectConfig, DisplayObject } from "./DisplayObject";
import {deepExtend} from '../util/Helper';
import ComponentEvents from "./ComponentEvents";

export interface AjaxDisplayObjectConfig extends DisplayObjectConfig {
	api?: string;
	method?: httpMethod;
	param?:any;
	data ?: any;
}


export abstract class AjaxDisplayObject extends DisplayObject {
	protected _axio?: ApiInstance;
	protected _data: any;

	public method: httpMethod = "get";

	constructor(dom: HTMLElement, cfg: AjaxDisplayObjectConfig) {
		super(dom, cfg);

		if (cfg.method) {
			this.method = cfg.method;
		}
		if (cfg.api) {
			this._axio = new ApiInstance(cfg.api, this.method, true);
			this.callApi(cfg.param);
		}
		else if(cfg.data){
			this.data = cfg.data;
		}
	}

	protected async callApi(paramObject ?:any){
		if (this._axio) {
			this.trigger(ComponentEvents.ajaxBegin, paramObject);

			let axioRes = await this._axio.invoke(paramObject);
			let resData :AjaxMessage = axioRes.data;
			this.trigger(ComponentEvents.ajaxEnd, resData);

			this.data = resData;
		}
	}

	protected bind(data: any) {
		console.log('to bind data: ' , data);
	}

	get data(): any {
		return this._data;
	}
	set data(data: any) {
		this.bind(data);
		this._data = data;
		this.trigger(ComponentEvents.dataBound, data);
	}

	update(param?: any) {
		this.callApi(param);
	}
}
