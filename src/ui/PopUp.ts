import { DisplayObject, DisplayObjectConfig } from "./DisplayObject";

type PopUpCallback = {
	(btnIndex: number, iframeWin?: any, clickedButton?: HTMLFormElement): boolean | void;
};

type PopUpBtnSets =
	| {
			text: string;
			className?: string;
			onClick?: PopUpCallback;
	  }
	| string;

interface PopUpConfig extends DisplayObjectConfig {
	btnClose?: boolean;
	btnMax?: boolean;
	buttons?: {
		[btnName: string]: PopUpBtnSets;
	};
	drag?: boolean;
	modal?: boolean;
	modalClose?: boolean;
	popId?: string | number;
	destroy?: boolean;
	show?: boolean;
	title?: string;
	height?: number;
	width?: number;
	onClose?: Function;
	onDestroy?: Function;
	callback?: PopUpCallback;
}

export class PopUp extends DisplayObject {
	constructor(dom: HTMLElement, cfg: PopUpConfig) {
        super(dom, cfg);
        
	}
}
