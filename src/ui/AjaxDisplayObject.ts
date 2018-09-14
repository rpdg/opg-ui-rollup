import { ApiConfig, ApiInstance, ApiMethod, httpMethod, AjaxMessage } from "../util/Ajax";
import { DisplayObjectConfig, DisplayObject } from "./DisplayObject";
import { deepExtend , jsonPath} from "../util/Helper";
import ComponentEvents from "./ComponentEvents";

export interface AjaxDisplayObjectConfig extends DisplayObjectConfig {
	api?: string;
	dataSrc : string,
	method?: httpMethod;
	param ?: any;
}

export abstract class AjaxDisplayObject extends DisplayObject {
	protected _axio?: ApiInstance;
	protected _param : any;

	protected _data: any;
	protected _dataSrc : string ;

	public method: httpMethod;

	constructor(dom: HTMLElement, cfg: AjaxDisplayObjectConfig) {
		super(dom, cfg);

		this._dataSrc = cfg.dataSrc === undefined ? 'data' : cfg.dataSrc ;

		this._param = cfg.param || {};

		this.method = cfg.method ||  'get' ;

		if (cfg.api) {
			this._axio = new ApiInstance(cfg.api, this.method, true);
		}
	}

	async fetch(paramObject?: any): Promise<AjaxMessage> {
		if (!this._axio) {
			throw new Error("no api to call");
		}

		deepExtend(this._param , paramObject);

		this.trigger(ComponentEvents.ajaxBegin, this._param);

		let axioRes = await this._axio.invoke(this._param);
		let resData: AjaxMessage = axioRes.data;
		this.trigger(ComponentEvents.ajaxEnd, resData);

		this.data = jsonPath(resData , this._dataSrc);

		return resData;
	}

	async refresh(paramObject?: any): Promise<AjaxMessage>{
		this._param = deepExtend({} , paramObject);
		return this.fetch(this._param);
	}

	protected bind(data: any) {
		console.log("to bind data: ", data);
	}

	get data(): any {
		return this._data;
	}
	set data(data: any) {
		let tar = deepExtend(data);
		this.bind(tar);
		this._data = tar;
		this.trigger(ComponentEvents.updated, tar);
	}
}
