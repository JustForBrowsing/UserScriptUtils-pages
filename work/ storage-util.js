// ==UserLibrary==
// @name        StorageUtil
// @author      Me
// @version     0.1.0
// @description Support for persistent userscript storage
// ==/UserLibrary=
console.log(`%cStorageUtil: loading...`, 'color:#4060FF;');

////////////////////////////////////////////
//// Local Storage management classes

/* @class LocalStorageError
 *
 *
 * @example:
 *      throw new StorageValueError(<ScriptStorage obj>,
 *                                  <error msg string>,
 *                                  <stored value>,
 *                                  <raw javescript value>,
 *                                  <inner Error obj>)
 */
class ScriptStorageError extends UserscriptError {
    __storageName   = null;
    __storageObjRef = null;
    __storedValue   = null;
    __rawValue      = null;

    constructor(scriptStorageObj, message, storedValue = null, rawValue = null, innerError = null) {
        super('ScriptStorageError', message, innerError);
        this.__storageObjRef    = scriptStorageObj;
        this.__storedValue      = storedValue;
        this.__rawValue         = rawValue

    }

    #toString() {
        let innerErrorStr = '';
        try {
            if (this.innerError) {
                innerErrorStr = `, \ninnerError:${String(this.innerError)}, \ninnerErrorMessage:${this.innerError.message}, \ninnerErrorStack:${this.innerError.stack}`;
            }
        } catch (err) {
            //TODO: fix this error
            console.error(err);
            innerErrorStr = '<error parsing innerError>';
        }
        return `${super.toString()}, \nstorageName:'${this?.__storageName}', storageValue:'${this?.__value}', jsonString:'${this?.__json}'${innerErrorStr}`;
    }

    get [Symbol.toStringTag]() {
        return this.#toString();
    }

    toString() {
        return this.#toString();
    }
}

class StoredDataBase {
    #storageName    = '';
    get storageName() { return this.#storageName; }
    constructor(storageName) {
        this.#storageName = storageName;
    }
}

class DiscountFilterSettings extends StoredDataBase {
    discountFilter  = 75;
}

class ScriptStorage {
    #storagePrefix  = null;
    #cache          = null;

    constructor(storagePrefix, defaultData) {
        this.#storagePrefix = storagePrefix;
        this.#cache         = this.readDataBlock(defaultData);

    }

    // low-level read/save
    readDataBlock(defaultData) {

    }

