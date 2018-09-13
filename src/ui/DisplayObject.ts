///<reference path="../../@types/jquery.plugins.d.ts"/>

import * as Helper from '../util/Helper';
import * as Paon from '../util/Paon';



export interface DisplayObjectConfig {
	onCreate?: (data: any[]) => void;
}

export abstract class DisplayObject {
	public guid: number;
	public dom: HTMLElement;

	private observable: Paon.Observable;

	constructor(dom: HTMLElement, cfg: DisplayObjectConfig) {
		this.guid = Helper.componentUid();
		this.dom = dom;
		this.observable = new Paon.Observable(this);
	}


	trigger(evtName: string, data?: any) {
		this.observable.notifyObservers(evtName, data);
	}
	on(evtName: string, todo: Paon.Observer) {
		this.observable.addObserver(evtName, todo);
	}
	off(evtName: string, todo?: Paon.Observer) {
		if (todo) {
			this.observable.removeObserver(evtName, todo);
		} else {
			this.observable.removeObserversType(evtName);
		}
	}
}