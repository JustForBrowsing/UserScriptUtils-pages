///// console proxy:
// @require     https://cdn.jsdelivr.net/npm/console-proxy@0.2.6/lib/console-proxy.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.4/beautify.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.4/beautify-css.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.4/beautify-html.min.js

function proxyLog(logLevel, ...args) {
    // var args = Array.prototype.slice.apply(arguments);
    const now = new Date();
      args.unshift(`[info]${GM_info?.script?.name}[info] ${now.toISOString()}:`);

    // pass arguments for the base console.log or false to
    // prevent it from being called
    return args;
}

function proxyDir(object, ...args) {
    // https://developer.mozilla.org/en-US/docs/Web/API/console/dirxml_static
    //   console.dir(object)
    //   console.dir(object, options)   <= 'options' is not supported by Safari
    // The console.dir() static method displays a list of the properties
    // of the specified JavaScript object.
    // Unlike other logging methods, console.dir() does not attempt to
    // pretty-print the object. For example, if you pass a DOM element
    // to console.dir(), it will not be displayed like in the element
    // inspector, but will instead show a list of properties.

    // https://developer.mozilla.org/en-US/docs/Web/API/console/dir_static
    //   console.dirxml(object)
    // The console.dirxml() static method displays an interactive tree
    // of the descendant elements of the specified XML/HTML element.
    // If it is not possible to display as an element the JavaScript
    // Object view is shown instead. The output is presented as a
    // hierarchical listing of expandable nodes that let you see the
    // contents of child nodes.


    const beautifulStuff = js_beautify(object, beautifierOptions);
    // output beautifulStuff to alt logger (and original??)

    args.unshift(object); // put object back into array at the front
    return args;
}

function proxyTable(...args) {
    // https://developer.mozilla.org/en-US/docs/Web/API/console/table_static
    // console.table(data)
    // console.table(data, columns)
    // data    -- The data to display. This must be either an array or an object.
    //            Each item in the array, or property in the object, is
    //            represented by a row in the table. The first column in the
    //            table is labeled (index) and its values are the array indices
    //            or the property names.
    //            If the elements in the array, or properties in the object,
    //            are themselves arrays or objects, then their items or properties
    //            are enumerated in the row, one per column.
    const data    = args?.[0];

    // columns -- Optional  An array which can be used to restrict the columns
    //            shown in the table. It contains indices, if each entry of data
    //            is an array, or property names, if each entry of data is an object.
    //            The resulting table then includes only columns for items which
    //            match the given indices or names
    const columns = args?.[1] ?? null;

    let displayData = null;
    if (Array.isArray(data) && Array.isArray(columns)) {
        displayData = _.filter(data, (val, idx, arr) => idx in columns)

    } else if (Array.isArray(data)) {
        displayData = data;

    } else if (data instanceof object && Array.isArray(columns)) {
        displayData = _.pick(data, columns);

    } else if (data instanceof object)) {
        displayData = data;

    } else {
        //throw error?
        displayData = null;
    }
    if (displayData != null) {
        const beautifulStuff = js_beautify(displayData, beautifierOptions);
    }
    // output beautifulStuff to alternate logger (and also the original??)

    return args; // pass to original function
}

// console commands:
// Other:    ['assert', 'clear', 'count', 'countReset'**,
//            'group', 'groupCollapsed'**, 'groupEnd',
//            'time', 'timeEnd', 'timeLog'**, 'trace']
// Formatting loggers: ['dir', 'dirxml', 'table'*b]
// Simple loggers: ['log', 'debug', 'info', 'warn', 'error']
//     ** - not in list of Safari commands

// Safari console commands: 
//  console.log(object)
//  console.debug(object)
//  console.info(object)
//  console.warn(object)
//  console.error(object)
//  
//  console.dir(object)
//  console.dirxml(node)
//  
//  console.assert(expression, object)
//  console.clear(), 
//  console.count([title])
//  
//  console.trace()
//  console.time(name)
//  console.timeEnd(name)
//  console.group([title])
//  console.groupEnd()
//  console.markTimeline(label)
//  console.profile([title])
//  console.profileEnd([title])
//  debugger

// Create a console Proxy
const console = consoleProxy.getConsole({
        log: proxyLog.bind(this, "debug"),
      debug: proxyLog.bind(this, "debug"),
       info: proxyLog.bind(this, "info"),
       warn: proxyLog.bind(this, "warn"),
      error: proxyLog.bind(this, "error"),
        dir: proxyDir.bind(this),
     dirxml: proxyDir.bind(this),
      table: proxyTable.bind(this),
});

// example
//console.log("Hello", "world");
//=> [info] Sat Apr 27 2013 15:38:56 GMT+0200 (CEST) Hello world

// To get the original console:
// const originalConsole = consoleProxy.getOriginalConsole();

