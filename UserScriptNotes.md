
## Useful Libraries
### pretty-checkbox
| @require | https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css |
| -------- | :---------------------------------------------------------------------------- |
| @docs    | https://lokesh-coder.github.io/pretty-checkbox/#basic-checkbox                |

@example

```html
<div class="pretty p-default">
    <input type="checkbox" />
    <div class="state">
        <label>Check</label>
    </div>
</div>
```

### object-inspect

| @require | https://cdn.jsdelivr.net/npm/object-inspect@1.13.4/index.min.js               |
| :------- | :---------------------------------------------------------------------------- |
| @docs    | https://github.com/inspect-js/object-inspect                                  |

@example                                                                           
```javascript
    var s = inspect(obj, opts={})
```
```javascript
    // Return a string s with the string representation of obj up to a depth of opts.depth.
    // Additional options:
    //       quoteStyle: must be "single" or "double", if present.
    //                   Default 'single' for strings, 'double' for HTML elements.
    //  maxStringLength: must be 0, a positive integer, Infinity, or null, if present. Default Infinity.
    //    customInspect: When true, a custom inspect method function will be invoked
    //                   (either undere the util.inspect.custom symbol, or the inspect property).
    //                   When the string 'symbol', only the symbol method will be invoked.
    //                   Default true.
    //           indent: must be "\t", null, or a positive integer. Default null.
    // numericSeparator: must be a boolean, if present. Default false. If true,
    //                   all numbers will be printed with numeric separators
    //                   (eg, 1234.5678 will be printed as '1_234.567_8'
```

### pretty-format

| @require | https://cdn.jsdelivr.net/npm/pretty-format@29.7.0/build/collections.min.js |
| :------- | :--- |
| @docs    |      |

@example
```javascript
    const options = {
        printFunctionName: false,
    };
    console.log(prettyFormat(someVariable, options));
```

| key                 | type            | default     | description | 
| :------------------ | :-------------- | :---------- | :---------------------- | 
| callToJSON          | boolean         | true        | call toJSON method (if it exists) on objects | 
| compareKeys         | function|null   | undefined   | compare function used when sorting object keys,  null can be used to skip over sorting | 
| escapeRegex         | boolean         | false       | escape special characters in regularr expressions | 
| escapeString        | boolean         | true        | escape special characters in strings | 
| highlight          |  boolean         | false       | highlight syntax with colors in terminal (some plugins) | 
| indent              | number          | 2           | spaces in each level of indentation |
| maxDepth            | number          | Infinity    | levels to print in arrays, objects, elements, and so on  |
| maxWidth            | number          | Infinity    | number of elements to print in arrays, sets, and so on |
| min                 | boolean         | false       | minimize added space: no indentation nor line \| breaks |
| plugins             | array           | []          | plugins to serialize application-specific data types |
| printBasicPrototype | boolean         | false       | print the prototype for plain objects and arrays |
| printFunctionName   | boolean         | true        | include or omit the name of a function  |
| theme               | object          |             |  colors to highlight syntax in terminal  | 
Property values of theme are from ANSI-styles colors

#### Pretty Format Plugins
A plugin is a JavaScript object.

If `options` has a `plugins` array: for the first plugin whose `test(val)` method returns a truthy value, then `prettyFormat(val, options)` returns the result from either:
* `serialize(val, …)` method of the improved interface (available in version 21 or later)
* `print(val, …)` method of the original interface (if plugin does not have serialize method)

##### `test`

Write `test` so it can receive a `val` argument of any type. 
To serialize objects which have certain properties, then a guarded expression like `val != null && …` or more concise `val && …` prevents the following errors:
    `TypeError: Cannot read property 'whatever' of null`
    `TypeError: Cannot read property 'whatever' of undefined`

For example, test method of built-in ReactElement plugin:
```javascript
const elementSymbol = Symbol.for('react.element');
const test = val => val && val.$$typeof === elementSymbol;
```
Pay attention to efficiency in test because pretty-format calls it often.


##### `serialize`
[This improved interface is available in version 21 or later.]
               
Write serialize to return a string, given the arguments
	items       value(s) which passed "test"
        config      unchanging config object: derived from options
        indentation current indentation string: concatenate to indent from config
        depth       current depth number: compare to maxDepth from config
        refs        current refs array: find circular references in objects
        printer     printer callback function: serialize children
	
##### `config`
See description for the command, above.

#### Plugin Examples

This plugin is a pattern you can apply to serialize composite data types. 
Side note: pretty-format does not need a plugin to serialize arrays.

