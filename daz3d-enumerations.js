// ==UserLibrary==
// @name        Daz3DEnumerations
// @author      Me
// @version     0.1.0
// @description Adds functionality to the Daz3D web site
// ==/UserLibrary=

// (async () => {
if (null != window?.Enum) {
    let enumModule = await import("https://cdn.jsdelivr.net/npm/enum@3.0.4/index.min.js");
    window.Enum = enumModule.default;
}

// })();
console.log(`%cDaz3DEnumerations: loading...`, 'color:#4060FF;')
        
// const Enum = import('https://raw.githubusercontent.com/adrai/enum/master/dist/enum-3.0.4.min.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ███████╗███╗   ██╗██╗   ██╗███╗   ███╗███████╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝████╗  ██║██║   ██║████╗ ████║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// █████╗  ██╔██╗ ██║██║   ██║██╔████╔██║█████╗  ██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██╔══╝  ██║╚██╗██║██║   ██║██║╚██╔╝██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ███████╗██║ ╚████║╚██████╔╝██║ ╚═╝ ██║███████╗██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║███████║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
//#enumerations
// We don't initially freeze the enums to allow the addition of additional functionality.

/**
 * Enum for product bundle information
 * @readonly
 * @enum {string,string}
 */
const BundleStatus = new Enum({     // enum: { bundle: is a bundle?, desc: "description text" }
        Invalid:            { bundle:false, desc:"Invalid BundleStatus -- internal error." },
        Unknown:            { bundle:false, desc:"Bundle status has not been determined (is unknown)" },
        NotABundle:         { bundle:false, desc:"This item has no sub-items; it is not a bundle." },
        BundleInFlagOnly:   { bundle:false, desc:"Marked as a bundle but it has no sub-items." },
        NothingOwned:       { bundle:true,  desc:"No items in this bundle are owned." },
        PartiallyComplete:  { bundle:true,  desc:"Some items in this bundle are owned." },
        BundleHasExtras:    { bundle:true,  desc:"All items are owned but the bundle has desired extras" },
        EffectivelyComplete:{ bundle:true,  desc:"All desired items in this bundle are owned." },
        FullyComplete:      { bundle:true,  desc:"All items are owned but bundle is not marked as owned)" },
        Owned:              { bundle:true,  desc:"This bundle is owned and is fully complete." },
    }, 
    { name: 'BundleStatus', ignoreCase: true, freeze: false }
);
BundleStatus.NotABundleEnums = [ BundleStatus.Unknown, BundleStatus.NotABundle,
                                 BundleStatus.BundleInFlagOnly ];
BundleStatus.BundleEnums     = [ BundleStatus.NothingOwned, BundleStatus.PartiallyComplete,
                                 BundleStatus.BundleHasExtras, BundleStatus.EffectivelyComplete,
                                 BundleStatus.FullyComplete, BundleStatus.Owned ];
BundleStatus.isNotABundle = function isNotABundle(enumVal) {
    return BundleStatus.NotABundleEnums.includes(BundleStatus.get(enumVal));
}
BundleStatus.isBundle     = function isBundle(enumVal) {
    return BundleStatus.BundleEnums.includes(BundleStatus.get(enumVal));
}
BundleStatus.enums.forEach((e) => { e.bundle = e.value.bundle; e.desc = e.value.desc; });
BundleStatus.freezeEnums(); // Permanently freeze the

/**
 * Enum for reason to buy (or not to buy) a product
 * @readonly
 * @enum {string,string}
 */ 
