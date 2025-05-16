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

function proxyDir(object, ...args) {  // proxy for both dir & dirxml
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
    
    // Example:
    // console.dir({
    //     'a': 56,
    //     'b': true,
    //     'c': {
    //         'f': "hmmhbhynhy",
    //         'p': 78,
    //     }
    // });
    // Object 
    //     a: 56
    //     b: true
    //     c: Object
    //         f: "hmmhbhynhy"
    //         p: 7
    
    const beautifulStuff = js_beautify(object, beautifierOptions);
    // output beautifulStuff to alt logger (and original??)

    args.unshift(object); // put object back into array at the front
    return args;
}

function proxyTable(...args) {
    // console.table([4,6,8,9]);
    // (index)         Value
    // 0               4
    // 1               6
    // 2               8
    // 3               9
    // >Array(4) 
    
    // console.table([[8,9,4],[6,8,9]]);
    // (index)         0               1               2
    // 0               8               9               4
    // 1               6               8               9
    // >Array(2) 
    
    // console.table({
    //     'a': 56,
    //     'b': true,
    //     'c': {
    //         'f': "hmmhbhynhy",
    //         'p': 78,
    //     }
    // });
    // (index)     Value       f               p
    // a           56        
    // b           true        
    // c                       "hmmhbhynhy"    78
    // Object 
    //     a: 56
    //     b: true
    //     c: Object
    //         f: "hmmhbhynhy"
    //         p: 78

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
//  console.log(object),  console.debug(object), console.info(object), 
//  console.warn(object), console.error(object)
//  console.dir(object),  console.dirxml(node)
//  
//  console.assert(expression, object), console.clear(), console.count([title]
//  console.trace(), debugger, console.time(name), console.timeEnd(name)
//  console.group([title]), console.groupEnd()
//  console.markTimeline(label), console.profile([title]), console.profileEnd([title])

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





// @require      https://cdn.jsdelivr.net/npm/pretty@2.0.0/index.min.js
// docs          https://www.jsdelivr.com/package/npm/pretty

// @require      https://cdn.jsdelivr.net/npm/js-beautify@1.15.4/js/lib/beautify-css.min.js
// github        https://github.com/beautifier/js-beautify

// Web Library
// The library exposes three functions: js_beautify, css_beautify, and html_beautify

//Example usage of beautifying a json string:
//const options = { indent_size: 2, space_in_empty_paren: true }
//const dataObj = {completed: false,id: 1,title: "delectus aut autem",userId: 1,}
//const dataJson = JSON.stringify(dataObj)
//js_beautify(dataJson, options)

/* OUTPUT
{
  "completed": false,
  "id": 1,
  "title": "delectus aut autem",
  "userId": 1,
}
*/

/*
These are the command-line flags for both Python and JS scripts:
CLI Options:
  -f, --file       Input file(s) (Pass '-' for stdin)
  -r, --replace    Write output in-place, replacing input
  -o, --outfile    Write output to file (default stdout)
  --config         Path to config file
  --type           [js|css|html] ["js"] Select beautifier type (NOTE: Does *not* filter files, only defines which beautifier type to run)
  -q, --quiet      Suppress logging to stdout
  -h, --help       Show this help
  -v, --version    Show the version

Beautifier Options:
  -s, --indent-size                 Indentation size [4]
  -c, --indent-char                 Indentation character [" "]
  -t, --indent-with-tabs            Indent with tabs, overrides -s and -c
  -e, --eol                         Character(s) to use as line terminators.
                                    [first newline in file, otherwise "\n]
  -n, --end-with-newline            End output with newline
  --editorconfig                    Use EditorConfig to set up the options
  -l, --indent-level                Initial indentation level [0]
  -p, --preserve-newlines           Preserve line-breaks (--no-preserve-newlines disables)
  -m, --max-preserve-newlines       Number of line-breaks to be preserved in one chunk [10]
  -P, --space-in-paren              Add padding spaces within paren, ie. f( a, b )
  -E, --space-in-empty-paren        Add a single space inside empty paren, ie. f( )
  -j, --jslint-happy                Enable jslint-stricter mode
  -a, --space-after-anon-function   Add a space before an anonymous function's parens, ie. function ()
  --space-after-named-function      Add a space before a named function's parens, i.e. function example ()
  -b, --brace-style                 [collapse|expand|end-expand|none][,preserve-inline] [collapse,preserve-inline]
  -u, --unindent-chained-methods    Don't indent chained method calls
  -B, --break-chained-methods       Break chained method calls across subsequent lines
  -k, --keep-array-indentation      Preserve array indentation
  -x, --unescape-strings            Decode printable characters encoded in xNN notation
  -w, --wrap-line-length            Wrap lines that exceed N characters [0]
  -X, --e4x                         Pass E4X xml literals through untouched
  --good-stuff                      Warm the cockles of Crockford's heart
  -C, --comma-first                 Put commas at the beginning of new line instead of end
  -O, --operator-position           Set operator position (before-newline|after-newline|preserve-newline) [before-newline]
  --indent-empty-lines              Keep indentation on empty lines
  --templating                      List of templating languages (auto,django,erb,handlebars,php,smarty,angular) ["auto"] auto = none in JavaScript, all in HTML
Which correspond to the underscored option keys for both library interfaces

// defaults per CLI options
{
    "indent_size": 4,
    "indent_char": " ",
    "indent_with_tabs": false,
    "editorconfig": false,
    "eol": "\n",
    "end_with_newline": false,
    "indent_level": 0,
    "preserve_newlines": true,
    "max_preserve_newlines": 10,
    "space_in_paren": false,
    "space_in_empty_paren": false,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "space_after_named_function": false,
    "brace_style": "collapse",
    "unindent_chained_methods": false,
    "break_chained_methods": false,
    "keep_array_indentation": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "e4x": false,
    "comma_first": false,
    "operator_position": "before-newline",
    "indent_empty_lines": false,
    "templating": ["auto"]
}

// defaults not exposed in the cli
{
  "eval_code": false,
  "space_before_conditional": true
}
*/

//// js_beautify:
// After you embed the <script> tags in your html file, they expose three functions:
//     js_beautify, css_beautify, and html_beautify
//
// Example usage of beautifying a json string:
//     const dataObj = {completed: false,id: 1,title: "delectus aut autem",userId: 1,}
//     const dataJson = JSON.stringify(dataObj)
//
//     const options = { indent_size: 2, space_in_empty_paren: true }
//     js_beautify(dataJson, options)
//     /* OUTPUT
//     {
//         "completed": false,
//         "id": 1,
//         "title": "delectus aut autem",
//         "userId": 1,
//     }
//     */

// Ignore:
// /* beautify ignore:start */
//    // non-parsable code to ignore
// /* beautify ignore:end */

// Preserve (HTML & JS only):
// /* beautify preserve:start */
//    // valid code who’s formatting should
//    // be preserved
// /* beautify preserve:end */

// const beautifierOptions = {
//                "space_in_paren": true,
//     "space_after_anon_function": true,
//                   "brace_style": "collapse,preserve-inline",
//         "break_chained_methods": true,
//        "keep_array_indentation": true,
//                "indent_scripts": "normal",
//              "wrap_line_length": 120,
//             "operator_position": "before-newline",
//      "space_before_conditional": true,
//              "unescape_strings": true,
//              "end_with_newline": true,
//             "indent_inner_html": false,
//                   "comma_first": false,
// }



/* Floating logger







const moveable = new Moveable(document.body, {
    target: document.getElementById("elog"),
    // If the container is null, the position is fixed. (default: parentElement(document.body))
    container: null, // document.body,
    draggable: true,
    resizable: false,
     scalable: false,
    rotatable: false,
     warpable: false,
    // Enabling pinchable lets you use events that
    // can be used in draggable, resizable, scalable, and rotateable.
    pinchable: false, // ["resizable", "scalable", "rotatable"]
       origin: false,
    keepRatio: true,
    // Resize, Scale Events at edges.
    edge: false,
      throttleDrag: 0,
    throttleResize: 0,
     throttleScale: 0,
    throttleRotate: 0,
});

// draggable
moveable.on("dragStart", ({ target, clientX, clientY }) => {
    //console.log("onDragStart", target);
    //target.style.position = "fixed";

}).on("drag", ({target, transform,
                left, top, right, bottom,
                beforeDelta, beforeDist, delta, dist,
                clientX, clientY, }) => {
    //console.log("onDrag left, top", left, top);
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
    // console.log("onDrag translate", dist);
    // target!.style.transform = transform;

}).on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
    //console.log("onDragEnd", target, isDrag);
    //target.style.position = "sticky";
});
*/

































