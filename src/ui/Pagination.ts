import { deepExtend } from "../util/Helper";
import { DisplayObject, DisplayObjectConfig } from "./DisplayObject";

//https://github.com/rainjay/pagination




// useful functions
function createLi(item :Item) {
	const _li = document.createElement("li");
	const _txt = document.createTextNode(item.value);
	_li.appendChild(_txt);
	item.liClass && _li.classList.add(item.liClass);
	item.title && _li.setAttribute("title", item.title);
	_li.addEventListener("click", function() {
		item.action(item.value);
	});
	return _li;
}

function createLists(arry : Item[], config : PaginationGlobalConfig) {
	const _ul = document.createElement("ul");
	_ul.classList.add(config.ulClass);
	for (let i = 0; i < arry.length; i++) {
		_ul.appendChild(createLi(arry[i]));
	}
	return _ul;
}

function replaceElement(newEl :HTMLElement, el:HTMLElement) {
    if(el.parentNode)
	    el.parentNode.replaceChild(newEl, el);
}

function scrollToTop(selector :string) {
	var speed = 10;
	window.scrollTo(0, 0);
	Array.prototype.slice.call(document.querySelectorAll(selector)).forEach((item:any) => {
		var _interval = setInterval(() => {
			if (item.scrollTop <= 0) {
				clearInterval(_interval);
			} else {
				item.scrollTop -= speed;
				speed += 1;
			}
		}, 10);
	});
}

function noop() {}

/**
 * validate page number that will go
 * @param  {Number} pageCount - page nums that will generate
 * @param  {[type]} pager - the object instantiated by Pagination
 */
function validateCurrent(pageCount: number, pager: Pagination) {
	if (pager.current > pageCount) {
		pager.current = pageCount;
	}
	if (pager.current <= 0) {
		pager.current = 1;
	}
	if (pageCount <= 1) {
		pager.hide = global_config.hideIfEmpty;
	}
}

/**
 * callback when you click one item of the page
 * @param  {Number} page - the page number of the clicked item
 * @param  {[type]} pager - the object instantiated by Pagination
 */
function internalAction(page :number, pager :Pagination) {
	if (pager.current === page) {
		return;
	}
	pager.current = page;
	pager.action({
		current: +pager.current,
		size: +pager.size,
		total: +pager.total
	});
	build(pager);
	if (global_config.scrollTop) {
		scrollToTop(global_config.scrollContainer);
	}
}

/**
 * Create pageRange
 * @param  {Number} start - the start of the page range
 * @param  {Number} finish - the end of the page range
 * @param  {[type]} pager - the object instantiated by Pagination
 * @return {Array } page range array
 */
function createRange(start : number, finish: number, pager :Pagination) {
	// Create the range item Function
	const createItem = function(i :number):Item {
		return {
			value: i.toString(),
			title: global_config.lang === "cn" ? `第${i}页` : `Page ${i}`,
			liClass: pager.current === i ? global_config.activeClass : "",
			action(value) {
				internalAction(value, pager);
			}
		};
	};
	const range :Item[]= [];

	// i is the page number
	for (let i = start; i <= finish; i++) {
		var item = createItem(i);
		range.push(item);
	}
	return range;
}

/**
 * create Dots exp: 1 2 3 4 [...] 10
 * @return {Array}
 */
function createDots() {
	return [
		{
			value: global_config.dots,
			action: function() {}
		}
	];
}

/**
 * create 1 [...]
 * @param  {Number} current - page num will go
 * @param  {Object} pager - the object instantiated by Pagination
 * @return {Array}
 */
function createFirst(current:number, pager:Pagination): Item[] {
	return createRange(1, 1, pager).concat(createDots());
}

/**
 * create [...] lastPage, exp  [...] 10
 * @param  {Number} pageCount
 * @param  {Object} pager - the object instantiated by Pagination
 * @return {Array}
 */
function createLast(pageCount :number, pager: Pagination) : Item[] {
	return createDots().concat(createRange(pageCount, pageCount, pager));
}


type Item = {
    value: string;
    title ?: string;
    liClass ?: string;
    action : (value?:any)=>void;
};

/**
 * create < and >
 * @param  {Number} pageCount
 * @param  {Object} pager - the object instantiated by Pagination
 * @param  {String} mode  - pre or next
 * @return {Array}
 */
