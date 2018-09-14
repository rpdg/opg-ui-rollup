import { ListDisplayObjectConfig } from "./ListDisplayObject";
import { ItemRenderEntry } from "../util/BindList";

export interface IFormComponent {
	value: string | string[];
	text: string | string[];
}

export interface FormComponentConfig extends ListDisplayObjectConfig {
	name?: string;

	text?: string | string[];
	textRender?: ItemRenderEntry;

	value?: string | string[];
	valueRender?: ItemRenderEntry;
}
