import { AjaxDisplayObject } from "./AjaxDisplayObject";

class AjaxForm extends AjaxDisplayObject {

	static recheckDroplist(selectElem: HTMLSelectElement, val: string, byText: boolean = false) :number {
        let element: HTMLOptionsCollection = selectElem.options;
        let selectedIndex : number = -1;
		for (let i = 0, l = element.length; i < l; i++) {
			let elem: HTMLOptionElement = element[i];

			if ((byText ? elem.text : elem.value) === val) {
                elem.selected = true;
                selectedIndex = i;
				break;
			}

			elem.selected = false;
        }
        
        return selectedIndex;
	}
	
}

export default AjaxForm;
