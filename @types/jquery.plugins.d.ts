///<reference path="jquery.d.ts"/>

interface BindOption {
	list?: Array<any>;
	template?: string;
	storeData?: boolean;
	itemRender?: any;
	itemFilter?: Function;
	onBound?: Function;
}

interface Pagination {
	append_number_input: JQuery | boolean;
	pageNo: number;
	size: number;
	current_page: number;
	items_per_page: number;
	customizable: boolean | Array<any>;
	showCount: boolean | string;
}

interface JQuery {
	bindList(target: any): JQuery;

	fieldsToJson(rules?: any): any;

	jsonToFields(obj: any): any;

	decimalMask(mask: string): JQuery;

	iptError(sets: string | Function): any;

	resizableColumns(sets: any): any;

	syncCheckBoxGroup(select: any, context: any): any;

	checkBoxAll(select: any, context: any): any;

	pagination(count: number, sets: any): any;

	datetimepicker(sets: any): JQuery;
	
	dateRangePicker(sets: any): JQuery;

	recheckElement(val:any) :JQuery;
}


interface Window {
	CONFIG: any;
	__Cache: any;
	//opg: OpgStatic;
	__uri(path: string): string;
	X_TOKEN : any;
}
