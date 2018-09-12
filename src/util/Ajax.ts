import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import cfg from "./Config";

export interface AjaxMessage {
	data?: any;
	code?: string | number;
}

/* export interface ApiCall {
	(param: any, callback: Function): void;

	(callback: Function): void;

	set(key: string, value: any): this;
	get(key: string): any;
} */

axios.defaults.baseURL = cfg.apiServer;
//axios.defaults.headers.common['Authorization'] = token;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.timeout = 10e3;

export type httpMethod = 'get'|'post'|'put'|'delete';

interface IApiMethod {
	[key:string] : httpMethod
}

export const ApiMethod :IApiMethod = {
	Get : 'get',
	Post : 'post',
	Put : 'put',
	Delete : 'delete',
}

export interface ApiConfig  {
	url : string;
	method ?: httpMethod ;
	restful ?: boolean;
}

export class ApiInstance {
	restful: boolean;
	method: httpMethod;
	url: string;

	constructor(url: string, method :httpMethod = "get" , restful:boolean = true) {
		this.restful = restful;
		this.method = method;
		this.url = url;
	}

	async invoke(data?: any) {
		let res =  await axios.request<AjaxMessage>({
			method: this.method,
			params: data,
			url: this.url
		});
		return res;
	}

	async post(paramsObj?: any) {
		let res = await axios.post<AjaxMessage>(this.url, paramsObj);
		return res.data;
	}
	async get(paramsObj?: any) {
		let res = await axios.get<AjaxMessage>(this.url, {params: paramsObj});
		return res.data;
	}
}
