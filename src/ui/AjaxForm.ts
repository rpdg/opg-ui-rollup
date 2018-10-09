import { AjaxDisplayObject, AjaxDisplayObjectConfig } from "./AjaxDisplayObject";
import { IFormComponent } from "./IComponent";

type FormValueTypes = "number" | "int" | "string" | "email" | "mobile" | "boolean";

interface AjaxFormElement {
	name: string;
	component?: IFormComponent;
	require: boolean;
	spcialChar: boolean;
	type: FormValueTypes;
}

export interface AjaxFormConfig extends AjaxDisplayObjectConfig {
	elements: {
		[EleName: string]: AjaxFormElement;
	};
}

export class AjaxForm extends AjaxDisplayObject {
	constructor(dom: HTMLElement, cfg: AjaxFormConfig) {
		super(dom, cfg);
	}

	protected bind(data: any) {}

	get data(): any {
		return null;
	}
}

export default AjaxForm;
