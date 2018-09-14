let seed = 0;

export const componentUid = function(): number {
	return ++seed;
};

/// https://github.com/unclechu/node-deep-extend
function isSpecificValue(val: any) {
	return val instanceof Date || val instanceof RegExp ? true : false;
}

function cloneSpecificValue(val: any) {
	if (val instanceof Date) {
		return new Date(val.getTime());
	} else if (val instanceof RegExp) {
		return new RegExp(val);
	} else {
		throw new Error("Unexpected situation");
	}
}

/**
 * Recursive cloning array.
 */
export const deepCloneArray = function(arr: any[]): any[] {
	var clone: any[] = [];
	arr.forEach(function(item, index) {
		if (typeof item === "object" && item !== null) {
			if (Array.isArray(item)) {
				clone[index] = deepCloneArray(item);
			} else if (isSpecificValue(item)) {
				clone[index] = cloneSpecificValue(item);
			} else {
				clone[index] = deepExtend({}, item);
			}
		} else {
			clone[index] = item;
		}
	});
	return clone;
};

function safeGetProperty(object: any, property: string) {
	return property === "__proto__" ? undefined : object[property];
}

export function deepExtend<T>(extendTarget: T, ...args: any[]): T {
	if (arguments.length < 1 || typeof arguments[0] !== "object") {
		throw new Error("no object to deep extend.");
	}

	if (arguments.length < 2) {
		return deepExtend({} as T, arguments[0]);
	}

	let target = extendTarget as any;

	let val, src;

	args.forEach(function(obj) {
		// skip argument if isn't an object, is null, or is an array
		if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
			return;
		}

		Object.keys(obj).forEach(function(key) {
			src = safeGetProperty(target, key); // source value
			val = safeGetProperty(obj, key); // new value

			// recursion prevention
			if (val === target) {
				return;

				/**
				 * if new value isn't object then just overwrite by new value
				 * instead of extending.
				 */
			} else if (typeof val !== "object" || val === null) {
				target[key] = val;
				return;

				// just clone arrays (and recursive clone objects inside)
			} else if (Array.isArray(val)) {
				target[key] = deepCloneArray(val);
				return;

				// custom cloning and overwrite for specific objects
			} else if (isSpecificValue(val)) {
				target[key] = cloneSpecificValue(val);
				return;

				// overwrite by new value if source isn't object or array
			} else if (typeof src !== "object" || src === null || Array.isArray(src)) {
				target[key] = deepExtend({}, val);
				return;

				// source value and new value is objects both, extending...
			} else {
				target[key] = deepExtend(src, val);
				return;
			}
		});
	});

	return target;
}

export const Is = {
	Array: function(obj: any): boolean {
		return Object.prototype.toString.call(obj) == "[object Array]";
	},
	RegExp: function(obj: any): boolean {
		return Object.prototype.toString.call(obj) == "[object RegExp]";
	},
	Date: function(obj: any): boolean {
		return Object.prototype.toString.call(obj) == "[object Date]";
	},
	Number: function(obj: any): boolean {
		return Object.prototype.toString.call(obj) == "[object Number]";
	},
	String: function(obj: any): boolean {
		return Object.prototype.toString.call(obj) == "[object String]";
	},
	Object: function(obj: any): boolean {
		return Object.prototype.toString.call(obj) == "[object Object]";
	},
	HTMLDocument: function(obj: any): boolean {
		return Object.prototype.toString.call(obj) == "[object HTMLDocument]";
	}
};

export const jsonPath =  function  (src: any, path ?: string): any {
	if (!path) {
		return src;
	} 
	else {
		let arr = path.split('.');
		let props = `["${arr.join('"]["')}"]`; 
		return eval(`(src${props})`);
	}
};