    saveDataBlock(data) {
        try {
            localStorage.setItem(this.#storagePrefix, this.#cache);

        } catch (err) {
            console.error(`${appId}:ScriptStorage.saveDataBlock: err, this.#storagePrefix:'${this.#storagePrefix}', this.#cache:%o, err:${Support.buildInlineErrorStr(err)}`, this.#cache);
            throw new ScriptStorageError();
        }
    }

    static saveDiscountFilter(discountFilterValue) {
        //console.debug("saveDiscountFilter: discountFilterValue:" + discountFilterValue, LogLevel.Debug);
        try {
            localStorage.setItem(discountFilterStorageKey, discountFilterValue)

        } catch (err) {
            if (err.name === 'QuotaExceededError') {
                console.log(`StorageUtil:ScriptStorage.saveDiscountFilter: QuotaExceededError`);
                console.dir(err);
            } else {
                console.error(`StorageUtil:ScriptStorage.saveDiscountFilter: err, discountFilterStorageKey:'${discountFilterStorageKey}', discountFilterValue:${discountFilterValue}, err:${Support.buildInlineErrorStr(err)}`);
                console.error(`StorageUtil:ScriptStorage.saveDiscountFilter: err, dFV:${discountFilterValue}, err:${Support.buildInlineErrorStr(err)}`);
            }
        }
    }

    static readDiscountFilter(defaultValue = 0) {
        let newValue = parseInt(defaultValue);
        let storedValue = null;
        try {
            try {
                storedValue = localStorage.getItem(discountFilterStorageKey);
                if (storedValue) {
                    newValue = parseInt(storedValue, 10);
                }
            } catch (err) {
                console.error(`StorageUtil:ScriptStorage.readDiscountFilter: Either unable to read localStorage key ('${discountFilterStorageKey}') or unable to parse stored value ('${storedValue}'), err:${Support.buildInlineErrorStr(err)}`);
            }
            ScriptStorage.saveDiscountFilter(newValue); // save the default value into memory

        } catch (err) {
            console.error(`StorageUtil:ScriptStorage.readDiscountFilter: err, newValue:${newValue}, storedValue:'${storedValue}', err:`);
            console.dir(err);
        }
        return newValue;
    }

    static clearDiscountFilter() {
        localStorage.removeItem(this.discountFilterStorageKey);
    }

    // storage event handler
    onStorageEvent(storageEvent) {
    }
}


class StorageValue {
    #isItemDeleted      = false;
    #storedValueIndent  = null; // Set to null when not debugging
    #key                = null;
    #value              = null;
    #storageArea        = null;

    constructor(storageKey, initialValue = null, storageArea = null, debug = false) {
        if (storageArea != null && !StorageValue.isStorageAvailable(storageArea)) {
            throw new Support.StorageValueError(`StorageUtil:StorageValue.ctor: storageArea ('${storageArea}') is not available.`, 'storageArea', storageArea, null);
        }
        this.#storageArea = storageArea ?? localStorage ?? window?.localStorage;

        if (storageKey == null) {
            throw new Support.StorageValueError(`StorageUtil:DazLocalStorage.ctor: storageKey may not be null or blank.`, 'storageArea', String(storageArea), null);
        }
        this.#key = storageKey;

        if (debug) {
            this.#storedValueIndent = 2;
        }

        this.#value = this.#readValue() ?? initialValue;
        this.#writeValue();

        try {
            this.#storageArea.addEventListener('storage', this.onStorageEvent.bind(this));

        } catch(err) {
            throw new Support.StorageValueError(`StorageUtil:StorageValue.ctor: error while attempting to add listener to storageArea's 'storage' event.`, 'storageKey', String(storageKey), err);
        }
    }

    get isItemDeleted() { return this.#isItemDeleted; }

    get key()           { return this.#key; }

    get storageArea()   { return this.#storageArea; }

    get value() {
        if (this.isItemDeleted) {
            throw new Support.StorageValueError(`StorageUtil:StorageValue.value(get): cannot retrieve item value, item has been deleted.`, 'isItemDeleted', this.isItemDeleted, null);
        }
        return this.#value;
    }

    set value(newValue) {
        if (this.isItemDeleted) {
            throw new Support.StorageValueError(`StorageUtil:StorageValue.value(set): cannot set item value, item has been deleted.`, 'newValue', newValue, null);
        }

        if (newValue == null) {
            throw new Support.StorageValueError(`StorageUtil:StorageValue.value(set): cannot set item value to null, newValue:'${String(newValue)}'.`, 'newValue', newValue, null);

        } else {
            this.#value = newValue;
            this.#writeValue();
            this.#raiseChangeEvent(newValue);
        }
    }

    remove() {
        this.#isItemDeleted = true;
        this.#raiseChangeEvent(null);
        this.#removeValue();
    }

    refreshValue() {
        this.#value = this.#readValue();
        this.#writeValue();
    }

    #raiseChangeEvent(newValue) {
        const eventOptions = {
           detail: {
                key:        this.key,
                newValue:   newValue,
            },
        };
        const newEvent = new CustomEvent('change', eventOptions);
        this.dispatchEvent(newEvent);
    }

    onStorageEvent(storageEvent) {
        // storageEvent.key             the key for the item that changed (or null for clear)
        // storageEvent.newValue        the new value of the item
        // storageEvent.oldValue        the old value of the item
        // storageEvent.storageArea     a Storage object for the item affected
        // storageEvent.url             the url of the document whose storage changed
        if (storageEvent.storageArea !== this.#storageArea) {
            // It's not for us so just ignore it
            return;

        } else if (this.isItemDeleted) { // we are deleted, ignore events
            return;

        } else if (storageEvent.key === null || this.key.localeCompare(storageEvent.key)) {
            const newValue = storageEvent.newValue;
            const oldValue = storageEvent.oldValue;
            if (newValue === null && oldValue !== null) {        // deleted/cleared item
                if (!this.isItemDeleted) {
                    // recreate our key/value pair
                    this.#writeValue();
                }
            } else if (newValue !== null && oldValue === null) {  // new item
                // handle a new item (that has our key)
                this.value = newValue;

            } else if (newValue !== null && oldValue !== null) { // changed item
                // handle a changed item
                this.value = newValue;

            } else {
                // unexpected state (should have been handled by 'storage clear' state, above)
                console.error(`StorageUtil:StorageValue.onStorageEvent: unexpected state (should have been handled as a 'storage clear', newValue:'${newValue}', oldValue:'${oldValue}'.`);
            }
        }
    }

    #readValue() {
        let rawValue    = null;
        let realObj     = null;
        try {
            rawValue = this.storageArea.getItem(this.key);

            //TODO: convert value from safe value for storage to real object
            const realObj =  StorageValue.#decodeStoredData(rawValue?.value);
            return realObj;

        } catch(err) {
            if (err instanceof Support.ScriptStorageError) {
                return null;
            }
            throw new Support.StorageValueError(`StorageUtil:StorageValue.#readValue: unexpected error while getting or decoding value from storageArea key:'${this.key}'.`, 'rawValue', rawValue, null);
        }
    }

    #writeValue() {
        if (this.isItemDeleted) {
            throw new Error(`Cannot write value to storage area, item has been deleted.`);
        }
        const lastUpdatedOn = (new Date()).toISOString();
        //TODO: convert processedValue to a safe value for storage.
        let processedValue = null;
        try {
            processedValue = StorageValue.#encodeStoredData(this.value, this.#storedValueIndent);
            // processedValue = JSON.stringify(this.value,
            //                                 this._jsonReplacer.bind(this),
            //                                 this.#storedValueIndent);

        } catch(err) {
            throw new Support.StorageValueError(`StorageUtil:StorageValue.#writeValue: unexpected error while encoding value for storageArea key:'${this.key}'.`, 'value', this.value, err);
        }

        const storedValue = {
            lastUpdatedOn:  lastUpdatedOn,
            value:          processedValue,
        }
        try {
            this.storageArea.setItem(this.key, storedValue);

        } catch(err) {
            throw new Support.StorageValueError(`StorageUtil:StorageValue.#writeValue: unexpected error while attempting to set value of storageArea key:'${this.key}'.`, 'storedValue', storedValue, err);
        }
    }

    #removeValue() {
        try {
            this.storageArea?.removeItem(this.key);

        } catch (err) {
            // Best effort -- eat any errors
        }
    }

    static _jsonReplacer(key, val) {            // Minimal JSON replacer function for DEBUG only???
        if (key && Array.isArray(val)) {
            return `[array ${ val?.length }]`; // ${JSON.stringify(v.slice(0,5), null, 2)}`;

        } else if (key && (typeof val === 'string')) {
            return `[str ${ val?.length }]: ${ val?.slice(0,40) }`;

        }
        return val;
    }

    // Used when parsing JSON data to uncompress any compressed strings.
    static _jsonReviver(key, value, context) {
        // for primitive values only, context.source contains the original JSON string.
        if (value == null || typeof value != 'string') {
            return value;

        } else if (StorageValue.isValidBase64String(value)) { // Check if it's base64 encoded
            try {
                const decodedData = StorageValue.unpackBuffer(value); // Try decoding it
                if (decodedData == null) {
                    return value;
                }
                return decodedData;
                // try {
                //     return JSON.parse(decodedData);

                // } catch (err) {
                //     console.error(`${appId}:DazLocalStorage.jsonReviver: error parsing decoded JSON, err[${err?.name}]:${err}`);

                //     return value;
                // }

            } catch (err) {
                //DEBUG: fishing for the specific error
                console.debug(`StorageUtil:StorageValue.jsonReviver: error unpacking buffer, key:'${key}' = '${value?.slice(0, 40)}', err:${err}`);

                return value;         // Failed: assume it was not base64 encoded
            }
            return value;

        } else {
            return value;
        }
    }

    static clearAllStoredValues(storageArea) {
        storageArea.clear();
    }

    static #decodeStoredData(rawJsonValue) {
        return JSON.parse(rawJsonValue, StorageValue._jsonReviver);
    }

    static #encodeStoredData(objectData, indent) {
        return JSON.stringify(objectData, StorageValue._jsonReplacer, indent);
    }

    static isStorageAvailable(storageArea) {
        // storageArea = 'localStorage' | 'sessionStorage'
        let storage;
        try {
            storage = window[storageArea];
            const x = '__storage_test__';
            storage.setItem(x, x);  // These will throw if storage doesn't work
            storage.getItem(x);
            storage.removeItem(x);
            return true;

        } catch (err) {
            return (err instanceof DOMException &&
                    (err.code ===   22 || // everything except Firefox
                     err.code === 1014 || // Firefox
                     // test name field too, because code might not be present
                     err.name === 'QuotaExceededError' ||          // everything except Firefox
                     err.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // Firefox
                     // acknowledge QuotaExceededError only if there's something already stored
                     storage && // Firefox
                     storage.length !== 0 );
        }
    }
}
