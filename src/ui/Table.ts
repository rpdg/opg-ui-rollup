import { Pagination, PaginationConfig, PageActionObj } from "./Pagination";
import { ListDisplayObject, ListDisplayObjectConfig } from "./ListDisplayObject";
import { ItemRenderEntry } from "../util/BindList";
import * as Helper from "../util/Helper";
import { ItemRender, bindList, BindListOption } from "./../util/BindList";
import ComponentEvents from "./ComponentEvents";

type TableCmd = "checkAll" | "checkOne";
type RowConfig = {
	src?: string;
	render?: ItemRenderEntry;
};
type ColumnCfg = {
	src: string;
	name: string;
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

export interface TablePaginationConfig {
	src?: string;
	size?: number;
}
export interface TableConfig extends ListDisplayObjectConfig {
	row: RowConfig;
	columns: ColumnCfg[];
	pager: boolean | number | TablePaginationConfig;
	titleBar: TitleBarCfg;
}

type TableResizer = {
	destroy: boolean;
	affected: boolean;
	overflow: boolean;
	index1: number;
	index2: number;
	mouse: number;
	width: number;
	sizes: number[];
};

export class Table extends ListDisplayObject {
	table: HTMLTableElement;
	thead: HTMLTableSectionElement;
	tbody: HTMLTableSectionElement;
	tfoot?: HTMLTableSectionElement;
	pageContainer?: HTMLElement | null;
	cmd?: TableCmd;
	pagination?: Pagination;
	resizer: TableResizer;

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

		if (cfg.pager) {
			let pageSrc = "";
			let pageSize = 10;

			if (typeof cfg.pager === "boolean") {
				pageSize = 10;
			} else if (typeof cfg.pager === "number") {
				pageSize = cfg.pager;
			} else {
				pageSrc = (cfg.pager as TablePaginationConfig).src || "";
				pageSize = (cfg.pager as TablePaginationConfig).size || 10;
			}

			this.tfoot = this.makeTableFoot(cfg);
			this.pageContainer = this.tfoot.querySelector("td");

			let tb = this;
			this.once(ComponentEvents.ajaxEnd, (ajaxRes: any) => {
				let pageValues = Helper.jsonPath(ajaxRes, pageSrc);
				tb.pagination = tb.makePagination({
					size: pageSize,
					total: pageValues["total"] as number,
					action: async function(pageOpt: PageActionObj) {
						await tb.fetch({
							page: pageOpt.current
						});
					}
				});
			});
		}

		let bOpt = Helper.deepExtend(this.bindOpt, cfg.bindOpt);
		this.makeTemplate(cfg, bOpt);

		bindList(this.tbody, this.bindOpt);

		this.resizer = {
			destroy: false,
			affected: true,
			overflow: false,
			index1: -1,
			index2: -1,
			mouse: -1,
			width: this.dom.offsetWidth,
			sizes: []
		};

		this.makeColumnResizer();
	}

	protected bind(arr: Array<any>) {
		if (!this.bindOpt.list) {
			this.bindOpt.list = arr;
			bindList(this.tbody, this.bindOpt);
		} else {
			bindList(this.tbody, arr);
		}
	}

	/**
	 * 生成模板
	 * @param sets 完整配置
	 * @param bOpt 数据绑定配置
	 */
	private makeTemplate(sets: TableConfig, bOpt: BindListOption) {
		let tdTmp = [],
			i = 0,
			l = sets.columns.length;

		if (!bOpt.itemRender) {
			bOpt.itemRender = {};
		}

		for (; i < l; i++) {
			let col = sets.columns[i];
			let name: string;
			let render: string;

			if (typeof col.render === "function") {
				name = `${col.src}_render_${Helper.componentUid()}`.replace(/\./g, "_");
				render = `:=${name}`;
				bOpt.itemRender[name] = col.render;
			} else render = "";

			if (col.cmd) {
				tdTmp[i] =
					'<td class="text-center"><input type="' +
					(col.cmd === "checkAll" ? "checkbox" : "radio") +
					'" name="chk_' +
					i +
					'" value="${' +
					col.src +
					render +
					'}"></td>';

				if (!this.cmd) {
					this.cmd = col.cmd;
				}
			} else {
				let classAlign = "text-" + (col.align ? col.align.toLowerCase() : "center");

				tdTmp[i] = '<td class="' + classAlign + '">${' + col.src + render + "}</td>";
			}
		}

		let trSrc;
		if (sets.row && sets.row.render) {
			trSrc = sets.row.src || "____";
			bOpt.itemRender["__renderTr"] = (val, i, row, attr) => {
				let cn = "";
				if (sets.row.render) {
					cn = sets.row.render(val, i, row, attr) || "";
				}
				let sn = i != undefined ? (i % 2 ? "odd" : "even") : "";
				return sn + " " + cn;
			};
		} else {
			trSrc = "____";
			bOpt.itemRender["__renderTr"] = (val, i) => (i != undefined ? (i % 2 ? "odd" : "even") : "");
		}

		bOpt.template = '<tr class="${' + trSrc + ':=__renderTr}">' + tdTmp.join("") + "</tr>";
	}

	/**
	 * 生成THead结构
	 * @param sets 完整配置
	 */
	private makeTableHead(sets: TableConfig): HTMLTableSectionElement {
		let i: number = 0,
			colCss: string[] = [],
			th: string[] = [];
		for (let col; (col = sets.columns[i]); i++) {
			if (col.cmd) {
				col.width = col.width || 32;
				col.name = `<input type="${col.cmd === "checkAll" ? "checkbox" : "hidden"}" name="${
					col.src
				}" value="chk_${i}" class="iptTableCmd">`;
			}

			colCss[i] = `width: ${col.width ? col.width + "px" : "auto"};`;
			th[i] = `<th style="${colCss[i]}">${col.name || col.src}</th>`;
		}
		let thead = document.createElement("thead");
		thead.innerHTML = `<tr>${th.join("")}</tr>`;
		this.table.appendChild(thead);
		return thead;
	}

	private makeTableFoot(sets: TableConfig): HTMLTableSectionElement {
		let tfoot = document.createElement("tfoot");
		tfoot.innerHTML = `<tr><td colspan="${sets.columns.length}"></td></td></tr>`;
		this.table.appendChild(tfoot);
		return tfoot;
	}

	private makePagination(opt: PaginationConfig): Pagination {
		return new Pagination(this.pageContainer as HTMLElement, opt);
	}

	private makeColumnResizer() {
		let tb = this;

		this.thead.querySelectorAll("th").forEach(function(th) {
			th.addEventListener("mousedown", function(e) {
				return tb.columnMouseDown(e);
			});

			document.addEventListener('mousemove', tb.columnMouseMove.bind(tb));
		});

		document.addEventListener("mouseup", function(e) {
			document.removeEventListener('mousemove', tb.columnMouseMove);
			return tb.columnMouseUp(e);
		});
	}

	private columnMouseMove(e: MouseEvent) {
		let resizer = this.resizer;
		let parent = this.dom as HTMLTableElement;

		if (resizer.destroy) {
			return false;
		}
		if (resizer.index1 != -1) {
			let moveX = e.clientX || e.pageX;
			let remain = 0;

			if (resizer.overflow) {
				let diffX = resizer.mouse - moveX;
				let maxWidth = Math.max(resizer.sizes[resizer.index1] - diffX, 40);

				parent.rows[0].cells[resizer.index1].style.width = maxWidth + "px";
				resizer.sizes.filter(function(x, i) {
					if (i == resizer.index1) {
						remain += maxWidth;
					} else if (i !== resizer.index2) {
						remain += resizer.sizes[i];
					}
				});

				parent.rows[0].cells[resizer.index2].style.width = Math.max(resizer.width - remain, 40) + "px";
			} else {
				let index1 = moveX < resizer.mouse ? resizer.index1 : resizer.index2;
				let index2 = moveX < resizer.mouse ? resizer.index2 : resizer.index1;
				let diffX = Math.abs(resizer.mouse - moveX);
				let maxWidth = Math.max(resizer.sizes[index1] - diffX, 40);

				parent.rows[0].cells[index1].style.width = maxWidth + "px";
				parent.rows[0].cells[index2].style.width =
					resizer.sizes[index2] + (resizer.sizes[index1] - maxWidth) + "px";
			}
		}
	}

	private columnMouseUp(e: MouseEvent) {
		let resizer = this.resizer;

		if (resizer.destroy) {
			return false;
		}
		resizer.index1 = -1;
		resizer.index2 = -1;
	}

	private columnMouseDown(e: MouseEvent) {
		let resizer = this.resizer;
		if (resizer.destroy) {
			return false;
		}

		let th = (e.target || e.srcElement) as HTMLTableCellElement;
		let parent = this.dom as HTMLTableElement;

		if (e.offsetX > th.offsetWidth - 8) {
			//th:after offsetX
			resizer.mouse = e.clientX || e.pageX;
			resizer.index1 = th.cellIndex;
			resizer.index2 = resizer.affected ? resizer.index1 + 1 : parent.rows[0].cells.length - 1;

			for (let i = 0; i < parent.rows[0].cells.length; i++) {
				resizer.sizes[i] = parent.rows[0].cells[i].offsetWidth;
			}
			for (let i = 0; i < parent.rows[0].cells.length; i++) {
				parent.rows[0].cells[i].width = resizer.sizes[i] + "px";
			}
		}
	}

	/**
	 * 添加操作方法
	 * @param btnClass 按钮的样式类名称，不含起首点
	 * @param action 方法
	 */
	action(btnClass: string, action: Function) {
		Helper.delegate(this.tbody, "click", btnClass, action);
	}

	get selectedData(): null {
		return null;
	}
}

class TableTitleBar {
	dom: HTMLDivElement;
	buttons: HTMLButtonElement[] = [];
	constructor(cfg: TitleBarCfg) {
		this.dom = document.createElement("div");
	}
}
