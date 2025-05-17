// Hand generated single file (merged) browser <script> compatible version of pretty-format.
// Original: https://github.com/jestjs/jest/tree/main/packages/pretty-format
/*jshint -W099 */
   
const _ansiStyles = (() => {
    const ansiStylesExports = {};
    
    const ANSI_BACKGROUND_OFFSET     = 10;
    const wrapAnsi16 =  (offset = 0) => code => `\u001B[${code + offset}m`;
    const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;
    const wrapAnsi16m = (offset = 0) => (red, green, blue) => 
                                            `\u001B[${38 + offset};2;${red};${green};${blue}m`;
    
    const styles = {
        modifier: {
            reset: [0, 0],
            // 21 isn't widely supported and 22 does the same thing
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            overline: [53, 55],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29],
        },
        color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
    
            // Bright color
            blackBright: [90, 39],
            gray: [90, 39], // Alias of `blackBright`
            grey: [90, 39], // Alias of `blackBright`
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39],
        },
        bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
    
            // Bright color
            bgBlackBright: [100, 49],
            bgGray: [100, 49], // Alias of `bgBlackBright`
            bgGrey: [100, 49], // Alias of `bgBlackBright`
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49],
        },
    };
    
    const modifierNames        = Object.keys(styles.modifier);
    const foregroundColorNames = Object.keys(styles.color);
    const backgroundColorNames = Object.keys(styles.bgColor);
    const colorNames           = [...foregroundColorNames, ...backgroundColorNames];
    
    function assembleStyles() {
        const codes = new Map();
    
        for (const [groupName, group] of Object.entries(styles)) {
            for (const [styleName, style] of Object.entries(group)) {
                styles[styleName] = {
                    open: `\u001B[${style[0]}m`,
                    close: `\u001B[${style[1]}m`,
                };
    
                group[styleName] = styles[styleName];
    
                codes.set(style[0], style[1]);
            }
    
            Object.defineProperty(styles, groupName, {
                value: group,
                enumerable: false,
            });
        }
    
        Object.defineProperty(styles, 'codes', {
            value: codes,
            enumerable: false,
        });
    
        styles.color.close   = '\u001B[39m';
        styles.bgColor.close = '\u001B[49m';
    
        styles.color.ansi      = wrapAnsi16();
        styles.color.ansi256   = wrapAnsi256();
        styles.color.ansi16m   = wrapAnsi16m();
        styles.bgColor.ansi    = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
        styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
        styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
    
        // From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
        Object.defineProperties(styles, {
            rgbToAnsi256: {
                value(red, green, blue) {
                    // We use the extended greyscale palette here, with the exception of
                    // black and white. normal palette only has 4 greyscale shades.
                    if (red === green && green === blue) {
                        if (red < 8) {
                            return 16;
                        }
    
                        if (red > 248) {
                            return 231;
                        }
    
                        return Math.round(((red - 8) / 247) * 24) + 232;
                    }
    
                    return 16
                        + (36 * Math.round(red / 255 * 5))
                        + (6 * Math.round(green / 255 * 5))
                        + Math.round(blue / 255 * 5);
                },
                enumerable: false,
            },
            hexToRgb: {
                value(hex) {
                    const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
                    if (!matches) {
                        return [0, 0, 0];
                    }
    
                    let [colorString] = matches;
    
                    if (colorString.length === 3) {
                        colorString = [...colorString].map(character => character + character).join('');
                    }
    
                    const integer = Number.parseInt(colorString, 16);
    
                    return [
                        /* eslint-disable no-bitwise */
                        (integer >> 16) & 0xFF,
                        (integer >> 8) & 0xFF,
                        integer & 0xFF,
                        /* eslint-enable no-bitwise */
                    ];
                },
                enumerable: false,
            },
            hexToAnsi256: {
                value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
                enumerable: false,
            },
            ansi256ToAnsi: {
                value(code) {
                    if (code < 8) {
                        return 30 + code;
                    }
    
                    if (code < 16) {
                        return 90 + (code - 8);
                    }
    
                    let red;
                    let green;
                    let blue;
    
                    if (code >= 232) {
                        red = (((code - 232) * 10) + 8) / 255;
                        green = red;
                        blue = red;
                    } else {
                        code -= 16;
    
                        const remainder = code % 36;
    
                        red = Math.floor(code / 36) / 5;
                        green = Math.floor(remainder / 6) / 5;
                        blue = (remainder % 6) / 5;
                    }
    
                    const value = Math.max(red, green, blue) * 2;
    
                    if (value === 0) {
                        return 30;
                    }
    
                    // eslint-disable-next-line no-bitwise
                    let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));
    
                    if (value === 2) {
                        result += 60;
                    }
    
                    return result;
                },
                enumerable: false,
            },
            rgbToAnsi: {
                value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
                enumerable: false,
            },
            hexToAnsi: {
                value: hex => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
                enumerable: false,
            },
        });
    
        return styles;
    }
    ansiStylesExports.default = assembleStyles();
    ansiStylesExports.names = {
        modifiers: modifierNames,
        foregroundColor: foregroundColorNames,
        backgroundColor: backgroundColorNames,
        color: colorNames,
    };
    
    return ansiStylesExports;
})();







