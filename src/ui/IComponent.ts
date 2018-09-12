import { ListDisplayObjectConfig } from "./ListDisplayObject";
import {ItemRenderEntry} from '../util/BindList';

export interface IFormComponent {
	value: any;
	text: any;
	name: string;
}

export interface FormComponentConfig extends ListDisplayObjectConfig {
	name?: string;

	text?: string;
	textRender ?: ItemRenderEntry;

	value?: string;
	valueRender ?: ItemRenderEntry;
}