const ReasonToBuy = new Enum({  // enum: { type: 'wanted or not', desc: "description text" }
    Invalid:        { type: 'Invalid',   desc: "Invalid ReasonToBuy -- internal error." },
    // Items that are not wanted
    DoNotBuy:       { type: 'NotWanted', desc: "Do NOT buy this item. (It's crap, etc.)" },
    Incompatible:   { type: 'NotWanted', desc: "Item is incompatible with my software." },
    NotWanted:      { type: 'NotWanted', desc: "I don't want or need this item (but not a bad item)." },
    AlternateOwned: { type: 'NotWanted', desc: "Equivalent or substitute for an item already owned." },
    Owned:          { type: 'NotWanted', desc: "Item is already owned." },

    // Items with unknown reasons to buy
    Unviewed:       { type: 'NotKnown',  desc: "Item has not been seen, categorized, or evaluated." },
    Unknown:        { type: 'NotKnown',  desc: "Item has been seen but not categorized or evaluated." },
                                         // We don't have enough information to have a reason to buy.
    // Wanted items
    NeededForBundle:{ type: 'Wanted',    desc: "Only needed to complete an owned bundle." },
    IsOptionalAddon:{ type: 'Wanted',    desc: "An optional add-on for an owned or wanted item."},
    IsDesiredAddon: { type: 'Wanted',    desc: "A wanted add-on for an owned or wanted item." },
    HasDesiredAddon:{ type: 'Wanted',    desc: "This item is the parent to a wanted item." },
    WantedItem:     { type: 'Wanted',    desc: "I just want it." },
    RequiredParent: { type: 'Wanted',    desc: "Required as the parent of an already owned item." },
                        // This item is required by an already owned item to make it work --
                        // use 'WantedItem' for similar items that are only desired, but not required.
    },
    { name: 'ReasonToBuy', ignoreCase: true, freeze: false }
);
// Add lists grouping enum values
ReasonToBuy.NotWantedEnums  = [ ReasonToBuy.DoNotBuy,               ReasonToBuy.Incompatible,
                                ReasonToBuy.NotWanted,              ReasonToBuy.AlternateOwned,
                                ReasonToBuy.Owned ];
ReasonToBuy.NotKnownEnums   = [ ReasonToBuy.Unviewed,               ReasonToBuy.Unknown ];
ReasonToBuy.WantedEnums     = [ ReasonToBuy.NeededToCompleteBundle, ReasonToBuy.IsOptionalAddon,
                                ReasonToBuy.IsDesiredAddon,         ReasonToBuy.HasDesiredAddon,
                                ReasonToBuy.WantedItem,             ReasonToBuy.NeededAsParent ];
ReasonToBuy.isNotWanted = function isNotWanted(enumVal) {
    return ReasonToBuy.NotWantedEnums.includes(ReasonToBuy.get(enumVal));
}
ReasonToBuy.isNotKnown  = function isNotKnown(enumVal) {
    return ReasonToBuy.NotKnownEnums.includes(ReasonToBuy.get(enumVal));
}
ReasonToBuy.isWanted    = function isWanted(enumVal) {
    return ReasonToBuy.WantedEnums.includes(ReasonToBuy.get(enumVal));
}
ReasonToBuy.enums.forEach((e) => { e.type = e.value.type; e.desc = e.value.desc; });
ReasonToBuy.freezeEnums(); // Permanently freeze the enum

/**
 * Priority in making purchase
 * @readonly
 * @enum {string,string}
 */
const PriorityToBuy = new Enum({    // enum: { priority: relativePriority, desc: "description text" }
        Invalid:        { priority: NaN, desc: "Invalid PriorityToBuy -- internal error." },
        Unknown:        { priority: NaN, desc: "Priority not yet set (unknown)." },
        DoNotBuy:       { priority: -99, desc: "Do NOT buy this item.  Nyet." },
        NotInterested:  { priority:   0, desc: "This item doesn't interest me." },
        BarginOnly:     { priority:   2, desc: "Only buy during a deep sale (98%+ or <$0.50)." },
        Low:            { priority:  10, desc: "Buy during a serious sale (90%+)." },
        Medium:         { priority:  25, desc: "Buy if offered for a decent price (75%+)." },
        High:           { priority:  50, desc: "Buy as soon as it's discounted (50%+)." },
        PayFullPrice:   { priority: 100, desc: "Buy. It. Now. (even with no discount)." },
    }, 
    { name: 'PriorityToBuy', ignoreCase: true, freeze: false }
);
PriorityToBuy.DoNotBuy = [ PriorityToBuy.Invalid,  PriorityToBuy.Unknown,
                           PriorityToBuy.DoNotBuy, PriorityToBuy.NotInterested ];