const _collections = (() => {
    'use strict';
    
    const collectionExports = {};
    collectionExports.printIteratorEntries  = printIteratorEntries;
    collectionExports.printIteratorValues   = printIteratorValues;
    collectionExports.printListItems        = printListItems;
    collectionExports.printObjectProperties = printObjectProperties;
    
    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     *
     */
    const getKeysOfEnumerableProperties = (object, compareKeys) => {
      const rawKeys = Object.keys(object);
      const keys = compareKeys !== null ? rawKeys.sort(compareKeys) : rawKeys;
      if (Object.getOwnPropertySymbols) {
        Object.getOwnPropertySymbols(object).forEach(symbol => {
          if (Object.getOwnPropertyDescriptor(object, symbol).enumerable) {
            keys.push(symbol);
          }
        });
      }
      return keys;
    };
    
    /**
     * Return entries (for example, of a map)
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, braces)
     */
    function printIteratorEntries(
      iterator,
      config,
      indentation,
      depth,
      refs,
      printer,
      // Too bad, so sad that separator for ECMAScript Map has been ' => '
      // What a distracting diff if you change a data structure to/from
      // ECMAScript Object or Immutable.Map/OrderedMap which use the default.
      separator = ': '
    ) {
      let result = '';
      let width = 0;
      let current = iterator.next();
      if (!current.done) {
        result += config.spacingOuter;
        const indentationNext = indentation + config.indent;
        while (!current.done) {
          result += indentationNext;
          if (width++ === config.maxWidth) {
            result += '…';
            break;
          }
          const name = printer(
            current.value[0],
            config,
            indentationNext,
            depth,
            refs
          );
          const value = printer(
            current.value[1],
            config,
            indentationNext,
            depth,
            refs
          );
          result += name + separator + value;
          current = iterator.next();
          if (!current.done) {
            result += `,${config.spacingInner}`;
          } else if (!config.min) {
            result += ',';
          }
        }
        result += config.spacingOuter + indentation;
      }
      return result;
    }
    
    /**
     * Return values (for example, of a set)
     * with spacing, indentation, and comma
     * without surrounding punctuation (braces or brackets)
     */
    function printIteratorValues(
      iterator,
      config,
      indentation,
      depth,
      refs,
      printer
    ) {
      let result = '';
      let width = 0;
      let current = iterator.next();
      if (!current.done) {
        result += config.spacingOuter;
        const indentationNext = indentation + config.indent;
        while (!current.done) {
          result += indentationNext;
          if (width++ === config.maxWidth) {
            result += '…';
            break;
          }
          result += printer(current.value, config, indentationNext, depth, refs);
          current = iterator.next();
          if (!current.done) {
            result += `,${config.spacingInner}`;
          } else if (!config.min) {
            result += ',';
          }
        }
        result += config.spacingOuter + indentation;
      }
      return result;
    }
    
    /**
     * Return items (for example, of an array)
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, brackets)
     **/
    function printListItems(list, config, indentation, depth, refs, printer) {
      let result = '';
      if (list.length) {
        result += config.spacingOuter;
        const indentationNext = indentation + config.indent;
        for (let i = 0; i < list.length; i++) {
          result += indentationNext;
          if (i === config.maxWidth) {
            result += '…';
            break;
          }
          if (i in list) {
            result += printer(list[i], config, indentationNext, depth, refs);
          }
          if (i < list.length - 1) {
            result += `,${config.spacingInner}`;
          } else if (!config.min) {
            result += ',';
          }
        }
        result += config.spacingOuter + indentation;
      }
      return result;
    }
    
    /**
     * Return properties of an object
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, braces)
     */
    function printObjectProperties(val, config, indentation, depth, refs, printer) {
      let result = '';
      const keys = getKeysOfEnumerableProperties(val, config.compareKeys);
      if (keys.length) {
        result += config.spacingOuter;
        const indentationNext = indentation + config.indent;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = printer(key, config, indentationNext, depth, refs);
          const value = printer(val[key], config, indentationNext, depth, refs);
          result += `${indentationNext + name}: ${value}`;
          if (i < keys.length - 1) {
            result += `,${config.spacingInner}`;
          } else if (!config.min) {
            result += ',';
          }
        }
        result += config.spacingOuter + indentation;
      }
      return result;
    }
    
    return collectionExports;
})();



