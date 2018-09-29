import { TablePagination } from './Table';
import { Pagination , PaginationConfig } from './Pagination';
import { ListDisplayObject, ListDisplayObjectConfig } from "./ListDisplayObject";
import { ItemRenderEntry } from "../util/BindList";
import * as Helper from "../util/Helper";
import { ItemRender, bindList, BindListOption } from "./../util/BindList";
import ComponentEvents from './ComponentEvents';

type TableCmd = "checkAll" | "checkOne";
type RowConfig = {
	src?:string;
	render?:ItemRenderEntry;
};
type ColumnCfg = {
	src: string;
	text: string;
	render?: ItemRenderEntry;
	width?: number;
	align?: "left" | "right" | "center";
	cmd?: TableCmd;
};

type TitleBarButton = {
	id: string;
	clasName?: string;
	html: string;
};

type TitleBarCfg = {
	title: string;
	buttons?: TitleBarButton[];
};

export interface TablePagination {
	src ?: string;
	size ?: number;
};
export interface TableConfig extends ListDisplayObjectConfig {
	row: RowConfig;
	columns: ColumnCfg[];
	pagination: boolean | number | TablePagination;
	titleBar: TitleBarCfg;
}

export class Table extends ListDisplayObject {
	table: HTMLTableElement;
	thead: HTMLTableSectionElement;
	tbody: HTMLTableSectionElement;
	tfoot ?: HTMLTableSectionElement;
	cmd ?: TableCmd;
	pagination ?: TablePagination;

	constructor(dom: HTMLElement, cfg: TableConfig) {
		super(dom, cfg);

		if (this.dom.tagName === "TABLE") {
			this.table = this.dom as HTMLTableElement;
			this.table.classList.add("grid");
		} else {
			this.table = document.createElement("table");
			this.table.className = "grid";
			this.dom.appendChild(this.table);
		}

		this.thead = this.makeTableHead(cfg);
		
		this.tbody = document.createElement("tbody");
		this.table.appendChild(this.tbody);

		if(cfg.pagination){

			let pageSrc = '' ;
			let pageSize = 10 ;

			if(typeof cfg.pagination === 'boolean'){
				pageSize = 10;
			}
			else if(typeof cfg.pagination === 'number'){
				pageSize = cfg.pagination;
			}
			else{
				pageSrc = (cfg.pagination as TablePagination).src || '';
				pageSize = (cfg.pagination as TablePagination).size || 10 ;
			}


			this.tfoot = this.makeTableFoot(cfg);

			let tb = this;
			this.once(ComponentEvents.ajaxEnd , (ajaxRes : any)=>{
				let pageValues = Helper.jsonPath(ajaxRes , pageSrc);
				this.makePagination({
					size : pageSize ,
					total : pageValues['total'] as number,
					action: function(n : number){
						tb.fetch({
							page : n
						});
					}
				})
			});
		}

		let bOpt = Helper.deepExtend(this.bindOpt, cfg.bindOpt);
		this.makeTemplate(cfg , bOpt);

		bindList(this.tbody, this.bindOpt);
	}

	protected bind(arr: Array<any>) {
		if(!this.bindOpt.list){
			this.bindOpt.list = arr;
			bindList(this.tbody , this.bindOpt);
		}
		else{
			bindList(this.tbody , arr);
		}
	}

	/**
	 * 生成模板
	 * @param sets 完整配置
	 * @param bOpt 数据绑定配置
	 */
	private makeTemplate(sets: TableConfig , bOpt:BindListOption){
		let tdTmp = [],  i = 0, l =  sets.columns.length;

		if(!bOpt.itemRender){
			bOpt.itemRender = {};
		}

		for (; i < l; i++) {
			let col = sets.columns[i];
			let name:string;
			let render : string ;

			if (typeof col.render === 'function') {
				name = `${col.src}_render_${Helper.componentUid()}`.replace(/\./g , '_') ;
				render = `:=${name}`;
				bOpt.itemRender[name] = col.render;
			}
			else render = '';
	
			if (col.cmd) {
	
				tdTmp[i] = '<td class="text-center"><input type="'+(col.cmd === 'checkAll'?'checkbox':'radio')+'" name="chk_' + i + '" value="${' + col.src + render + '}"></td>';
					
				if (!this.cmd) {
					this.cmd = col.cmd;
				}
			}
			else {
	
				let classAlign = "text-" + (col.align ? col.align.toLowerCase() : "center");
	
				tdTmp[i] = '<td class="' + classAlign + '">${' + col.src + render + '}</td>';
			}
		}

		let trSrc;
		if (sets.row && sets.row.render) {
			trSrc = sets.row.src || '____';
			bOpt.itemRender['__renderTr'] = (val, i, row, attr) => {
				let cn = '';
				if(sets.row.render){
					cn = sets.row.render(val, i, row, attr) || '';
				}
				let sn = i!=undefined?(i % 2 ? 'odd' : 'even'):'';
				return sn + ' ' + cn;
			}
		}
		else {
			trSrc = '____';
			bOpt.itemRender['__renderTr'] = (val, i) => i!=undefined?(i % 2 ? 'odd' : 'even'):'';
		}

		bOpt.template =  '<tr class="${' + trSrc + ':=__renderTr}">' + tdTmp.join('') + '</tr>';
	}

	/**
	 * 生成THead结构
	 * @param sets 完整配置
	 */
	private makeTableHead(sets: TableConfig) : HTMLTableSectionElement{
		let i :number = 0,
			colCss :string[] = [],
			th :string[] = [];
		for (let col; (col = sets.columns[i]); i++) {
			if (col.cmd) {
				col.width = col.width || 32;
				col.text = `<input type="${col.cmd === "checkAll" ? "checkbox" : "hidden"}" name="${col.src}" value="chk_${i}" class="iptTableCmd">`;
			}

			colCss[i] = `width: ${col.width ? col.width + "px" : "auto"};`;
			th[i] = `<th style="${colCss[i]}">${col.text || col.src}</th>`;
		}
		let thead = document.createElement("thead");
		thead.innerHTML = `<tr>${th.join('')}</tr>`;
		this.table.appendChild(thead);
		return thead;
	}

	private makeTableFoot(sets : TableConfig) : HTMLTableSectionElement{
		let tfoot = document.createElement("tfoot");
		tfoot.innerHTML = `<tr><td colspan="${sets.columns.length}"></td></td></tr>`;
		this.table.appendChild(tfoot);
		return tfoot;
	}

	private makePagination(opt : PaginationConfig){
		if(this.tfoot){
			let td = this.tfoot.querySelector('td');
			if(td){
				new Pagination(td , opt)
			}
		}
	}

	action(btnClass:string , action:Function){
		Helper.delegate(this.tbody , 'click' , btnClass , action);		
	}

	get selectedData(): null {
		return null;
	}
}

class TableTitleBar {
	dom: HTMLDivElement;
	buttons: HTMLButtonElement[] = [];
	constructor(cfg: TitleBarCfg) {
		this.dom = document.createElement('div');
	}
}