PriorityToBuy.Buy      = [ PriorityToBuy.BarginOnly, PriorityToBuy.Low, PriorityToBuy.Medium,
                           PriorityToBuy.High, PriorityToBuy.PayFullPrice ];
PriorityToBuy.isDoNotBuy = function isDoNotBuy(enumVal) {
    return PriorityToBuy.DoNotBuy.includes(PriorityToBuy.get(enumVal));
}
PriorityToBuy.isToBuy  = function isToBuy(enumVal) {
    return PriorityToBuy.Buy.includes(PriorityToBuy.get(enumVal));
}
PriorityToBuy.enums.forEach((e) => { e.priority = e.value.priority; e.desc = e.value.desc; });
PriorityToBuy.freezeEnums(); // Permanently freeze the enum

/**
 * Status of an item's licenses
 * @readonly
 * @enum {string,string}
 */
const LicenseStatus = new Enum({    // enum: { desc: "description text" }
        Invalid:        { desc: "Invalid LicenseStatus -- internal error." },
        Unknown:        { desc: "License status has not yet been set (unknown)." },
        NotAvailable:   { desc: "This license is not offered for this item." },
        Unnecessary:    { desc: "This license makes no sense for this item." },
        Unneeded:       { desc: "I won't need this license." },
        Future:         { desc: "May need this license in the future (not wanted now, don't buy)" },
        BarginOnly:     { desc: "May need this license, buy it if/when on sale." },
        NeedIt:         { desc: "Need this, buy ASAP!" },
    }, 
    { name: 'LicenseStatus', ignoreCase: true, freeze: false }
);
LicenseStatus.NotWantedEnums = [ LicenseStatus.Invalid, LicenseStatus.Unknown,
                                 LicenseStatus.NotAvailable, LicenseStatus.Unnecessary,
                                 LicenseStatus.Unneeded ];
LicenseStatus.AvailableEnums = [ LicenseStatus.Unnecessary, LicenseStatus.Unneeded,
                                 LicenseStatus.Future, LicenseStatus.BarginOnly,
                                 LicenseStatus.NeedIt ];
LicenseStatus.WantedEnums    = [ LicenseStatus.Future, LicenseStatus.BarginOnly,
                                 LicenseStatus.NeedIt ];
LicenseStatus.isNotWanted = function isNotWanted(enumVal) {
    return LicenseStatus.NotWantedEnums.includes(LicenseStatus.get(enumVal));
}
LicenseStatus.isAvailable = function isAvailable(enumVal) {
    return LicenseStatus.AvailableEnums.includes(LicenseStatus.get(enumVal));
}
LicenseStatus.isWanted    = function isWanted(enumVal) {
    return LicenseStatus.WantedEnums.includes(LicenseStatus.get(enumVal));
}
LicenseStatus.enums.forEach((e) => { e.desc = e.value.desc; });
LicenseStatus.freezeEnums(); // Permanently freeze the enum

/**
 * How should item be displayed (overrides other cases when not set to Default)
 * @readonly
 * @enum {string,string}
 */
const ItemDisplay = new Enum({      // enum: { class: 'associated CSS class', desc: "description text" }
        Invalid:    { class:'item-display-invalid',    desc:"Invalid LicenseStatus -- internal error."},
        Default:    { class:'',                        desc:"Display as per item's status" },
        Discounted: { class:'item-display-discounted', desc:"Display as discounted (forced?)."},
        Normal:     { class:'item-display-normal',     desc:"Shown as a normal item."},
        Grayed:     { class:'item-display-grayed',     desc:"Shown as a faded/grayed out item."},
        Hide:       { class:'item-display-hide',       desc:"Hide this item (when applicable)."},
    }, 
    { name: 'ItemDisplay', ignoreCase: true, freeze: false }
);
ItemDisplay.VisibleEnums = [ ItemDisplay.Default, ItemDisplay.Discounted,
                             ItemDisplay.Normal,  ItemDisplay.Grayed ];