const _markup = (() => {
    'use strict';
    
    const markupExports = {};
    markupExports.printText          = void 0;
    markupExports.printProps         = void 0;
    markupExports.printElementAsLeaf = void 0;
    markupExports.printElement       = void 0;
    markupExports.printComment       = void 0;
    markupExports.printChildren      = void 0;
        
    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    function _escapeHTML(str) {
      return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    
    
    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    // Return empty string if keys is empty.
    const printProps = (keys, props, config, indentation, depth, refs, printer) => {
      const indentationNext = indentation + config.indent;
      const colors = config.colors;
      return keys
        .map(key => {
          const value = props[key];
          let printed = printer(value, config, indentationNext, depth, refs);
          if (typeof value !== 'string') {
            if (printed.indexOf('\n') !== -1) {
              printed =
                config.spacingOuter +
                indentationNext +
                printed +
                config.spacingOuter +
                indentation;
            }
            printed = `{${printed}}`;
          }
          return `${
            config.spacingInner +
            indentation +
            colors.prop.open +
            key +
            colors.prop.close
          }=${colors.value.open}${printed}${colors.value.close}`;
        })
        .join('');
    };
    
    // Return empty string if children is empty.
    markupExports.printProps = printProps;
    const printChildren = (children, config, indentation, depth, refs, printer) =>
      children
        .map(
          child =>
            config.spacingOuter +
            indentation +
            (typeof child === 'string'
              ? printText(child, config)
              : printer(child, config, indentation, depth, refs))
        )
        .join('');
    markupExports.printChildren = printChildren;
    const printText = (text, config) => {
      const contentColor = config.colors.content;
      return (
        contentColor.open + (0, _escapeHTML.default)(text) + contentColor.close
      );
    };
    markupExports.printText = printText;
    const printComment = (comment, config) => {
      const commentColor = config.colors.comment;
      return `${commentColor.open}<!--${(0, _escapeHTML.default)(comment)}-->${
        commentColor.close
      }`;
    };
    
    // Separate the functions to format props, children, and element,
    // so a plugin could override a particular function, if needed.
    // Too bad, so sad: the traditional (but unnecessary) space
    // in a self-closing tagColor requires a second test of printedProps.
    markupExports.printComment = printComment;
    const printedChildrenStr = printedChildren
          ? `>${tagColor.close}${printedChildren}${config.spacingOuter}${indentation}${tagColor.open}</${type}`
          : `${printedProps && !config.min ? '' : ' '}/`;
    const printElement = (
      type,
      printedProps,
      printedChildren,
      config,
      indentation
    ) => {
      const tagColor = config.colors.tag;
      return `${tagColor.open}<${type}${
        printedProps &&
        tagColor.close +
          printedProps +
          config.spacingOuter +
          indentation +
          tagColor.open
      }${printedChildrenStr}>${tagColor.close}`;
    };
    markupExports.printElement = printElement;
    const printElementAsLeaf = (type, config) => {
      const tagColor = config.colors.tag;
      return `${tagColor.open}<${type}${tagColor.close} …${tagColor.open} />${tagColor.close}`;
    };
    markupExports.printElementAsLeaf = printElementAsLeaf;

    return markupExports;
})();


const _AsymmetricMatcher = (() => {
    'use strict';
    
    const asymmetricMatcherExports = {};
    asymmetricMatcherExports.test      = void 0;
    asymmetricMatcherExports.serialize = void 0;
    asymmetricMatcherExports.default   = void 0;
    
    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    const asymmetricMatcher =
      typeof Symbol === 'function' && Symbol.for
        ? Symbol.for('jest.asymmetricMatcher')
        : 0x1357a5;
    const SPACE = ' ';
    const serialize = (val, config, indentation, depth, refs, printer) => {
      const stringedValue = val.toString();
      if (
        stringedValue === 'ArrayContaining' ||
        stringedValue === 'ArrayNotContaining'
      ) {
        if (++depth > config.maxDepth) {
          return `[${stringedValue}]`;
        }
        return `${stringedValue + SPACE}[${(0, _collections.printListItems)(
          val.sample,
          config,
          indentation,
          depth,
          refs,
          printer
        )}]`;
      }
      if (
        stringedValue === 'ObjectContaining' ||
        stringedValue === 'ObjectNotContaining'
      ) {
        if (++depth > config.maxDepth) {
          return `[${stringedValue}]`;
        }
        return `${stringedValue + SPACE}{${(0, _collections.printObjectProperties)(
          val.sample,
          config,
          indentation,
          depth,
          refs,
          printer
        )}}`;
      }
      if (
        stringedValue === 'StringMatching' ||
        stringedValue === 'StringNotMatching'
      ) {
        return (
          stringedValue +
          SPACE +
          printer(val.sample, config, indentation, depth, refs)
        );
      }
      if (
        stringedValue === 'StringContaining' ||
        stringedValue === 'StringNotContaining'
      ) {
        return (
          stringedValue +
          SPACE +
          printer(val.sample, config, indentation, depth, refs)
        );
      }
      if (typeof val.toAsymmetricMatcher !== 'function') {
        throw new Error(
          `Asymmetric matcher ${val.constructor.name} does not implement toAsymmetricMatcher()`
        );
      }
      return val.toAsymmetricMatcher();
    };
    asymmetricMatcherExports.serialize = serialize;
    const test = val => val && val.$$typeof === asymmetricMatcher;
    asymmetricMatcherExports.test = test;
    const plugin = {
      serialize,
      test
    };
    var _default = plugin;
    asymmetricMatcherExports.default = _default;
    
    return asymmetricMatcherExports;

})();







var _DOMCollection = (() => {
    'use strict';
    
    const domCollectionExports = {};
    domCollectionExports.test      = void 0;
    domCollectionExports.serialize = void 0;
    domCollectionExports.default   = void 0;

    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    const SPACE = ' ';
    const OBJECT_NAMES = ['DOMStringMap', 'NamedNodeMap'];
    const ARRAY_REGEXP = /^(HTML\w*Collection|NodeList)$/;
    const testName = name => OBJECT_NAMES.indexOf(name) !== -1 || ARRAY_REGEXP.test(name);
    const test = val => val &&
                        val.constructor &&
                        !!val.constructor.name &&
                        testName(val.constructor.name);
    domCollectionExports.test = test;
    const isNamedNodeMap = collection => collection.constructor.name === 'NamedNodeMap';
    const serialize = (collection, config, indentation, depth, refs, printer) => {
      const name = collection.constructor.name;
      if (++depth > config.maxDepth) {
        return `[${name}]`;
      }
      return (
        (config.min ? '' : name + SPACE) +
        (OBJECT_NAMES.indexOf(name) !== -1
          ? `{${(0, _collections.printObjectProperties)(
              isNamedNodeMap(collection)
                ? Array.from(collection).reduce((props, attribute) => {
                    props[attribute.name] = attribute.value;
                    return props;
                  }, {})
                : {
                    ...collection
                  },
              config,
              indentation,
              depth,
              refs,
              printer
            )}}`
          : `[${(0, _collections.printListItems)(
              Array.from(collection),
              config,
              indentation,
              depth,
              refs,
              printer
            )}]`)
      );
    };
    domCollectionExports.serialize = serialize;
    const plugin = {
      serialize,
      test
    };
    var _default = plugin;
    domCollectionExports.default = _default;
    
    return domCollectionExports;

})();






var _DOMElement = (() => {
    'use strict';
    
    const domElementExports = {};
    domElementExports.test      = void 0;
    domElementExports.serialize = void 0;
    domElementExports.default   = void 0;
    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    const ELEMENT_NODE = 1;
    const TEXT_NODE = 3;
    const COMMENT_NODE = 8;
    const FRAGMENT_NODE = 11;
    const ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/;
    const testHasAttribute = val => {
      try {
        return typeof val.hasAttribute === 'function' && val.hasAttribute('is');
      } catch {
        return false;
      }
    };
    const testNode = val => {
      const constructorName = val.constructor.name;
      const {nodeType, tagName} = val;
      const isCustomElement =
        (typeof tagName === 'string' && tagName.includes('-')) ||
        testHasAttribute(val);
      return (
        (nodeType === ELEMENT_NODE &&
          (ELEMENT_REGEXP.test(constructorName) || isCustomElement)) ||
        (nodeType === TEXT_NODE && constructorName === 'Text') ||
        (nodeType === COMMENT_NODE && constructorName === 'Comment') ||
        (nodeType === FRAGMENT_NODE && constructorName === 'DocumentFragment')
      );
    };
    const test = val => val?.constructor?.name && testNode(val);
    domElementExports.test = test;
    function nodeIsText(node) {
      return node.nodeType === TEXT_NODE;
    }
    function nodeIsComment(node) {
      return node.nodeType === COMMENT_NODE;
    }
    function nodeIsFragment(node) {
      return node.nodeType === FRAGMENT_NODE;
    }
    const serialize = (node, config, indentation, depth, refs, printer) => {
      if (nodeIsText(node)) {
        return (0, _markup.printText)(node.data, config);
      }
      if (nodeIsComment(node)) {
        return (0, _markup.printComment)(node.data, config);
      }
      const type = nodeIsFragment(node)
        ? 'DocumentFragment'
        : node.tagName.toLowerCase();
      if (++depth > config.maxDepth) {
        return (0, _markup.printElementAsLeaf)(type, config);
      }
      return (0, _markup.printElement)(
        type,
        (0, _markup.printProps)(
          nodeIsFragment(node)
            ? []
            : Array.from(node.attributes, attr => attr.name).sort(),
          nodeIsFragment(node)
            ? {}
            : Array.from(node.attributes).reduce((props, attribute) => {
                props[attribute.name] = attribute.value;
                return props;
              }, {}),
          config,
          indentation + config.indent,
          depth,
          refs,
          printer
        ),
        (0, _markup.printChildren)(
          Array.prototype.slice.call(node.childNodes || node.children),
          config,
          indentation + config.indent,
          depth,
          refs,
          printer
        ),
        config,
        indentation
      );
    };
    domElementExports.serialize = serialize;
    const plugin = {
      serialize,
      test
    };
    var _default = plugin;
    domElementExports.default = _default;
    
    return domElementExports;

})();





var _Immutable = (() => {
    const immutableExports = {};
    immutableExports.test      = void 0;
    immutableExports.serialize = void 0;
    immutableExports.default   = void 0;
    
    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    // SENTINEL constants are from https://github.com/facebook/immutable-js
    const IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
    const IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';
    const IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
    const IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';
    const IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
    const IS_RECORD_SENTINEL = '@@__IMMUTABLE_RECORD__@@'; // immutable v4
    const IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';
    const IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';
    const IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';
    const getImmutableName = name => `Immutable.${name}`;
    const printAsLeaf = name => `[${name}]`;
    const SPACE = ' ';
    const LAZY = '…'; // Seq is lazy if it calls a method like filter
    
    const printImmutableEntries = (
      val,
      config,
      indentation,
      depth,
      refs,
      printer,
      type
    ) =>
      ++depth > config.maxDepth
        ? printAsLeaf(getImmutableName(type))
        : `${getImmutableName(type) + SPACE}{${(0,
          _collections.printIteratorEntries)(
            val.entries(),
            config,
            indentation,
            depth,
            refs,
            printer
          )}}`;
    
    // Record has an entries method because it is a collection in immutable v3.
    // Return an iterator for Immutable Record from version v3 or v4.
    function getRecordEntries(val) {
      let i = 0;
      return {
        next() {
          if (i < val._keys.length) {
            const key = val._keys[i++];
            return {
              done: false,
              value: [key, val.get(key)]
            };
          }
          return {
            done: true,
            value: undefined
          };
        }
      };
    }
    const printImmutableRecord = (
      val,
      config,
      indentation,
      depth,
      refs,
      printer
    ) => {
      // _name property is defined only for an Immutable Record instance
      // which was constructed with a second optional descriptive name arg
      const name = getImmutableName(val._name || 'Record');
      return ++depth > config.maxDepth
        ? printAsLeaf(name)
        : `${name + SPACE}{${(0, _collections.printIteratorEntries)(
            getRecordEntries(val),
            config,
            indentation,
            depth,
            refs,
            printer
          )}}`;
    };
    const printImmutableSeq = (val, config, indentation, depth, refs, printer) => {
      const name = getImmutableName('Seq');
      if (++depth > config.maxDepth) {
        return printAsLeaf(name);
      }
      if (val[IS_KEYED_SENTINEL]) {
        return `${name + SPACE}{${
          // from Immutable collection of entries or from ECMAScript object
          val._iter || val._object
            ? (0, _collections.printIteratorEntries)(
                val.entries(),
                config,
                indentation,
                depth,
                refs,
                printer
              )
            : LAZY
        }}`;
      }
      return `${name + SPACE}[${
        val._iter ||
        // from Immutable collection of values
        val._array ||
        // from ECMAScript array
        val._collection ||
        // from ECMAScript collection in immutable v4
        val._iterable // from ECMAScript collection in immutable v3
          ? (0, _collections.printIteratorValues)(
              val.values(),
              config,
              indentation,
              depth,
              refs,
              printer
            )
          : LAZY
      }]`;
    };
    const printImmutableValues = (
      val,
      config,
      indentation,
      depth,
      refs,
      printer,
      type
    ) =>
      ++depth > config.maxDepth
        ? printAsLeaf(getImmutableName(type))
        : `${getImmutableName(type) + SPACE}[${(0,
          _collections.printIteratorValues)(
            val.values(),
            config,
            indentation,
            depth,
            refs,
            printer
          )}]`;
    const serialize = (val, config, indentation, depth, refs, printer) => {
      if (val[IS_MAP_SENTINEL]) {
        return printImmutableEntries(
          val,
          config,
          indentation,
          depth,
          refs,
          printer,
          val[IS_ORDERED_SENTINEL] ? 'OrderedMap' : 'Map'
        );
      }
      if (val[IS_LIST_SENTINEL]) {
        return printImmutableValues(
          val,
          config,
          indentation,
          depth,
          refs,
          printer,
          'List'
        );
      }
      if (val[IS_SET_SENTINEL]) {
        return printImmutableValues(
          val,
          config,
          indentation,
          depth,
          refs,
          printer,
          val[IS_ORDERED_SENTINEL] ? 'OrderedSet' : 'Set'
        );
      }
      if (val[IS_STACK_SENTINEL]) {
        return printImmutableValues(
          val,
          config,
          indentation,
          depth,
          refs,
          printer,
          'Stack'
        );
      }
      if (val[IS_SEQ_SENTINEL]) {
        return printImmutableSeq(val, config, indentation, depth, refs, printer);
      }
    
      // For compatibility with immutable v3 and v4, let record be the default.
      return printImmutableRecord(val, config, indentation, depth, refs, printer);
    };
    
    // Explicitly comparing sentinel properties to true avoids false positive
    // when mock identity-obj-proxy returns the key as the value for any key.
    immutableExports.serialize = serialize;
    const test = val =>
      val &&
      (val[IS_ITERABLE_SENTINEL] === true || val[IS_RECORD_SENTINEL] === true);
    immutableExports.test = test;
    const plugin = {
      serialize,
      test
    };
    var _default = plugin;
    immutableExports.default = _default;
    
    return immutableExports;

})();








(() => {
    const prettyFormatExports = {};
    prettyFormatExports.default         = void 0;
    prettyFormatExports.DEFAULT_OPTIONS = void 0;
    prettyFormatExports.format          = format;
    prettyFormatExports.plugins         = void 0;
    
    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    /* eslint-disable local/ban-types-eventually */
    
    const toString = Object.prototype.toString;
    const toISOString = Date.prototype.toISOString;
    const errorToString = Error.prototype.toString;
    const regExpToString = RegExp.prototype.toString;
    
    /**
     * Explicitly comparing typeof constructor to function avoids undefined as name
     * when mock identity-obj-proxy returns the key as the value for any key.
     */
    const getConstructorName = val =>
      (typeof val.constructor === 'function' && val.constructor.name) || 'Object';
    
    /* global window */
    /** Is val is equal to global window object? Works even if it does not exist :) */
    const isWindow = val => typeof window !== 'undefined' && val === window;
    const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
    const NEWLINE_REGEXP = /\n/gi;
    class PrettyFormatPluginError extends Error {
      constructor(message, stack) {
        super(message);
        this.stack = stack;
        this.name = this.constructor.name;
      }
    }
    function isToStringedArrayType(toStringed) {
      return (
        toStringed === '[object Array]' ||
        toStringed === '[object ArrayBuffer]' ||
        toStringed === '[object DataView]' ||
        toStringed === '[object Float32Array]' ||
        toStringed === '[object Float64Array]' ||
        toStringed === '[object Int8Array]' ||
        toStringed === '[object Int16Array]' ||
        toStringed === '[object Int32Array]' ||
        toStringed === '[object Uint8Array]' ||
        toStringed === '[object Uint8ClampedArray]' ||
        toStringed === '[object Uint16Array]' ||
        toStringed === '[object Uint32Array]'
      );
    }
    function printNumber(val) {
      return Object.is(val, -0) ? '-0' : String(val);
    }
    function printBigInt(val) {
      return String(`${val}n`);
    }
    function printFunction(val, printFunctionName) {
      if (!printFunctionName) {
        return '[Function]';
      }
      return `[Function ${val.name || 'anonymous'}]`;
    }
    function printSymbol(val) {
      return String(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
    }
    function printError(val) {
      return `[${errorToString.call(val)}]`;
    }
    
    /**
     * The first port of call for printing an object, handles most of the
     * data-types in JS.
     */
    function printBasicValue(val, printFunctionName, escapeRegex, escapeString) {
      if (val === true || val === false) {
        return `${val}`;
      }
      if (val === undefined) {
        return 'undefined';
      }
      if (val === null) {
        return 'null';
      }
      const typeOf = typeof val;
      if (typeOf === 'number') {
        return printNumber(val);
      }
      if (typeOf === 'bigint') {
        return printBigInt(val);
      }
      if (typeOf === 'string') {
        if (escapeString) {
          return `"${val.replace(/"|\\/g, '\\$&')}"`;
        }
        return `"${val}"`;
      }
      if (typeOf === 'function') {
        return printFunction(val, printFunctionName);
      }
      if (typeOf === 'symbol') {
        return printSymbol(val);
      }
      const toStringed = toString.call(val);
      if (toStringed === '[object WeakMap]') {
        return 'WeakMap {}';
      }
      if (toStringed === '[object WeakSet]') {
        return 'WeakSet {}';
      }
      if (
        toStringed === '[object Function]' ||
        toStringed === '[object GeneratorFunction]'
      ) {
        return printFunction(val, printFunctionName);
      }
      if (toStringed === '[object Symbol]') {
        return printSymbol(val);
      }
      if (toStringed === '[object Date]') {
        return isNaN(+val) ? 'Date { NaN }' : toISOString.call(val);
      }
      if (toStringed === '[object Error]') {
        return printError(val);
      }
      if (toStringed === '[object RegExp]') {
        if (escapeRegex) {
          // https://github.com/benjamingr/RegExp.escape/blob/main/polyfill.js
          return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
        }
        return regExpToString.call(val);
      }
      if (val instanceof Error) {
        return printError(val);
      }
      return null;
    }
    
    /**
     * Handles more complex objects ( such as objects with circular references.
     * maps and sets etc )
     */
    function printComplexValue(
      val,
      config,
      indentation,
      depth,
      refs,
      hasCalledToJSON
    ) {
      if (refs.indexOf(val) !== -1) {
        return '[Circular]';
      }
      refs = refs.slice();
      refs.push(val);
      const hitMaxDepth = ++depth > config.maxDepth;
      const min = config.min;
      if (
        config.callToJSON &&
        !hitMaxDepth &&
        val.toJSON &&
        typeof val.toJSON === 'function' &&
        !hasCalledToJSON
      ) {
        return printer(val.toJSON(), config, indentation, depth, refs, true);
      }
      const toStringed = toString.call(val);
      if (toStringed === '[object Arguments]') {
        return hitMaxDepth
          ? '[Arguments]'
          : `${min ? '' : 'Arguments '}[${(0, _collections.printListItems)(
              val,
              config,
              indentation,
              depth,
              refs,
              printer
            )}]`;
      }
      if (isToStringedArrayType(toStringed)) {
        return hitMaxDepth
          ? `[${val.constructor.name}]`
          : `${
              min
                ? ''
                : !config.printBasicPrototype && val.constructor.name === 'Array'
                ? ''
                : `${val.constructor.name} `
            }[${(0, _collections.printListItems)(
              val,
              config,
              indentation,
              depth,
              refs,
              printer
            )}]`;
      }
      if (toStringed === '[object Map]') {
        return hitMaxDepth
          ? '[Map]'
          : `Map {${(0, _collections.printIteratorEntries)(
              val.entries(),
              config,
              indentation,
              depth,
              refs,
              printer,
              ' => '
            )}}`;
      }
      if (toStringed === '[object Set]') {
        return hitMaxDepth
          ? '[Set]'
          : `Set {${(0, _collections.printIteratorValues)(
              val.values(),
              config,
              indentation,
              depth,
              refs,
              printer
            )}}`;
      }
    
      // Avoid failure to serialize global window object in jsdom test environment.
      // For example, not even relevant if window is prop of React element.
      return hitMaxDepth || isWindow(val)
        ? `[${getConstructorName(val)}]`
        : `${
            min
              ? ''
              : !config.printBasicPrototype && getConstructorName(val) === 'Object'
              ? ''
              : `${getConstructorName(val)} `
          }{${(0, _collections.printObjectProperties)(
            val,
            config,
            indentation,
            depth,
            refs,
            printer
          )}}`;
    }
    function isNewPlugin(plugin) {
      return plugin.serialize != null;
    }
    function printPlugin(plugin, val, config, indentation, depth, refs) {
      let printed;
      try {
        printed = isNewPlugin(plugin)
          ? plugin.serialize(val, config, indentation, depth, refs, printer)
          : plugin.print(
              val,
              valChild => printer(valChild, config, indentation, depth, refs),
              str => {
                const indentationNext = indentation + config.indent;
                return (
                  indentationNext +
                  str.replace(NEWLINE_REGEXP, `\n${indentationNext}`)
                );
              },
              {
                edgeSpacing: config.spacingOuter,
                min: config.min,
                spacing: config.spacingInner
              },
              config.colors
            );
      } catch (error) {
        throw new PrettyFormatPluginError(error.message, error.stack);
      }
      if (typeof printed !== 'string') {
        throw new Error(
          `pretty-format: Plugin must return type "string" but instead returned "${typeof printed}".`
        );
      }
      return printed;
    }
    function findPlugin(plugins, val) {
      for (let p = 0; p < plugins.length; p++) {
        try {
          if (plugins[p].test(val)) {
            return plugins[p];
          }
        } catch (error) {
          throw new PrettyFormatPluginError(error.message, error.stack);
        }
      }
      return null;
    }
    function printer(val, config, indentation, depth, refs, hasCalledToJSON) {
      const plugin = findPlugin(config.plugins, val);
      if (plugin !== null) {
        return printPlugin(plugin, val, config, indentation, depth, refs);
      }
      const basicResult = printBasicValue(
        val,
        config.printFunctionName,
        config.escapeRegex,
        config.escapeString
      );
      if (basicResult !== null) {
        return basicResult;
      }
      return printComplexValue(
        val,
        config,
        indentation,
        depth,
        refs,
        hasCalledToJSON
      );
    }
    const DEFAULT_THEME = {
      comment: 'gray',
      content: 'reset',
      prop: 'yellow',
      tag: 'cyan',
      value: 'green'
    };
    const DEFAULT_THEME_KEYS = Object.keys(DEFAULT_THEME);
    
    // could be replaced by `satisfies` operator in the future: https://github.com/microsoft/TypeScript/issues/47920
    const toOptionsSubtype = options => options;
    const DEFAULT_OPTIONS = toOptionsSubtype({
      callToJSON: true,
      compareKeys: undefined,
      escapeRegex: false,
      escapeString: true,
      highlight: false,
      indent: 2,
      maxDepth: Infinity,
      maxWidth: Infinity,
      min: false,
      plugins: [],
      printBasicPrototype: true,
      printFunctionName: true,
      theme: DEFAULT_THEME
    });
    prettyFormatExports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
    function validateOptions(options) {
      Object.keys(options).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(DEFAULT_OPTIONS, key)) {
          throw new Error(`pretty-format: Unknown option "${key}".`);
        }
      });
      if (options.min && options.indent !== undefined && options.indent !== 0) {
        throw new Error(
          'pretty-format: Options "min" and "indent" cannot be used together.'
        );
      }
      if (options.theme !== undefined) {
        if (options.theme === null) {
          throw new Error('pretty-format: Option "theme" must not be null.');
        }
        if (typeof options.theme !== 'object') {
          throw new Error(
            `pretty-format: Option "theme" must be of type "object" but instead received "${typeof options.theme}".`
          );
        }
      }
    }
    const getColorsHighlight = options =>
      DEFAULT_THEME_KEYS.reduce((colors, key) => {
        const value =
          options.theme && options.theme[key] !== undefined
            ? options.theme[key]
            : DEFAULT_THEME[key];
        const color = value && _ansiStyles.default[value];
        if (
          color &&
          typeof color.close === 'string' &&
          typeof color.open === 'string'
        ) {
          colors[key] = color;
        } else {
          throw new Error(
            `pretty-format: Option "theme" has a key "${key}" whose value "${value}" is undefined in ansi-styles.`
          );
        }
        return colors;
      }, Object.create(null));
    const getColorsEmpty = () =>
      DEFAULT_THEME_KEYS.reduce((colors, key) => {
        colors[key] = {
          close: '',
          open: ''
        };
        return colors;
      }, Object.create(null));
    const getPrintFunctionName = options =>
      options?.printFunctionName ?? DEFAULT_OPTIONS.printFunctionName;
    const getEscapeRegex = options =>
      options?.escapeRegex ?? DEFAULT_OPTIONS.escapeRegex;
    const getEscapeString = options =>
      options?.escapeString ?? DEFAULT_OPTIONS.escapeString;
    const getConfig = options => ({
      callToJSON: options?.callToJSON ?? DEFAULT_OPTIONS.callToJSON,
      colors: options?.highlight ? getColorsHighlight(options) : getColorsEmpty(),
      compareKeys:
        typeof options?.compareKeys === 'function' || options?.compareKeys === null
          ? options.compareKeys
          : DEFAULT_OPTIONS.compareKeys,
      escapeRegex: getEscapeRegex(options),
      escapeString: getEscapeString(options),
      indent: options?.min
        ? ''
        : createIndent(options?.indent ?? DEFAULT_OPTIONS.indent),
      maxDepth: options?.maxDepth ?? DEFAULT_OPTIONS.maxDepth,
      maxWidth: options?.maxWidth ?? DEFAULT_OPTIONS.maxWidth,
      min: options?.min ?? DEFAULT_OPTIONS.min,
      plugins: options?.plugins ?? DEFAULT_OPTIONS.plugins,
      printBasicPrototype: options?.printBasicPrototype ?? true,
      printFunctionName: getPrintFunctionName(options),
      spacingInner: options?.min ? ' ' : '\n',
      spacingOuter: options?.min ? '' : '\n'
    });
    function createIndent(indent) {
      return new Array(indent + 1).join(' ');
    }
    
    /**
     * Returns a presentation string of your `val` object
     * @param val any potential JavaScript object
     * @param options Custom settings
     */
    function format(val, options) {
      if (options) {
        validateOptions(options);
        if (options.plugins) {
          const plugin = findPlugin(options.plugins, val);
          if (plugin !== null) {
            return printPlugin(plugin, val, getConfig(options), '', 0, []);
          }
        }
      }
      const basicResult = printBasicValue(
        val,
        getPrintFunctionName(options),
        getEscapeRegex(options),
        getEscapeString(options)
      );
      if (basicResult !== null) {
        return basicResult;
      }
      return printComplexValue(val, getConfig(options), '', 0, []);
    }
    const plugins = {
      AsymmetricMatcher:  _AsymmetricMatcher.default,
      DOMCollection:      _DOMCollection.default,
      DOMElement:         _DOMElement.default,
      Immutable:          _Immutable.default,
      // ReactElement:       _ReactElement.default,
      // ReactTestComponent: _ReactTestComponent.default
    };
    
    prettyFormatExports.plugins = plugins;
    var _default = format;
    prettyFormatExports.default = _default;
    
    return prettyFormatExports;
})();
