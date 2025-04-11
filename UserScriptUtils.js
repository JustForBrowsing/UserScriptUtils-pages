// ==UserLibrary==
// @name            UserScriptUtils
// @author          Me
// @version         0.1.4
// @description     Adds functionality to the Daz3D web site
// ==/UserLibrary==

// Dependencies: Daz3D

const UserScriptUtils = {};

try {
    const libId = "UserScriptUtils";
    
    const stringify = import('https://justforbrowsing.github.io/UserScriptUtils-pages/safe-stable-stringify.js');
    // sha256-a5E39POhbT6DD5luKTj1YnfhrIsn84ac6BN8s2kWKlc=

    const DateMax = new Date( 8640000000000000); // +275760-09-13T00:00:00.000Z (275,760 AD)
    const DateMin = new Date(-8640000000000000); // -271821-04-20T00:00:00.000Z (271,822 BCE)
    const validJsonStartRe: new RegExp(/^\s*("?(\d+|[^a-zA-Z0-9]true\s|[^a-zA-Z0-9]false\s)"?)|\{|\[|""/, 'i');
    //static numberRe = /(?:(?<currency>\$)[\t ]*)?([+-]?(?:[0-9,]*[.])?[0-9]+)(?:[\t ]*(?<percentage>\%))?/i;
    const numberRe = /(?:\$[\t ]*)?([+-]?(?:[0-9,]*[.])?[0-9]+)(?:[\t ]*\%)?/i;
    /* This comment fixes the incorrect syntax highlighting (bug) caused by the string above. */
    
    console.log(`%cUserScriptUtils: loading...`, 'color:#4060FF;');
    console.log(`%cUserScriptUtils: window.GM_info:`, 'color:#4060FF;', window?.GM_info);
    console.log(`%cUserScriptUtils: window.GM_info.script:`, 'color:#4060FF;', window?.GM_info?.script);
    console.log(`%cUserScriptUtils: window.GM_info.script.name:`, 'color:#4060FF;', window?.GM_info?.script?.name);
    /* DEPENDANCIES:
        1) Imports (@requires)
            Include the following lines in the ==UserScript== block of your main User Script.
            The 'require' for UserScriptUtils.js MUST be LAST.
                
            // @require     https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js#sha256-bfOAXaBm8tuuqlR7TKg/pcfBDKi2ukNXsIl788w7mh8=
            // @require     https://cdn.jsdelivr.net/npm/eruda-code@2.2.0/eruda-code.min.js#sha256-QKv2Ow4Dvamh4teg/CpaSA0drpNKyqVUDv4bn0J8a78=
            // @require     https://cdn.jsdelivr.net/npm/eruda-monitor@1.1.1/eruda-monitor.min.js#sha256-7HNTeKKc32BEABLUmFkVDlDwYVIStEWenCnBfRSkaM4=
            // @require     https://cdn.jsdelivr.net/npm/eruda-timing@2.0.1/eruda-timing.min.js#sha256-PP95GJLgXsyqfEWOWl9d2DPDsoqUBl54vtczCjmS0Q0=
            
           ???:
            // @require     https://raw.githubusercontent.com/JustForBrowsing/UserScriptUtils/refs/heads/main/UserScriptUtils.js
            
        2) Globals
            Declare all imports you plan to use as globals for ESLint 
            Add any addition names needed for your script.
            These should be included just AFTER the ==UserScript== block in your main User Script.
            
            // global AddEruda, USU
            // global eruda, erudaCode, erudaMonitor, erudaTiming
    
        3) Grants (FUTURE)
            Include the following lines in the ==UserScript== block of your main User Script.
            
            // @grant       GM_getValue
            // @grant       GM_setValue
            // @grant       GM_addStyle
    */

    function _buildInlineErrorStr(errorIn) {
        if (errorIn == null) {
            return `error:<buildInlineErrorStr: error input was null>`;
        }
        const localError = errorIn.clone(); // preserve original error
        if (localError instanceof Error) {
            let errorName  = localError?.name ?? "<name not available>";
            let errorMsg   = localError?.message ?? "<no message>";
            
            let errorStack = localError?.stack
            
            return `error:${localError},\nmessage:${localError?.message},\nstack:${localError?.stack}`;
    
        } else {
            const typeOfErrorIn = typeof errorIn;
            
            
            
            
            
            let errorType = typeOfErrorIn === 'object'
            					? localError?.constructor?.name ?? localError?.name
								: 
            const objNameStr = '/' + ('object' === errorInType) ?
                                      localError?.constructor?.name :
                                      '';
            return `error:'${String(localError)} [${errorInType}${objNameStr}]'`;
        }
    }

    /** Internal method implementing {@link injectStyleBlock} and {@link injectStyleUrl}
      */
    function _injectStyleCore(cssStringOrElem, styleAttr, styleBlockType, parentElemParam) {
        if (cssStringOrElem == null) {
            return null;
        }
    
        const parentBlockElem = parentElemParam ?? document.getElementsByTagName('head')[0];
        if (parentBlockElem == null) {
            const errStr = `${libId}:_injectStyleCore: parentBlockElem not found:'${parentBlockElem}', document.getElementsByTagName('head')[0]:'${document.getElementsByTagName('head')[0]}', parentElemParam:'${parentElemParam}', styleBlockType:'${styleBlockType}'`;
            console.error(errStr);
            throw new Error(errStr);
        }
    
        // Check to see if it already exists
        let cssStyleBlockElem = styleAttr?.id == null ? null : document.getElementById(styleAttr.id);
        if (cssStyleBlockElem == null) {
            try {
                const styleElem = document.createElement(styleBlockType);
                for(const [attr, val] of Object.entries(styleAttr)) {
                    styleElem.setAttribute(attr, val);
                }
                if (cssStringOrElem instanceof Node) {
                    styleElem.replaceChildren(cssStringOrElem);
                } else {
                	styleElem.textContent = cssStringOrElem;
                }
                parentBlockElem.appendChild(styleElem);
    
            	cssStyleBlockElem = styleAttr?.id == null ?
                                        null :
                                        document.getElementById(styleAttr.id);
    
            } catch (err) {
                const styleIdStr = styleAttr?.id == null ? '' : ` with id:'${styleAttr.id}'`;
                /* This comment fixes the incorrect syntax highlighting caused by the string above. */
    
                console.error(`${libId}:_injectStyleCore: error while inserting style${styleIdStr}, styleBlockType:'${styleBlockType}', err:${_buildInlineErrorStr(err)}`);
                throw err;
            }
        }
        return cssStyleBlockElem;
    }
    
    /** Internal method implementing {@link injectScriptString} and {@link injectScriptUrl}
      */
	function _injectScriptCore(jsInput, scriptAttr = null, parentElemParam = null) {
        if (jsInput == null) {
            return null;
    	}
        let parentBlockElem = parentElemParam ?? document.body;
        if (parentBlockElem == null) {
        	const errStr = `${libId}:_injectScriptCore: parentBlockElem not found:'${parentBlockElem}', document.body:'${document?.body}', parentElemParam:'${parentElemParam}'`;
            console.error(errStr);
            throw new Error(errStr);
        }
        let scriptBlockElem = scriptAttr?.id == null ? null : document.getElementById(scriptAttr.id);
        if (scriptBlockElem == null) {
            try {
                const scriptElem = document.createElement('script');
                for(const [attr, val] of Object.entries(scriptAttr)) {
                    if (val !== undefined) {
                        scriptElem.setAttribute(attr, val);
                    }
                }
                if (jsInput instanceof Node) {
                    scriptElem.replaceChildren(jsInput);
            
                } else {
                    // scriptElem.innerHTML = jsInput;
                    scriptElem.textContent = jsInput;
                }
                parentBlockElem.appendChild(scriptElem);
            
                scriptBlockElem = scriptAttr?.id == null ?
                                    	null :
                                        document.getElementById(scriptAttr.id);
            } catch (err) {
                const scriptIdStr = scriptAttr?.id == null ? '' : ` with id:'${scriptAttr.id}'`;
                console.error(`${libId}:_injectScriptCore: error while inserting script${scriptIdStr}, err:${_buildInlineErrorStr(err)}`);
                throw err;
            }
        }
        return scriptBlockElem;
    }
            
    // I can't remember why I wanted/needed this...
    // (I think it's some kind of 'fix' for iPad Safari):
    document.addEventListener("touchstart", function() {}, false);
    
    UserScriptUtils = {
        initialize: function initialize() {

        },
    	buildInlineErrorStr: function buildInlineErrorStr(errorIn) {
            return _buildInlineErrorStr(errorIn);
        },
        //// generate-selector
        //   adapted [to not be a module :)] from
        //    https://www.jsdelivr.com/package/npm/@jcsj/generate-selector?tab=files&path=lib
        /**
         * @param elem
         * Note that CSS nth-child starts at 1
         * @see https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child#syntax
         */
        gsIndexOf: function gsIndexOf(elem) {
            let i = 1;
            for (const child of elem.parentElement.children) {
                if (elem.isSameNode(child)) {
                    return i;
                }
                i++;
            }
        },
        gsNthChild: function gsNthChild(l) {
            return `${l.tagName}:nth-child(${gsIndexOf(l)})`;
        },
        /**
         * Based on: https://stackoverflow.com/questions/8588301/how-to-generate-unique-css-selector-for-dom-element
         * @param {Element} ancestor stops here, defaults to `document.body`
         */
        generateSelector: function generateSelector(elem, ancestor = document.body) {
            let path = [], parent;
            while (parent = elem.parentElement) {
                if (ancestor.isSameNode(parent)) {
                    break;
                }
                if (elem.id && !elem.id.includes('.')) {
                    path.push("#" + elem.id);
                    break;
                }
                path.push(gsNthChild(elem));
                elem = parent;
            }
            return path
                .reverse()
                .join(' > ');
        },
        
        sessionStorageGet: function sessionStorageGet(key, displayErrors = null) {
            displayErrors = displayErrors ?? true;
            let value = null;
            try {
                let rawValue = sessionStorage.getItem(key);
                if (rawValue != null && USU.validJsonStartRe.test(rawValue)) {
                    value = JSON.parse(rawValue);
                } else {
                    value = rawValue;
                }
            } catch (err) {
                if (displayErrors) {
                    console.error(`${libId}:sessionStorageGet: Error, err:${_buildInlineErrorStr(err)}`);
                }
                value = null;
            }
            return value;
        },
    
        sessionStoragePut: function sessionStoragePut(key, value, displayErrors = null) {
            displayErrors = displayErrors ?? false;
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
            } catch (err) {
                if (displayErrors) {
                    console.error(`${libId}:sessionStoragePut: Error, err:${_buildInlineErrorStr(err)}`);
                }
            }
        },
    
        /*
         * @example
         *      injectStyleBlock(cssString, 'new-css-block-id')
         */
        injectStyleBlock: function injectStyleBlock(cssStringOrElem,
                                styleBlockId = null,
                                styleAttributes = null,
                                parentElem = null) {
            if ('object' === typeof styleBlockId && styleAttributes == null) {
                styleAttributes = styleBlockId;
                styleBlockId    = null;
            }
            const styleAttr = Object.assign({}, { id: styleBlockId }, styleAttributes);
            return _injectStyleCore(cssStringOrElem, styleAttr, 'style', parentElem);
        },
    
        /*
         * @example
         *      injectStyleUrl('https://someCdn.com/path/some.css', 'new-css-block-id')
         */
        injectStyleUrl: function injectStyleUrl(cssUrl,
                              styleBlockId = null,
                              styleAttributes = null,
                              parentElem = null) {
            if ('object' === typeof styleBlockId && styleAttributes == null) {
                styleAttributes = styleBlockId;
                styleBlockId    = null;
            }
            const styleAttr = Object.assign({},
                                            {   id: styleBlockId,
                                              href: cssUrl, },
                                            styleAttributes);
            return _injectStyleCore(null, styleAttr, 'link', parentElem);
        },
    

        /*
         * @example
         *      injectScriptBlock(javascriptCodeString, 'new-script-block-id')
         */
        injectScriptBlock: function injectScriptBlock(jsStringOrElem,
                                 scriptBlockId = null,
                                 scriptAttributes = null,
                                 parentElem = null) {
            if ('object' === typeof scriptBlockId && scriptAttributes == null) {
                scriptAttributes = scriptBlockId;
                scriptBlockId    = null;
            }
            const scriptAttr = Object.assign({},
                                             {   id: scriptBlockId,
                                               type: 'text/javascript', },
                                             scriptAttributes);
            return _injectScriptCore(jsStringOrElem, scriptAttr, parentElem);
        },
    
        /*
         * @example
         *      injectScriptUrl('https://someCdn.com/path/some.js', 'new-script-block-id')
         */
        injectScriptUrl: function injectScriptUrl(scriptUrl,
                               scriptBlockId = null,
                               scriptAttributes = null,
                               parentElem = null) {
            if ('object' === typeof scriptBlockId && scriptAttributes == null) {
                scriptAttributes = scriptBlockId;
                scriptBlockId    = null;
            }
            const scriptAttr = Object.assign({},
                                             {   id: scriptBlockId,
                                                src: scriptUrl     },
                                             scriptAttributes);
            return _injectScriptCore(null, scriptAttr, parentElem);
        },
    

        localeStartsWith: function localeStartsWith(testString, startingString, localeOptions = null) {
            const safeStartingString = String(startingString);
            return String(testString).slice(0, safeStartingString.length)
                                     .localeCompare(safeStartingString, localeOptions ?? {});
        },
    
        caseInsensitiveCompare: function caseInsensitiveCompare(stringA, stringB) {
            if (stringA === stringB || (stringA == null && stringB == null)) {
                return 0;
            } else if (stringA == null) {
                return 1;
            } else if (stringB == null) {
                return -1;
            }
            return stringA.localeCompare(stringB, { sensitivity: 'accent' });
        },
    
        indentString: function indentString(str, count, indent = ' ') {
            return str.replace(/^/gm, indent.repeat(count));
        },
    
        indentOverflow: function indentOverflow(str, count, indent = ' ') {
            return this.indentString(str, count, indent).trim();
        },
    
        /*
        static tagIdentity = (strings, ...values) =>
                                  String.raw({ raw: strings }, ...values);
        */
        
        tagIdentity: function tagIdentity(strings, ...values) {
            let newStr = '';
            for (let i = 0; i < strings.length; i++) {
                if (i > 0) {
                    newStr += values[i-1];
                }
                newStr += strings[i];
            }
            return newStr;
        },
    
        parseInteger: function parseInteger(nodeValue) {
            let value = null;
            try {
                if (nodeValue == null) {
                     value = null;
                } else {
                    let newVal = nodeValue;
                    if (newVal.startsWith('$')) { // strip leading '$'
                        newVal = newVal.substring(1);
                    }
                    if (newVal.endsWith('%')) {   // strip trailing '%'
                        newVal = newVal.slice(0, -1);
                    }
                    value = parseInt(newVal);
                }
            } catch (err) {
                if (this.freeRegex.test(nodeValue)) {
                    value = 100;
                } else {
                    value = null;
                }
            }
            return value;
        },
    
        parseFloat: function parseFloat(nodeValue) {
            let value = null;
            try {
                if (nodeValue == null) {
                     value = null;
                } else {
                    let newVal = nodeValue;
                    if (newVal.startsWith('$')) { // strip leading '$'
                        newVal = newVal.substring(1);
                    }
                    if (newVal.endsWith('%')) {   // strip trailing '%'
                        newVal = newVal.slice(0, -1);
                    }
                    value = parseFloat(newVal);
                }
            } catch (err) {
                if (this.freeRegex.test(nodeValue)) {
                    value = 100;
                } else {
                    value = null;
                }
            }
            return value;
        },
    
        /** Get text from only the supplied parentNode and not from any of its child nodes (i.e., concatenate the contents of all parentNode child nodes of type TEXT_NODE).
         *  @param  parentNode {Node|null}   The element you want to extract the text from.
         *  @return            {string|null} The extracted text (or null is the input was null).
         *  @note adapted from https://stackoverflow.com/a/3538551
         *  @example
         *      let nodeStr = USL.getFirstText(document.getElementById('someTextNodeId'));
         */
        getFirstText: function getFirstText(parentNode) {
            if (parentNode == null) {
                return null;
            }
            return [].reduce.call(parentNode.childNodes, function(a, b) { return a + (b.nodeType === Node.TEXT_NODE ? b.textContent : ''); }, '');
            // Node.TEXT_NODE === 3
        },
    
        /** Extracts the first decimal number from the string (does not support exponential notation).
         *  @return {RegExpMatch|null}    The extracted text (or null is the input was null).
         *  @note adapted from https://stackoverflow.com/a/3538551
         *  @example
         *      const priceMatch = numberRe.exec('The price is $3.14 right now.');
         *      if (priceMatch != null) {
         *          console.log(priceMatch[0]);             // '$3.14'
         *          console.log(priceMatch[1]);             // '3.14'
         *          console.log(priceMatch['currency']);    // '$'
         *          console.log(priceMatch['percentage']);  // null
         *      }
         *  @example
         *      const priceMatch = numberRe.exec('The price is 47% off today!');
         *      if (priceMatch != null) {
         *          console.log(priceMatch[0]);             // '47%'
         *          console.log(priceMatch[1]);             // '47'
         *          console.log(priceMatch['currency']);    // null
         *          console.log(priceMatch['percentage']);  // '%'
         *      }
         *  @example
         *      const priceMatch = numberRe.exec('234,567.123');
         *      if (priceMatch != null) {
         *          console.log(priceMatch[0]);             // '234,567.123'
         *          console.log(priceMatch[1]);             // '234567.123'
         *          console.log(priceMatch['currency']);    // null
         *          console.log(priceMatch['percentage']);  // null
         *      }
         */

        parseRawNumber: function parseRawNumber(rawStr, freeValue = 0.0) {
            if (rawStr == null) {
                return null;
            }
    
            const rawStrType = typeof rawStr;
            if ('object' === rawStrType && rawStr instanceof Node) {
                rawStr = this.getFirstText(rawStr);
    
            } else if ('number' === rawStrType) {
                return rawStr;
    
            } else if ('string' !== rawStrType) {
                console.error(`${libId}:parseRawNumber: rawStr type is not number, string, or Node (type:'${rawStrType}'), rawStr:'${rawStr}'.`, rawStr);
                return null;
            }
    
            if (rawStr.toLowerCase().indexOf('free') >= 0) { // simple free check (improve??)
                return freeValue;
    
            } else {
                return parseFloat(this.numberRe.exec(rawStr)?.[1]);
            }
        },
    
        addMillisecondsToNow: function addMillisecondsToNow(timeOffsetMs) {
            if (timeOffsetMs == null) {
                return null;
            } else if (!isFinite(timeOffsetMs)) {
                // Convert either Infinity to max/min dates
                return timeOffsetMs >= 0 ? this.DateMax : this.DateMin;
            }
            let resultDate = new Date();
            resultDate.setTime(resultDate.getTime() + timeOffsetMs);
            return resultDate;
        },
    
        rectangleToString: function rectangleToString(rect) {
            if (rect == null) {
                return null;
            } else {
                return `rect[${rect.top.toFixed(2)},${rect.left.toFixed(2)};${rect.height.toFixed(2)}x${rect.width.toFixed(2)}]`;
            }
        },
    
        // insertAdjacentHTML that returns inserted element
        insertAdjacentHTML: function insertAdjacentHTML(relativeElement, position, html) {
            try {
                relativeElement.insertAdjacentHTML(position, html);
                let insertedElement;
                switch(position) {
                    case 'beforestart':
                        insertedElement = relativeElement.previousSibling;
                        break;
                    case 'afterstart':
                        insertedElement = relativeElement.firstChild;
                        break;
                    case 'beforeend':
                        insertedElement = relativeElement.lastChild;
                        break;
                    case 'afterend':
                        insertedElement = relativeElement.nextSibling;
                        break;
                }
                return insertedElement;
            } catch(err) {
                if (err?.name === 'NoModificationAllowedError') {
                    throw err;
                } else if (err?.name === 'NoModificationAllowedError') {
                    throw err;
                } else if (err instanceof DOMException) {
                    throw err;
                } else {
                    throw err;
                }
            }
        },
    
        insertAdjacentWithId: function insertAdjacentWithId(blockId, relativeElement, position, html) {
            let blockElement = document.getElementById(blockId);
            if (blockElement == null) {
                relativeElement.insertAdjacentHTML(position, html);
                blockElement = document.getElementById(blockId);
                if (blockElement == null) {
                    console.error(`${libId}:insertAdjacentWithId: unable to create block with id:'${blockId}'`);
                }
            }
            return blockElement;
        },
    
        assemblePrototypeChainGraph: function assemblePrototypeChainGraph(value) {
            let result = '';
            let depth = 0;
    
            while (value = Object.getPrototypeOf(value)) {
                result = [
                    result,
                    '\n',
                    Array(depth++).fill('  ').join(''),
                    '=> ',
                    value.constructor.name,
                ].join('');
            }
            return result;
        },
    
        /**
         * @param {String} HTML representing a single element.
         * @param {Boolean} flag representing whether or not to trim input whitespace, defaults to true.
         * @return {Element | HTMLCollection | null}
         * @note From https://stackoverflow.com/a/35385518
         */
        fromHTML: function fromHTML(html, trim = true) {
            // Process the HTML string.
            html = trim ? html.trim() : html;
            if (!html) {
                return null;
            }
    
            // Then set up a new template element.
            const template     = document.createElement('template');
            template.innerHTML = html;
            const result       = template.content.children;
    
            // Then return either an HTMLElement or HTMLCollection,
            // based on whether the input HTML had one or more roots.
            if (result.length === 1) {
                return result[0];
            }
            return result;
        },
    
        /*
        : function getCssListItemSelector(elem, listSelector, listElement = null) {
            if (elem == null) {
                return '<null>';
            } else if (!elem instanceof HTMLElement) {
                return '<not elem>';
            } else if (elem.closest(listSelector)) {
                const listItemSel = CssSelectorGenerator.getCssSelector(elem, {
                    root: listElement ?? document.body,
                });
                return "ListItem:" + listItemSel;
            }
            return CssSelectorGenerator.getCssSelector(elem);
        },
        */
        
        // From: https://github.com/aglines/search_ddg_customdaterange
        observeDocument: function observeDocument(callback) {
            callback(document.body);
    
            const observe = (observer) => observer.observe(document.body, {
                childList: true, subtree: true,
                attributes: false, characterData: false
            });
    
            const observer = new MutationObserver(function (mutations) {
                if (mutations.length) {
                    observer.disconnect()
                    callback(mutations, observer);
    
                    observe(observer);
                }
            });
    
            observe(observer);
        },
    
        // From: https://github.com/aglines/search_ddg_customdaterange
        elementReady: function elementReady(selector, timeoutInMs = -1) {
            return new Promise((resolve, reject) => {
                const getter = 'function' === typeof selector ?
                    () => selector() :
                    () => document.querySelectorAll(selector)
                ;
                const els = getter();
                if (els && els.length) {
                    resolve(els[0]);
                }
                if (timeoutInMs > 0) {
                    var timeout = setTimeout(() => {
                        reject(`elementReady(${selector}) timed out at ${timeoutInMs}ms`);
                        console.debug(`${libId}:elementReady(${selector}) timed out at ${timeoutInMs}ms`);
                    }, timeoutInMs);
                }
    
                new MutationObserver((mutationRecords, observer) => {
                    Array.from(getter() || []).forEach((element) => {
                        clearTimeout(timeout);
                        resolve(element);
                        observer.disconnect();
                    });
                }).observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            });
        },
    
    };
} finally {
	console.log(`%cUserScriptUtils: loaded.`, 'color:#4060FF;');
} catch (wrapErr) {
    
    //window?.alert(wrapErr);
    const errType = wrapErr?.name ?? typeof wrapErr;
    const errLoc = `[${wrapErr?.fileName}:${wrapErr?.lineNumber}:${wrapErr?.columnNumber}]`;
    const errMsg = `UserScriptUtils:Unhandled Error ${errLoc}: ${errType}, ${wrapErr?.message} (cause:'${wrapErr?.cause}'), stack: ${wrapErr?.stack}`;
    window?.console.error(errMsg);
    //window?.alert(errMsg);
}
//})();













