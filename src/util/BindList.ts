import {componentUid} from './Helper'




interface ItemRender {
    [renderName :string] : (val :string , index ?:number , row ?:any , srcName ?:string)=>string
}
interface ItemFilter {
    (row : any):boolean
}
export interface bindListOption {
	list?: any[];
    template?: string;
    mode ?: string;
	storeData?: boolean;
	itemRender?: ItemRender;
	itemFilter?: ItemFilter;
    nullShown?: string;
    joiner ?: string;
}

type BindCache = {
    name :string;
    render : Function;
    mode ?: string;
	itemRender?: ItemRender;
    itemFilter?: ItemFilter;
    joiner : string;
}

interface IBoundHash {
    [renderName :string] : BindCache
}

function makeCache(sets: bindListOption){
    let template = sets.template || '';
    const nullShown = sets.nullShown || "";
    const rnderFns = template.match(/\${\w+(:=)+\w+}/g);
    let renderEvalStr = 'row[":index"]=i;';

    if (rnderFns) {
        for (let fs = 0; fs < rnderFns.length; fs++) {
            let _attr = rnderFns[fs].substr(2, rnderFns[fs].length - 3);
            let _ndex = _attr.indexOf(":=");
            let keyName = _attr.substr(0, _ndex);
            renderEvalStr += `row['${_attr}']=scope['${_attr.substr(_ndex + 2)}'](row['${keyName}'] , i , row , '${keyName}');`;
        }
    }

    const pattern = /\${(\w*[:]*[=]*\w+)\}(?!})/g;
    const str = template.replace(pattern, function(match, key, i) {
        return `'+((row['${key}']===null||row['${key}']===undefined||row['${key}']===Infinity)?'${nullShown}':row['${key}'])+`;        
    });

    
    renderEvalStr += `var out='${str}'; return out;`;
    
    
    let cache :BindCache = { 
        name: template,
        render : new Function("row", "i", "scope", renderEvalStr),
        mode : sets.mode,
        itemRender : sets.itemRender,
        itemFilter : sets.itemFilter,
        joiner : sets.joiner || ''
    };

	return cache;
}

function removeCache(id:string) {
    delete boundHash[id];
}

// the setting cache for bindUrl and bindList use
const boundHash : IBoundHash = {
};


// bindList :
// 转义用： {{property}}
// 模板特定内置值  : {:index} 代入当前的nodeIndex，不受filter影响;  {:rowNum} 当前的行序号（此指受filter影响, 运行时产生，未必等于{:index}+1）
// sets.itemRender : 在每个function可依次传入3个参数： 属性值/当前索引值/当前整个listNode[i]的obj对象，必须返回string
// sets.itemFilter ：可在每行操作前，先对该 Node 对象做一些预先加工操作, 可接收2个参数 node/index ， 返回node
//                   也可以用这个对nodeList进行过滤，将满足过滤条件的node，返回false即可，
//                   后续的node 的{:index}不受过滤影响
// sets.mode     : append / prepend /after / before / and anyOther or undefined (default) is use html-replace
// sets.onBound  : [event]
// sets.joiner : 各个结果的连接字符，默认空
// sets.storeData : 是否将过滤后的绑定数组保存于jq对象的data("bound-array")当中
// set.nullShown : 将值为null的属性作何种显示，默认显示为empty string
export const bindList = function(_this_: HTMLElement, sets: bindListOption) {
	let cacheId = _this_.id || (function() {
                                    _this_.id = componentUid().toString();
                                    return _this_.id;
                                })();

	var cache = boundCache[cacheId] || {},
		template,
		list,
		itemRender,
		itemFilter,
		mode,
		storeData,
		storeArray;

	if (sets.push && sets.slice) {
		// 当先前已经设定过template的时候，
		// 可以只传入一个JSON list作参数以精简代码，
		// 而且render/filter/mode/event 均依照最近一次设定
		list = sets;
		itemRender = cache.itemRender;
		itemFilter = cache.itemFilter;
		mode = cache.mode;
		storeData = cache.storeData;
	} else {
		template = sets.template;

		if (template !== undefined && cache["name"] != template) {
			cache = boundCache.make(sets);
			boundCache[cacheId] = cache;
		}

		list = sets.list;
		if (!list || !list.length) list = [];
		itemRender = sets.itemRender || cache.itemRender;
		itemFilter = sets.itemFilter || cache.itemFilter;
		mode = sets.mode || cache.mode;
		storeData = !!sets.storeData;
	}

	var scope = itemRender || sets.renderScope || window,
		html = [],
		i = 0,
		nb = 0,
		rowObject,
		useFilter = typeof itemFilter === "function";

	if (storeData) storeArray = [];

	for (; (rowObject = list[i]); ) {
		//过滤data
		if (useFilter) rowObject = itemFilter(rowObject, i);

		//如果data没有被itemFilter过滤掉
		if (rowObject) {
			//行号
			rowObject[":rowNum"] = ++nb;
			//renderer
			html[i] = cache["render"](rowObject, i, scope);
			//如果要保存过滤后的对象数组
			if (storeData) storeArray.push(rowObject);
		}
		++i;
	}
	this[mode || "html"](html.join(cache["joiner"]));
	if (typeof cache.onBound === "function") {
		cache.onBound.call(this, list, sets);
	}

	if (storeData) this.data("bound-array", storeArray);
	return this;
};
