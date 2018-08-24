import { ApiConfig, ApiCall, ApiMethod, httpMethod , AjaxMessage} from "../util/Ajax";
import { DisplayObjectConfig, DisplayObject } from "./DisplayObject";

export interface AjaxDisplayObjectConfig extends DisplayObjectConfig {
	api?: string;
	method?: httpMethod;
	paramObject?:any;
}

export const AjaxEvents = {
	ajaxBegin: "AJAX_BEGIN",
	ajaxEnd: "AJAX_END",
	dataBind: "DATA_BIND"
};

export abstract class AjaxDisplayObject extends DisplayObject {
	protected _axio?: ApiCall;
	protected _data: any;

	public method: httpMethod = "get";

	constructor(dom: HTMLElement, cfg: AjaxDisplayObjectConfig) {
		super(dom, cfg);

		if (cfg.method) {
			this.method = cfg.method;
		}
		if (cfg.api) {
			this._axio = new ApiCall(cfg.api, this.method, true);
			this.callApi(cfg.paramObject);
		}
	}

	protected async callApi(paramObject ?:any){
		if (this._axio) {
			this.trigger(AjaxEvents.ajaxBegin, paramObject);
			let axioRes = await this._axio.invoke(paramObject);
			this.trigger(AjaxEvents.ajaxEnd, axioRes);
			let res :AjaxMessage = axioRes.data;
		}
	}

	protected bind(data: any) {
		this.trigger(AjaxEvents.dataBind, data);
	}

	get data(): any {
		return this._data;
	}
	set data(data: any) {
		this._data = data;
	}

	async update(param?: any) {
		if (this._axio) {
			let res = await this._axio.invoke(param);
		}
	}
}
