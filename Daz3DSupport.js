

/*
// ==UserLibrary==
// @name            Daz3DSupport
// @author          Me
// @version         0.1.1
// @description     Adds functionality to the Daz3D web site
// ==/UserLibrary==
// Dependancies: Daz3DEnumerations
*/
console.log(`%cDaz3DSupport: loading...`, 'color:#4060FF;');
/*
 * static class with Daz related support functions
 */


class DazMeta {
    static DiscountRegEx = new RegExp(/-?(\d+)\s?\%/, 'i');

    #toString()                 { return `DazMeta[You Can't Handle The Meta]`; }
    get [Symbol.toStringTag]()  { return this.#toString(); }
    toString()                  { return this.#toString(); }

    static defaultBreakpointPct     = initialMinDiscount;
    static defaultMaxDiscountScale  = 150.0;
    static defaultMinDiscountScale  = 75.0;

    static _currentPageListType     = null;

    static get base64regex() {
        return new RegExp(`^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$`, 'i');
    }
    static #dazPlusDiscountList = Array.from([
        { tokens: 0, normalItemPct:  0, dazOriginalItemPct:  0 },
        { tokens: 1, normalItemPct:  7, dazOriginalItemPct:  7 },
        { tokens: 2, normalItemPct: 13, dazOriginalItemPct: 13 },
        { tokens: 3, normalItemPct: 18, dazOriginalItemPct: 18 },
        { tokens: 4, normalItemPct: 22, dazOriginalItemPct: 22 },
        { tokens: 5, normalItemPct: 25, dazOriginalItemPct: 25 },
        { tokens: 6, normalItemPct: 27, dazOriginalItemPct: 30 },
        { tokens: 7, normalItemPct: 29, dazOriginalItemPct: 35 },
        { tokens: 8, normalItemPct: 30, dazOriginalItemPct: 45 },
    ]);

