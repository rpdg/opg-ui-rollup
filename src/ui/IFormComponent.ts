import { ListDisplayObjectConfig } from "./ListDisplayObject";

export interface IFormComponent {
	value: any;
	text: any;
	name: string;
}

export interface FormComponentConfig extends ListDisplayObjectConfig {
	name?: string;
}