ItemDisplay.isVisible = function isWanted(enumVal) {
    return ItemDisplay.VisibleEnums.includes(ItemDisplay.get(enumVal));
}
ItemDisplay.enums.forEach((e) => { e.class = e.value.class; e.desc = e.value.desc; });
ItemDisplay.freezeEnums(); // Permanently freeze the enum

/**
 * Daz3D item type (DazPlus status)
 * @readonly
 * @enum {string,string}
 */
const DazItemType = new Enum({      // enum: { desc: "description text" }
        Invalid:            { desc: "Invalid DazItemType -- internal error." },
        Normal:             { desc: "Normal item (not a Daz3D Original or a Daz3D Plus item." },
        DazOriginal:        { desc: "Item is a Daz3D Original item." },
        DazPlus:            { desc: "Item is a Daz3D Plus item (but not an exclusive)." },
        DazPlusExclusive:   { desc: "Item is a Daz3D Plus Exclusive item." },
    }, 
    { name: 'DazItemType', ignoreCase: true, freeze: false }
);
DazItemType.enums.forEach((e) => { e.desc = e.value.desc; });
DazItemType.freezeEnums(); // Permanently freeze the enum

/**
 * What type of Daz page are we on?
 * @readonly
 * @enum {string,string}
 */
const DazPageType = new Enum({  // value: description text
        Invalid:            { desc: "Invalid DazPageType -- internal error." },
        Unknown:            { desc: "Unknown DazPageType." },
        Other:              { desc: "Other known but uninteresting page types." },
        List:               { desc: "Lists of products (search results, etc)." },
        Product:            { desc: "Product description page." },
    },
    { name: 'DazPageType', ignoreCase: true, freeze: false }
);
DazPageType.enums.forEach((e) => { e.desc = e.value.desc; });
DazPageType.freezeEnums(); // Permanently freeze the enum

/**
 * What type of Daz page are we on? What kind of item list structure (in the html) does the page have?
 * @readonly
 * @enum {string,string}
 */
const PageListType = new Enum({     // enum: { desc: "description text" }
        Invalid:    { type: DazPageType.Invalid, desc: "Invalid PageListType -- internal error." },
        Unknown:    { type: DazPageType.Unknown, desc: "Unknown PageListType." },
        Other:      { type: DazPageType.Other,   desc: "Other known but uninteresting page types." },
        Shop:       { type: DazPageType.List,    desc: "A shop list structured page." },
        Search:     { type: DazPageType.List,    desc: "A search result list structured page." },
        Wishlist:   { type: DazPageType.List,    desc: "A wishlist structured page." },
        Included:   { type: DazPageType.List,    desc: "An included list result structured page. ???" },
        Product:    { type: DazPageType.Product, desc: "Product description page." },
        Bundle:     { type: DazPageType.Product, desc: "Product bundle description page." },
    }, 
    { name: 'PageListType', ignoreCase: true, freeze: false }
);
PageListType.enums.forEach((e) => { e.type = e.value.type; e.desc = e.value.desc; });
PageListType.freezeEnums(); // Permanently freeze the enum

/**
 * What kind of shaders does the item support
 * @readonly
 * @enum {string,string}
 */
const ShaderType = new Enum({       // enum: { desc: "description text" }
        Invalid:        { usable: false, desc: "" },
        Poser6:         { usable: false, desc: "" },
        Carrara:        { usable: false, desc: "" },
        Bryce:          { usable: false, desc: "" },
        DazStudio:      { usable: false, desc: "" },
        DAZStudio4:     { usable: true,  desc: "" },
        Daz3Delight:    { usable: true,  desc: "" },
        IRay:           { usable: true,  desc: "" },
    }, { name: 'ShaderType', ignoreCase: true, freeze: false }
);
ShaderType.enums.forEach((e) => { e.usable = e.value.usable; e.desc = e.value.desc; });
ShaderType.freezeEnums(); // Permanently freeze the enum

export { BundleStatus,  ReasonToBuy,  PriorityToBuy, 
         LicenseStatus, ItemDisplay,  DazItemType, 
         DazPageType,   PageListType, ShaderType };