    static highlightInvalidClass = 'd3d-invalid';
    // Settings, for ref: 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 40, 25, 1, -1
    static #cssClassToHighlightParmsObj = Object.freeze(_.mapValues(
        {
    'd3d-free'   :{  pct:100, flags:5,   fgColor:'#ddd',  bgColor:'#000',  outline:'{sz} dashed #f00',
                   ftWgt:1.0,  ftSz:1.0,  olMult:1.00,     bdMult:1.00,     border:'{sz} solid  #00f'},
    'd3d-95th'   :{  pct: 95, flags:5,   fgColor:'#c00',  bgColor:'#ddd',  outline:'{sz} dashed #f00',
                   ftWgt:1.0,  ftSz:1.0,  olMult:1.00,     bdMult:1.00,     border:'{sz} solid  #333'},
    'd3d-highest':{  pct: 90, flags:4,   fgColor:'#c00',  bgColor:'#ddd',  outline:'{sz} dashed #f00',
                   ftWgt:1.0,  ftSz:1.0,  olMult:1.00,     bdMult:1.00,     border:'{sz} solid  #333'},
    'd3d-high'   :{  pct: 80, flags:3,   fgColor:'#000',  bgColor:'#ff0',  outline:'{sz} dashed #ff0',
                   ftWgt:1.0,  ftSz:1.0,  olMult:0.75,     bdMult:1.00,     border:'{sz} solid  #333'},
    'd3d-medium' :{  pct: 70, flags:2,   fgColor:'#000',  bgColor:'#f80',  outline:'{sz} dashed #f80',
                   ftWgt:1.0,  ftSz:1.0,  olMult:0.50,     bdMult:1.00,     border:'{sz} solid  #333'},
    'd3d-normal' :{  pct: 60, flags:1,   fgColor:'#000',  bgColor:'#f80',  outline:'{sz} dotted #f80',
                   ftWgt:1.0,  ftSz:1.0,  olMult:0.50,     bdMult:1.00,     border:'{sz} solid  #333'},
    'd3d-half'   :{  pct: 50, flags:0,   fgColor:'#0f3',  bgColor:'unset', outline:'{sz} none #888',
                   ftWgt:1.0,  ftSz:1.0,  olMult:0.00,     bdMult:0.00,     border:'{sz} none #888'},
    'd3d-zero'   :{  pct:  1, flags:0,   fgColor:'unset', bgColor:'unset', outline:'{sz} none #888',
                   ftWgt:1.0,  ftSz:1.0,  olMult:0.00,     bdMult:0.00,     border:'{sz} none #888'},
    'd3d-filter' :{  pct: -1, flags:1,   fgColor:'',      bgColor:'',      outline:'{sz} none #888',
                   ftWgt:1.0,  ftSz:1.0,  olMult:1.00,     bdMult:1.00,     border:'{sz} none #888'},
    'd3d-invalid':{  pct:-99, flags:0,   fgColor:'#FFF',  bgColor:'#606',  outline:'{sz} dotted #F4F',
                   ftWgt:1.0,  ftSz:1.0,  olMult:2.00,     bdMult:2.00,     border:'{sz} none #F4F'},
        },
        function (val, key, object) { // Augment the base objects with the key, validity, & helpers
            return Object.assign(val, {
                class: key,
                valid: (key != DazMeta.highlightInvalidClass),
                makeOutline: function makeOutline(cssSize) {
                    const sizeStr = Number.isFinite(cssSize) ? `${cssSize}px` : cssSize;
                    return this.outline.replace(/{sz}/g, sizeStr);
                },
                makeBorder:  function makeBorder(cssSize) {
                    const sizeStr = Number.isFinite(cssSize) ? `${cssSize}px` : cssSize;
                    return this.border.replace(/{sz}/g, sizeStr);
                },
            }); // assign
        }) // mapValues
    ); // freeze

    // list (array) of all cssClassToHighlightParmsObj CSS classes (keys)
    static #discountHighlightClasses = Object.keys(this.#cssClassToHighlightParmsObj);
    static #tokensToDiscountMap;                // map from tokenCount to Daz discount info
    static #discountToHighlightClassList;       // sorted map from discountPct to highlightClassList

    static get discountHighlightClasses()   { return this.#discountHighlightClasses; }
    static get dazPlusDiscountList()        { return this.#dazPlusDiscountList; }

    static getDazPlusDiscount(tokens) {
        const tokensClamped = Math.max(Math.min(tokens, 0), 8);
        return this.#tokensToDiscountMap.get(tokensClamped);
    }

    static getDiscountClass(discountPct) {
        const localDiscountPct = discountPct;
        let index;
        if (this.#discountToHighlightClassList &&
            Array.isArray(this.#discountToHighlightClassList)) {
            index = this.#discountToHighlightClassList.findIndex(([pct, hlClass]) => {
                return localDiscountPct < pct;
            });

            // Clamp to valid index [??this may not be required??]
            index = Math.min(Math.max(0, index), this.#discountToHighlightClassList.length - 1);
            return this.#discountToHighlightClassList[index][1];

        } else {
            return this.highlightInvalidClass;
        }
    }

    static getHighlightInfo(discountPct) {
        let highlightClass = null;
        try {
            highlightClass = this.getDiscountClass(discountPct);
            return this.#cssClassToHighlightParmsObj[highlightClass];
        } catch (err) {
            const errStr = `Daz3DSupport:DazMeta.getHighlightInfo: Error while retrieving highlight parameters for discountPct:${discountPct}% [class: '${highlightClass}']`;
            console.error(errStr);
            throw new Error(errStr, err);
        }
    }

    static isValidBase64String(unknownString) {
        return this.base64regex.test(unknownString);
    }

    static unpackBuffer(bufferIn) {
        const asString = atob(bufferIn);
        const buffer = new Array(asString.length);
        for (let i = 0; i < asString.length; i++) {
            buffer[i] = asString.charCodeAt(i);
        }
        const values = [];
        let index = 0;
        while (index <= buffer.length) {
            let value = 0;
            let myLength = 0;
            while (true) {
                const cb = buffer[index];
                value |= (cb & 127) << myLength * 7;
                index += 1;
                myLength += 1;
                if (myLength > 5) {
                    throw new Error("integer unpack exception");
                }
                if ((cb & 128) !== 128) {
                    break;
                }
            }
            index <= buffer.length && values.push(value);
        }
        return values;
    }

    static discountToClassLookup(discount) {
        // Fastest lookup
        switch(true) {
            case discount >= 100:
                return 'd3d-free';
            case discount >= 95:
                return 'd3d-95th';
            case discount >= 90:
                return 'd3d-highest';
            case discount >= 80:
                return 'd3d-high';
            case discount >= 70:
                return 'd3d-medium';
            case discount >= 60:
                return 'd3d-normal';
            case discount >= 50:
                return 'd3d-half';
            case discount >= 0:
                return 'd3d-zero';
            default:
                return 'd3d-filter';
        }

        // // Alternate, more flexible lookup:
        // const index = discountToClass.findIndex((obj) => {
        //     return discount < obj.pct;
        // });
        // return discountToClass[Math.max(0, index)].class;
    }

    static extractDiscountPct(rawDisc) {
        try {
            const match = rawDisc.match(this.DiscountRegEx);
            return parseFloat(match?.[1] ?? NaN);

        } catch (err) {
            return NaN;
        }
    }

    static discountStyle(discountPct, breakpointPct = USE_DEFAULT,
                                        maxScalePct = USE_DEFAULT,
                                        minScalePct = USE_DEFAULT) {
        breakpointPct = USE_DEFAULT.default(breakpointPct, DazMeta.defaultBreakpointPct);
        maxScalePct   = USE_DEFAULT.default(maxScalePct,   DazMeta.defaultMaxDiscountScale);
        minScalePct   = USE_DEFAULT.default(minScalePct,   DazMeta.defaultMinDiscountScale);

        //const fontSizePct = discountToSize(discountPct, maxScalePct, minScalePct);
        const fontScale   = Math.abs(maxScalePct - minScalePct) / 100.0;
        let   fontSizePct = minScalePct;
        if (discountPct <= breakpointPct) {
            fontSizePct = minScalePct;
        } else {
            fontSizePct = minScalePct + (discountPct - breakpointPct) * fontScale;
        }

        let styleStr = `font-size:${fontSizePct};`;
        if (discountPct >= 100.0) {
            styleStr += `color:black;background-color:gold;`;

        } else if (discountPct > 75.0) {
            styleStr += `color:#400000;background-color:#FFB0B0;`;

        } else if (discountPct > breakpointPct) {
            styleStr += `color:#004000;background-color:#B0FFB0;`;

        }
        return styleStr;
    }

    static discountStyleObj(discountPct, breakpointPct = USE_DEFAULT,
                                         maxScalePct = USE_DEFAULT,
                                         minScalePct = USE_DEFAULT) {
        breakpointPct = USE_DEFAULT.default(breakpointPct, DazMeta.defaultBreakpointPct);
        maxScalePct   = USE_DEFAULT.default(maxScalePct,   DazMeta.defaultMaxDiscountScale);
        minScalePct   = USE_DEFAULT.default(minScalePct,   DazMeta.defaultMinDiscountScale);

        //const fontSizePct = discountToSize(discountPct, maxScalePct, minScalePct);
        const fontScale   = Math.abs(maxScalePct - minScalePct) / 100.0;
        let   fontSizePct = minScalePct;
        if (discountPct <= breakpointPct) {
            fontSizePct = minScalePct;
        } else {
            fontSizePct = minScalePct + (discountPct - breakpointPct) * fontScale;
        }

        let styleObj = { fontSize: `${fontSizePct}%`, };
        if (discountPct >= 100.0) {
            styleObj.color           = 'black';
            styleObj.backgroundColor = 'gold';

        } else if (discountPct > 75.0) {
            styleObj.color           = '#400000';
            styleObj.backgroundColor = '#FFB0B0';

        } else if (discountPct > breakpointPct) {
            styleObj.color           = '#004000';
            styleObj.backgroundColor = '#B0FFB0';

        }
        return styleObj;
    }

    static #productItemSelector         = '#crumbs_clone[data-daz-breadcrumb-id^="product"]';
    static #bundleItemSelector          = `#bundle_info ul.included li.item`;
    static #shopListItemSelector        = `#slabs-container > li.item`;
    static #searchListItemSelector      = `#search_details_list > li.item`;
    static #wishlistListItemSelector    = `#slabs-container.wishlist-grid > li.item`;
    static #includedListItemSelector    = `ul.included > li.item`;

    static listSelectorsMap = new Map([
        [PageListType.Invalid,  { enabled: false, }],
        [PageListType.Unknown,  { enabled: false, }],
        [PageListType.Other,    { enabled: false, }],
        [PageListType.Wishlist, { enabled: true, listItemSelector: this.#wishlistListItemSelector, }],
        [PageListType.Bundle,   { enabled: true, bundleItemSelector: this.#bundleItemSelector, }],
        [PageListType.Product,  { enabled: true, productItemSelector: this.#productItemSelector, }],
        [PageListType.Shop,     { enabled: true, listItemSelector: this.#shopListItemSelector, }],
        [PageListType.Search,   { enabled: true, listItemSelector: this.#searchListItemSelector, }],
        [PageListType.Included, { enabled: true, listItemSelector: this.#includedListItemSelector, }],
    ]);

    static getListSelectorInfoForPageType(pageType = USE_DEFAULT) {
        pageType = USE_DEFAULT.default(pageType, this._currentPageListType)
        try {
            return this.listSelectorsMap.get(pageType);

        } catch (err) {
            console.error(`Daz3DSupport:DazMeta.getListSelector(${pageType}): err:${Support.buildInlineErrorStr(err)}.`);

            return this.listSelectorsMap.get(PageListType.Unknown);
        }
    }

    // product:
    // #crumbs_clone[data-daz-breadcrumb-id^="product"]
    // div id="crumbs_clone" class="crumbs daz-fixed" data-daz-sticky-side="top" data-daz-breadcrumb-id="product101848"

    // list:
    // #crumbs_clone[data-daz-breadcrumb-id^="category"]
    // div id="crumbs_clone" class="crumbs mobile-categories-inactive daz-fixed" data-daz-sticky-side="top" data-daz-breadcrumb-id="category26644" style="display: block; opacity: 0; pointer-events: none;">

    // div id="crumbs"
    //     class="crumbs daz-sticky"
    //     data-daz-sticky-side="top"
    //     data-daz-breadcrumb-id="product101592">

    static #determineCurrentDazPageTypeAsync(options = {}) {
        console.debug(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync: start...`);

        return new Promise((resolve, reject) => {
            try {
                const { timeoutMs, debug } = Object.assign({ timeoutMs: 20000, debug: null, }, options);
                if (this._currentPageListType == null ||
                    this._currentPageListType == PageListType.Invalid) {
                    //console.log(`${GM_info?.script?.name}:DazMain.#determineCurrentDazPageTypeAsync`);
                    const selectorList              = [];
                    const selectorToPageListType    = new Map();
                    // Get list of all selectors
                    //console.log(`${GM_info?.script?.name}:DazMain.#determineCurrentDazPageTypeAsync: this.listSelectorsMap.size:${this.listSelectorsMap.size}`);
                    //console.log(`${GM_info?.script?.name}:DazMain.#determineCurrentDazPageTypeAsync: Object.entries(this.listSelectorsMap)#:${this.listSelectorsMap.entries()?.length}`);
                    for(const [key, listSelInfo] of this.listSelectorsMap.entries()) {
                        //console.log(`${GM_info?.script?.name}:DazMain.#determineCurrentDazPageTypeAsync: key:${key}, listSelInfo.enabled:${listSelInfo?.enabled}.`);
                        //console.dir(listSelInfo);
                        if (listSelInfo?.enabled == true) {
                            const sel = listSelInfo?.listItemSelector ??
                                        listSelInfo?.bundleItemSelector ??
                                        listSelInfo?.productItemSelector;
                            if (sel != null) {
                                // console.log(`${GM_info?.script?.name}:DazMain.#determineCurrentDazPageTypeAsync: sel:${sel}, key:${key}.`);
                                selectorToPageListType.set(sel, key);
                                selectorList.push(sel);
                            }
                        }
                    }
                    console.debug(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync: selectorList:${selectorList?.join(", ")}`);

                    //console.debug(`${GM_info?.script?.name}:DazMain.#determineCurrentDazPageTypeAsync: ${selectorList.join(' | ')}.`);
                    // const waitForSelectorList = new WaitForAnyElement=(selectorList, { timeoutMs: timeoutMs });
                    // const selInfo = await waitForSelectorList.waitAsync();
                    // if (selInfo == null) {
                    //     console.error(`${GM_info?.script?.name}:#determineCurrentDazPageTypeAsync: timed out`);
                    //     return PageListType.Unknown;
                    // }

                    function getType(that, selectorList) {
                        console.log(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: Looking... (selectorList:${selectorList?.length}).`);
                        let selInfo = {};
                        let foundSel = null;
                        for (const sel of selectorList) {
                            selInfo = document.querySelectorAll(sel);
                            console.log(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: sel:'${sel}', selInfo:${selInfo?.length}.`);
                            if (selInfo?.length > 0) {
                                foundSel = sel;
                                console.log(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: break, sel:'${sel}', foundSel:'${foundSel}'.`);
                                break;
                            }
                        }
                        console.log(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: foundSel:'${foundSel}'.`);

                        const selPLT = selectorToPageListType.get(foundSel);
                        console.log(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: selPLT:'${selPLT}'.`);
                        if (selPLT == null) {
                            console.error(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: foundSel:'${foundSel}' was not found in selectorToPageListType (keys:${[...selectorToPageListType.keys()].join(', ')}.`);
                        }
                        this._currentPageListType = PageListType.get(selPLT) ?? PageListType.Invalid;
                        console.log(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: this._currentPageListType:'${this._currentPageListType}'.`);
                        if (this._currentPageListType == PageListType.Invalid) {
                            console.error(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: this._currentPageListType == PageListType.Invalid, selPLT:'${selPLT}'.`);
                        }
                        console.log(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync:getType: selInfo.selector:(${selInfo?.selector}), selInfo.element:${selInfo?.element}, this._currentPageListType:${that._currentPageListType}, selPLT:${selPLT}.`);
                        // console.log(`${GM_info?.script?.name}:DazMain.#determineCurrentDazPageTypeAsync: waitForAnyElement: selInfo.selector:${selInfo?.selector}, selectorToPageListType.get(selInfo.selector):${selectorToPageListType.get(selInfo?.selector)}, this._currentPageListType:${this._currentPageListType}.`);

                        resolve(that._currentPageListType);

                    }
                    setTimeout(getType.bind(this), 250, this, selectorList);
                }
            } catch(err) {
                console.error(`Daz3DSupport:DazMain.#determineCurrentDazPageTypeAsync: Error: ${err}`);
                reject(err);
            }
        });
    }
    static get currentPageListType() {
        //console.log(`Daz3DSupport:DazMain.currentPageListType: this._currentPageListType:'${this._currentPageListType}'`);
        return this._currentPageListType;
        // == PageListType.Invalid ?
        //                                     PageListType.Page :
        //                                     this._currentPageListType ?? PageListType.Page;
    }
    static get currentDazPageTypeAsStr() {
        //console.log(`Daz3DSupport:DazMain.currentDazPageTypeAsStr: this._currentPageListType:'${this._currentPageListType}', this._currentPageListType.type:'${this._currentPageListType?.type}'.`);
        return (this._currentPageListType ?? PageListType.Invalid).type;
    }
    static async getDazPageTypeAsync(debug = null) {
        // Determines PageListType and DazPageType
        const pageType = await this.#determineCurrentDazPageTypeAsync();
        console.debug(`Daz3DSupport:DazMain.getDazPageTypeAsync: pageType:${pageType}, this.currentDazPageTypeAsStr:${this.currentDazPageTypeAsStr}.`);
        return this.currentDazPageTypeAsStr;

        // return SelectorWithElement.waitForElement('#crumbs_clone', { timeoutMs: 2000 })
        // .then(((debug, breadcrumbDiv) => {
        //     const dazBreadcrumbId = breadcrumbDiv?.dataset?.dazBreadcrumbId;
        //     if (breadcrumbDiv == null) { // timed out
        //         console.error(`Daz3DSupport:DazMeta.getDazPageTypeAsync: #crumbs_clone does not exist (timed out waiting): unknown (Other) page type.`);
        //         return DazPageType.Other;

        //     } else if (dazBreadcrumbId.startsWith('product')) {
        //         return DazPageType.Product;

        //     } else if (dazBreadcrumbId.startsWith('category') ||
        //                dazBreadcrumbId.startsWith('results')) {
        //         return DazPageType.List;

        //     } else { // Unknown page type
        //         console.error(`Daz3DSupport:getDazPageTypeAsync: unexpected page type, daz-breadcrumb-id:${breadcrumbId}`);
        //         let altId = dazBreadcrumbId.match(/^(\D+)\d*$/i)?.[1] ?? "<Unknown>";
        //         return DazPageType.get(altId) ?? DazPageType.Unknown;

        //     }
        // }).bind(this, debug))
        // .catch((err) => {
        //     console.error(`Daz3DSupport:DazMeta.getDazPageTypeAsync: error occured while determining page type, treating page as 'Unknown', err:${Support.buildInlineErrorStr(err)}.`);
        //     return PageType.Other;
        // });
    }

    static accumulatedThrottle(callback, waitMs, useAccumulation = true) {
        let timeoutID;
        let accumulatedData = [];

        function callFunction(context, args) {
            if (useAccumulation) {
                // Provide both accumulatedData instead of regular arguments
                callback.call(context, accumulatedData);
                // Clear the accumulated data array
                accumulatedData = [];
            } else {
                callback.apply(context, args);
            }
        }

        return function () {
            const args = arguments;
            // Gather data for each call
            if (useAccumulation) {
                accumulatedData.push(args);
            }

            if (!timeoutID) {
                const context = this;

                // Call callback immediately
                callFunction(context, args);

                timeoutID = setTimeout(function () {
                    // Call callback after wait
                    callFunction(context, args);

                    // Clean up our timeoutID
                    clearTimeout(timeoutID);
                    timeoutID = undefined;
                }, waitMs);
            }
        };
    }

    static constructorStatic() {
        let tempTokenMapArray = this.#dazPlusDiscountList.map((item) => [item?.tokens ?? 0, item]);
        this.#tokensToDiscountMap = new Map(tempTokenMapArray);

        // build array of highlight classes, sorted by
        this.#discountToHighlightClassList = Object.entries(this.#cssClassToHighlightParmsObj)
                                                   .map(([key, hlObj]) => [hlObj?.pct ?? 0, key]);
        this.#discountToHighlightClassList.sort((a, b) => a?.[0] - b?.[0]);
    }

    static {
        this.constructorStatic();
    }
}