function createPreNext(pageCount: number, pager: Pagination, mode: "pre" | "next") : Item[] {
	if (!global_config.showPreNext || pageCount < 1) {
		return [];
	}

	type NItem = {
		value: string;
		title: string;
		page: number;
	};

	var disabled: boolean, item: NItem;

	if (mode === "pre") {
		disabled = pager.current - 1 <= 0;
		var prevPage = pager.current - 1 <= 0 ? 1 : pager.current - 1;
		item = {
			value: "⟨",
			title: global_config.lang === "cn" ? "上一页" : "Pre page",
			page: prevPage
		};
	} else {
		disabled = pager.current + 1 > pageCount;
		var nextPage = pager.current + 1 >= pageCount ? pageCount : pager.current + 1;

		item = {
			value: "⟩",
			title: global_config.lang === "cn" ? "下一页" : "Next page",
			page: nextPage
		};
	}

	return [
		{
			value: item.value,
			title: item.title,
			liClass: disabled ? global_config.disableClass : "",
			action: function() {
				if (!disabled) {
					internalAction(item.page, pager);
				}
			}
		}
	];
}

/**
 * render pagination
 * @param  {Object} pager - the object instantiated by Pagination
 */
function build(pager: Pagination) {
	pager.lists = [];
	const pageCount = Math.ceil(pager.total / pager.size);
	// fullpageCount contains start, finish, and adjacents of current page
	const fullPageCount = global_config.adjacent * 2 + 3;
	validateCurrent(pageCount, pager);
	pager.lists = pager.lists.concat(createPreNext(pageCount, pager, "pre"));
	// If the page count is less than the fullPageCount
	// Just display all pages
	if (pageCount <= fullPageCount) {
		pager.lists = pager.lists.concat(createRange(1, pageCount, pager));
	} else if (pager.current - global_config.adjacent <= 2) {
		pager.lists = pager.lists.concat(createRange(1, fullPageCount, pager));
		pager.lists = pager.lists.concat(createLast(pageCount, pager));
	} else if (pager.current < pageCount - (global_config.adjacent + 2)) {
		let start = pager.current - global_config.adjacent;
		let finish = pager.current + global_config.adjacent;
		pager.lists = pager.lists.concat(createFirst(pageCount, pager));
		pager.lists = pager.lists.concat(createRange(start, finish, pager));
		pager.lists = pager.lists.concat(createLast(pageCount, pager));
	} else {
		let start = pageCount - fullPageCount + 1;
		let finish = pageCount;
		pager.lists = pager.lists.concat(createFirst(pageCount, pager));
		pager.lists = pager.lists.concat(createRange(start, finish, pager));
	}
	pager.lists = pager.lists.concat(createPreNext(pageCount, pager, "next"));
	const lists = createLists(pager.lists, global_config);
	replaceElement(lists, pager.field);
	pager.field = lists;
	if (pager.hide) {
		pager.field.style.display = "none";
	}
}

export type PaginationGlobalConfig = {
	activeClass: string;
	adjacent: number;
	disableClass: string;
	dots: string;
	hideIfEmpty: boolean;
	lang: string;
	scrollContainer: string;
	scrollTop: boolean;
	showPreNext: boolean;
	ulClass: string;
};

const global_config: PaginationGlobalConfig = {
	activeClass: "active",
	adjacent: 2,
	disableClass: "disabled",
	dots: "...",
	hideIfEmpty: true,
	lang: "cn",
	scrollContainer: "body",
	scrollTop: false,
	showPreNext: true,
	ulClass: "pagination"
};

export interface PaginationConfig  extends DisplayObjectConfig{
    action: PageAction;
    total: number;
	size: number;
}

export type PageActionObj = {
	current: number,
	size:number,
	total:number
};
export interface PageAction  {
	(param:PageActionObj):void;
}

export class Pagination extends DisplayObject {
	total: number;
	current: number;
	size: number;
	action: PageAction;
	field: HTMLElement;
	lists: Item[];
	hide: boolean;

	constructor(dom:HTMLElement , cfg:PaginationConfig) {
        super(dom, cfg);

		this.total = cfg.total || 1;
		this.size = cfg.size || 1;
		this.action = cfg.action || noop;
		this.field = document.createElement('div');
		this.dom.appendChild(this.field);
		this.lists = [];
		this.current = 1;
		this.hide = false;
		build(this);
	}

	static config(config: PaginationGlobalConfig) {
		deepExtend(global_config, config);
	}

	goToPage(num: number) {
		internalAction(num, this);
	}

}

export default Pagination;