```javascript
// We reused more code when we factored out a function for child items
// that is independent of depth, name, and enclosing punctuation (see below).
const SEPARATOR = ',';
function serializeItems(items, config, indentation, depth, refs, printer) {
    if (items.length === 0) {
        return '';
    }
    const indentationItems = indentation + config.indent;
    return (
            config.spacingOuter +
            items
                .map(
                    item =>
                        indentationItems +
                        printer(item, config, indentationItems, depth, refs), // callback
            )
        .join(SEPARATOR + config.spacingInner) +
            (config.min ? '' : SEPARATOR) + // following the last item
            config.spacingOuter +
            indentation
        );
}

const plugin = {
    test(val) {
        return Array.isArray(val);
    },
    serialize(array, config, indentation, depth, refs, printer) {
        const name = array.constructor.name;
        return ++depth > config.maxDepth
                    ? `[${name}]`
                    : `${config.min ? '' : `${name} `}[${serializeItems(
                          array,
                          config,
                          indentation,
                          depth,
                          refs,
                          printer,
                      )}]`;
    },
};

//// Try and see if a class version will work:
class MyPlugin {
    static test(val) {
        return Array.isArray(val);
    }
    static serialize(array, config, indentation, depth, refs, printer) {
        const name = array.constructor.name;
        if (++depth > config.maxDepth) {
            return `[${name}]`
        } else {
            const serItems = serializeItems(  array,
                                              config,
                                              indentation,
                                              depth,
                                              refs,
                                              printer,
                             )
                             
            return `${config.min ? '' : `${name} `}[${serItems}]`;
        }
    }
}
```

Example using 'plugin':
```javascript
const val = {
    filter: 'completed',
    items: [ { text: 'Write test',      completed: true, },
             { text: 'Write serialize', completed: true, },
    ],
};
console.log(
    prettyFormat(val, {
        plugins: [plugin],
    }),
);
```

Example output:
```
    Object {
      "filter": "completed",
      "items": Array [
        Object {
          "completed": true,
          "text": "Write test",
        },
        Object {
          "completed": true,
          "text": "Write serialize",
        },
      ],
    }
```


### pretty-checkbox

| @resource | https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0.3/dist/pretty-checkbox.min.css 
| :------- | :--- |
| @docs    | https://github.com/lokesh-coder/pretty-checkbox    |
| SRI      | sha256-sI14MHRjSf+KF9MjQHjqHkbDPwsdKXUkhBUdnGCg1iU=  |
| github   | https://github.com/lokesh-coder/pretty-checkbox |
| fork     | https://github.com/JustForBrowsing/pretty-checkbox/tree/master |
| @example | https://dev.to/felipperegazio/css-custom-properties-vars-with-sass-scss-a-practical-architecture-strategy-1m88 |

@example
```html
 <div class="pretty p-default">
      <input type="checkbox" />
      <div class="state">
          <label>Check</label>
      </div>
  </div>
```

##### Basic (add to .pretty class):
	p-default, p-curve, p-round, p-thick, (p-plain?)
	p-switch + p-outline, p-fill, p-slim
 
##### Colors (add to .state class):
	p-<color>, p-<color>-o (outline) <= .state
	<color>: primary, success, info, warning, danger
 
##### Font Icons / SVG / Image:
    Tested: font awesome, Glyphocons, MDI, ZMDI, Typeicons, Ion, Material

```html
<div class="pretty p-icon p-svg p-image p-plain">
  <input type="checkbox" />
  <div class="state">
    <i class="icon mdi mdi-check"></i>
    <svg class=“svg svg-icon” … </svg>
    <img class="svg" src="i.svg">
    <img class="image" src="i.*">
    <label> Pay Bills</label>
  </div>
</div>
```

##### Animation (add to .pretty):
p-smooth, p-jelly, p-tada, p-rotate, p-pulse
(jelly, tada don’t work with p-default )
(jelly, tada, rotate, pulse don’t work with p-switch)

##### Plain (.pretty)
  p-plain to remove border when checked
      
##### Toggle (.pretty, ‘p-on’ is ‘checked’)
```html
<div class="pretty p-default p-curve p-toggle">
  <input type="checkbox" />
  <div class="state p-success p-on">
    <label>Subscribed</label>
  </div>
  <div class="state p-danger p-off">
    <label>Subscribe </label>
  </div>
</div>
```

##### States
  Hover: p-has-hover (.p…), p-is-hover (.s…)
  Focus: p-has-focus (.p…)
  Indeterminate: p-has-indeterminate (.p…)
                             p-is-indeterminate (.s…)
  Disable: normal disabled in input
  Lock: p-locked (.p…)
      
##### Size (in .pretty)
  p-bigger (or set .pretty font-size)
      
##### Radio (supports all above)
```javascript
<div class="pretty p-default p-round">
  <input type="radio" name="radio1">
  <div class="state">
    <label>Male</label>
  </div>
</div>
```
      
### CSS Properties
```CSS
section {
  --main-bg-color: brown;
}
:root {
  --main-bg-color: brown;
}
@property --logo-color {
  syntax: "<color>";
  inherits: false;  // true for —-<var>
  initial-value: #c0ffee;
}
details {
  background-color: var(--main-bg-color);
  color: var(--my-var, red);
}
multi-alt {
  color: var(--my-var, 
             var(--my-background, pink));
}
```
```javascript
// get variable from inline style
element.style.getPropertyValue("--my-var");

// get variable from wherever
getComputedStyle(element).getPropertyValue("--my-var");

// set variable on inline style
element.style.setProperty("--my-var", jsVar + 4);
```
















