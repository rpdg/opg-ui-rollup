import { ListDisplayObjectConfig} from "./ListDisplayObject";

export interface IFormComponent {
	value: any;
	text: any;
}

export interface FormComponentConfig extends ListDisplayObjectConfig{
    name ?:string;
}
