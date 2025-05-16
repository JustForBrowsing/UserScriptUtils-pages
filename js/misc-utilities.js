// This file is a collection of useful utilities for UserScripts
// Adaptation by JustForBrowsing, (C) 2025

//// Includes the following libraries: 
////    - common-tags             // https://github.com/zspecza/common-tags
////    - safe-stable-stringify   // https://github.com/BridgeAR/safe-stable-stringify


/* Adapted (to not be a module) from 
    https://cdn.jsdelivr.net/npm/safe-stable-stringify@2.5.0/index.min.js
         by JustForBrowsing, (C) 2025
*/
/* License for the adaptations needed to merge these files:
License (MIT)
Copyright © 2025 JustForBrowsing

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
*/

// use UMD pattern to prevent all of the support stuff becomming part of the main namespace 
(function (global, factory) {
    'object' === typeof exports && 'undefined' !== typeof module
        ? module.exports = { safeStableStringify: factory(),
                             commonTags: global.commonTags }
    : typeof define === 'function' && define.amd 
        ? define(factory, global.commonTags) 
        : (global.safeStableStringify = factory(),
           global.commonTags = global.commonTags || {});
}(this, (function (global) { 
'use strict'
    
/* OLD common-tags UMD   ------------------------------------------------
! function(n, r) {
    "object" == typeof exports 
                && "undefined" != typeof module
                      ? r(exports) 
                      : "function" == typeof define 
                && define.amd 
                      ? define(["exports"], r) 
                      : r(n.commonTags = n.commonTags || {})
}(this, function(n) {
    "use strict";
*/

// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
/* common-tags
   https://github.com/zspecza/common-tags

License (MIT)
Copyright © Declan de Wet

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
*/
    var r, t, o = function() {
            function e(n, r) {
                for (var t = 0; t < r.length; t++) {
                    var e = r[t];
                    e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(n, e.key, e)
                }
            }
            return function(n, r, t) {
                return r && e(n.prototype, r), t && e(n, t), n
            }
        }(),
        i = (r = ["", ""], t = ["", ""], Object.freeze(Object.defineProperties(r, {
            raw: {
                value: Object.freeze(t)
            }
        })));
    var e = function() {
            function e() {
                for (var o = this, n = arguments.length, r = Array(n), t = 0; t < n; t++) r[t] = arguments[t];
                return function(n, r) {
                    if (!(n instanceof r)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.tag = function(n) {
                    for (var r = arguments.length, t = Array(1 < r ? r - 1 : 0), e = 1; e < r; e++) t[e - 1] = arguments[e];
                    return "function" == typeof n ? o.interimTag.bind(o, n) : "string" == typeof n ? o.transformEndResult(n) : (n = n.map(o.transformString.bind(o)), o.transformEndResult(n.reduce(o.processSubstitutions.bind(o, t))))
                }, 0 < r.length && Array.isArray(r[0]) && (r = r[0]), this.transformers = r.map(function(n) {
                    return "function" == typeof n ? n() : n
                }), this.tag
            }
            return o(e, [{
                key: "interimTag",
                value: function(n, r) {
                    for (var t = arguments.length, e = Array(2 < t ? t - 2 : 0), o = 2; o < t; o++) e[o - 2] = arguments[o];
                    return this.tag(i, n.apply(void 0, [r].concat(e)))
                }
            }, {
                key: "processSubstitutions",
                value: function(n, r, t) {
                    var e = this.transformSubstitution(n.shift(), r);
                    return "".concat(r, e, t)
                }
            }, {
                key: "transformString",
                value: function(n) {
                    return this.transformers.reduce(function(n, r) {
                        return r.onString ? r.onString(n) : n
                    }, n)
                }
            }, {
                key: "transformSubstitution",
                value: function(n, t) {
                    return this.transformers.reduce(function(n, r) {
                        return r.onSubstitution ? r.onSubstitution(n, t) : n
                    }, n)
                }
            }, {
                key: "transformEndResult",
                value: function(n) {
                    return this.transformers.reduce(function(n, r) {
                        return r.onEndResult ? r.onEndResult(n) : n
                    }, n)
                }
            }]), e
        }(),
        u = function() {
            var r = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "";
            return {
                onEndResult: function(n) {
                    if ("" === r) return n.trim();
                    if ("start" === (r = r.toLowerCase()) || "left" === r) return n.replace(/^\s*/, "");
                    if ("end" === r || "right" === r) return n.replace(/\s*$/, "");
                    throw new Error("Side not supported: " + r)
                }
            }
        };
    var a = function() {
            var o = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "initial";
            return {
                onEndResult: function(n) {
                    if ("initial" === o) {
                        var r = n.match(/^[^\S\n]*(?=\S)/gm),
                            t = r && Math.min.apply(Math, function(n) {
                                if (Array.isArray(n)) {
                                    for (var r = 0, t = Array(n.length); r < n.length; r++) t[r] = n[r];
                                    return t
                                }
                                return Array.from(n)
                            }(r.map(function(n) {
                                return n.length
                            })));
                        if (t) {
                            var e = new RegExp("^.{" + t + "}", "gm");
                            return n.replace(e, "")
                        }
                        return n
                    }
                    if ("all" === o) return n.replace(/^[^\S\n]+/gm, "");
                    throw new Error("Unknown type: " + o)
                }
            }
        },
        s = function(r, t) {
            return {
                onEndResult: function(n) {
                    if (null == r || null == t) throw new Error("replaceResultTransformer requires at least 2 arguments.");
                    return n.replace(r, t)
                }
            }
        },
        f = function(t, e) {
            return {
                onSubstitution: function(n, r) {
                    if (null == t || null == e) throw new Error("replaceSubstitutionTransformer requires at least 2 arguments.");
                    return null == n ? n : n.toString().replace(t, e)
                }
            }
        },
        c = {
            separator: "",
            conjunction: "",
            serial: !1
        },
        l = function() {
            var s = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : c;
            return {
                onSubstitution: function(n, r) {
                    if (Array.isArray(n)) {
                        var t = n.length,
                            e = s.separator,
                            o = s.conjunction,
                            i = s.serial,
                            u = r.match(/(\n?[^\S\n]+)$/);
                        if (n = u ? n.join(e + u[1]) : n.join(e + " "), o && 1 < t) {
                            var a = n.lastIndexOf(e);
                            n = n.slice(0, a) + (i ? e : "") + " " + o + n.slice(a + 1)
                        }
                    }
                    return n
                }
            }
        },
        m = function(t) {
            return {
                onSubstitution: function(n, r) {
                    if (null == t || "string" != typeof t) throw new Error("You need to specify a string character to split by.");
                    return "string" == typeof n && n.includes(t) && (n = n.split(t)), n
                }
            }
        },
        p = function(n) {
            return null != n && !Number.isNaN(n) && "boolean" != typeof n
        },
        g = function() {
            return {
                onSubstitution: function(n) {
                    return Array.isArray(n) ? n.filter(p) : p(n) ? n : ""
                }
            }
        },
        d = new e(l({
            separator: ","
        }), a, u),
        h = new e(l({
            separator: ",",
            conjunction: "and"
        }), a, u),
        y = new e(l({
            separator: ",",
            conjunction: "or"
        }), a, u),
        w = new e(m("\n"), g, l, a, u),
        v = new e(m("\n"), l, a, u, f(/&/g, "&amp;"), f(/</g, "&lt;"), f(/>/g, "&gt;"), f(/"/g, "&quot;"), f(/'/g, "&#x27;"), f(/`/g, "&#x60;")),
        b = new e(s(/(?:\n(?:\s*))+/g, " "), u),
        S = new e(s(/(?:\n\s*)/g, ""), u),
        T = new e(l({
            separator: ","
        }), s(/(?:\s+)/g, " "), u),
        A = new e(l({
            separator: ",",
            conjunction: "or"
        }), s(/(?:\s+)/g, " "), u),
        E = new e(l({
            separator: ",",
            conjunction: "and"
        }), s(/(?:\s+)/g, " "), u),
        L = new e(l, a, u),
        j = new e(l, s(/(?:\s+)/g, " "), u),
        R = new e(a, u),
        k = new e(a("all"), u);
    n.TemplateTag = e,
    n.trimResultTransformer = u,
    n.stripIndentTransformer = a, 
    n.replaceResultTransformer = s,
    n.replaceSubstitutionTransformer = f, 
    n.replaceStringTransformer = function(r, t) {
        return {
            onString: function(n) {
                if (null == r || null == t) throw new Error("replaceStringTransformer requires at least 2 arguments.");
                return n.replace(r, t)
            }
        }
    }, n.inlineArrayTransformer = l, 
       n.splitStringTransformer = m, 
       n.removeNonPrintingValuesTransformer = g,
       n.commaLists = d, 
       n.commaListsAnd = h,
       n.commaListsOr = y, 
       n.html = w,
       n.codeBlock = w,
       n.source = w, 
       n.safeHtml = v, 
       n.oneLine = b,
       n.oneLineTrim = S, 
       n.oneLineCommaLists = T, 
       n.oneLineCommaListsOr = A, 
       n.oneLineCommaListsAnd = E, 
       n.inlineLists = L, 
       n.oneLineInlineLists = j, 
       n.stripIndent = R, 
       n.stripIndents = k, 
    Object.defineProperty(n, "__esModule", {
        value: !0
    })
});


// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
/* safe-stable-stringify

The MIT License (MIT)
Copyright (c) Ruben Bridgewater

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// use UMD pattern to prevent all of the support stuff becomming part of the main namespace 
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.safeStableStringify = factory());
}(this, (function () { 'use strict'

const { hasOwnProperty } = Object.prototype

const stringify = configure();
  
// eslint-disable-next-line no-control-regex
const strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/

// Escape C0 control characters, double quotes, the backslash and every code
// unit with a numeric value in the inclusive range 0xD800 to 0xDFFF.
function strEscape (str) {
  // Some magic numbers that worked out fine while benchmarking with v8 8.0
  if (str.length < 5000 && !strEscapeSequencesRegExp.test(str)) {
    return `"${str}"`
  }
  return JSON.stringify(str)
}

function sort (array, comparator) {
  // Insertion sort is very efficient for small input sizes, but it has a bad
  // worst case complexity. Thus, use native array sort for bigger values.
  if (array.length > 2e2 || comparator) {
    return array.sort(comparator)
  }
  for (let i = 1; i < array.length; i++) {
    const currentValue = array[i]
    let position = i
    while (position !== 0 && array[position - 1] > currentValue) {
      array[position] = array[position - 1]
      position--
    }
    array[position] = currentValue
  }
  return array
}

const typedArrayPrototypeGetSymbolToStringTag =
  Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(
      Object.getPrototypeOf(
        new Int8Array()
      )
    ),
    Symbol.toStringTag
  ).get

function isTypedArrayWithEntries (value) {
  return typedArrayPrototypeGetSymbolToStringTag.call(value) !== undefined && value.length !== 0
}

function stringifyTypedArray (array, separator, maximumBreadth) {
  if (array.length < maximumBreadth) {
    maximumBreadth = array.length
  }
  const whitespace = separator === ',' ? '' : ' '
  let res = `"0":${whitespace}${array[0]}`
  for (let i = 1; i < maximumBreadth; i++) {
    res += `${separator}"${i}":${whitespace}${array[i]}`
  }
  return res
}

function getCircularValueOption (options) {
  if (hasOwnProperty.call(options, 'circularValue')) {
    const circularValue = options.circularValue
    if (typeof circularValue === 'string') {
      return `"${circularValue}"`
    }
    if (circularValue == null) {
      return circularValue
    }
    if (circularValue === Error || circularValue === TypeError) {
      return {
        toString () {
          throw new TypeError('Converting circular structure to JSON')
        }
      }
    }
    throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined')
  }
  return '"[Circular]"'
}

function getDeterministicOption (options) {
  let value
  if (hasOwnProperty.call(options, 'deterministic')) {
    value = options.deterministic
    if (typeof value !== 'boolean' && typeof value !== 'function') {
      throw new TypeError('The "deterministic" argument must be of type boolean or comparator function')
    }
  }
  return value === undefined ? true : value
}

function getBooleanOption (options, key) {
  let value
  if (hasOwnProperty.call(options, key)) {
    value = options[key]
    if (typeof value !== 'boolean') {
      throw new TypeError(`The "${key}" argument must be of type boolean`)
    }
  }
  return value === undefined ? true : value
}

function getPositiveIntegerOption (options, key) {
  let value
  if (hasOwnProperty.call(options, key)) {
    value = options[key]
    if (typeof value !== 'number') {
      throw new TypeError(`The "${key}" argument must be of type number`)
    }
    if (!Number.isInteger(value)) {
      throw new TypeError(`The "${key}" argument must be an integer`)
    }
    if (value < 1) {
      throw new RangeError(`The "${key}" argument must be >= 1`)
    }
  }
  return value === undefined ? Infinity : value
}

function getItemCount (number) {
  if (number === 1) {
    return '1 item'
  }
  return `${number} items`
}

function getUniqueReplacerSet (replacerArray) {
  const replacerSet = new Set()
  for (const value of replacerArray) {
    if (typeof value === 'string' || typeof value === 'number') {
      replacerSet.add(String(value))
    }
  }
  return replacerSet
}

function getStrictOption (options) {
  if (hasOwnProperty.call(options, 'strict')) {
    const value = options.strict
    if (typeof value !== 'boolean') {
      throw new TypeError('The "strict" argument must be of type boolean')
    }
    if (value) {
      return (value) => {
        let message = `Object can not safely be stringified. Received type ${typeof value}`
        if (typeof value !== 'function') message += ` (${value.toString()})`
        throw new Error(message)
      }
    }
  }
}

function configure (options) {
  options = { ...options }
  const fail = getStrictOption(options)
  if (fail) {
    if (options.bigint === undefined) {
      options.bigint = false
    }
    if (!('circularValue' in options)) {
      options.circularValue = Error
    }
  }
  const circularValue = getCircularValueOption(options)
  const bigint = getBooleanOption(options, 'bigint')
  const deterministic = getDeterministicOption(options)
  const comparator = typeof deterministic === 'function' ? deterministic : undefined
  const maximumDepth = getPositiveIntegerOption(options, 'maximumDepth')
  const maximumBreadth = getPositiveIntegerOption(options, 'maximumBreadth')

  function stringifyFnReplacer (key, parent, stack, replacer, spacer, indentation) {
    let value = parent[key]

    if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
      value = value.toJSON(key)
    }
    value = replacer.call(parent, key, value)

    switch (typeof value) {
      case 'string':
        return strEscape(value)
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        let res = ''
        let join = ','
        const originalIndentation = indentation

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          if (spacer !== '') {
            indentation += spacer
            res += `\n${indentation}`
            join = `,\n${indentation}`
          }
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          if (spacer !== '') {
            res += `\n${originalIndentation}`
          }
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        let whitespace = ''
        let separator = ''
        if (spacer !== '') {
          indentation += spacer
          join = `,\n${indentation}`
          whitespace = ' '
        }
        const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (deterministic && !isTypedArrayWithEntries(value)) {
          keys = sort(keys, comparator)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifyFnReplacer(key, value, stack, replacer, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}${strEscape(key)}:${whitespace}${tmp}`
            separator = join
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`
          separator = join
        }
        if (spacer !== '' && separator.length > 1) {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifyArrayReplacer (key, value, stack, replacer, spacer, indentation) {
    if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
      value = value.toJSON(key)
    }

    switch (typeof value) {
      case 'string':
        return strEscape(value)
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        const originalIndentation = indentation
        let res = ''
        let join = ','

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          if (spacer !== '') {
            indentation += spacer
            res += `\n${indentation}`
            join = `,\n${indentation}`
          }
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          if (spacer !== '') {
            res += `\n${originalIndentation}`
          }
          stack.pop()
          return `[${res}]`
        }
        stack.push(value)
        let whitespace = ''
        if (spacer !== '') {
          indentation += spacer
          join = `,\n${indentation}`
          whitespace = ' '
        }
        let separator = ''
        for (const key of replacer) {
          const tmp = stringifyArrayReplacer(key, value[key], stack, replacer, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}${strEscape(key)}:${whitespace}${tmp}`
            separator = join
          }
        }
        if (spacer !== '' && separator.length > 1) {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifyIndent (key, value, stack, spacer, indentation) {
    switch (typeof value) {
      case 'string':
        return strEscape(value)
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (typeof value.toJSON === 'function') {
          value = value.toJSON(key)
          // Prevent calling `toJSON` again.
          if (typeof value !== 'object') {
            return stringifyIndent(key, value, stack, spacer, indentation)
          }
          if (value === null) {
            return 'null'
          }
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }
        const originalIndentation = indentation

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          indentation += spacer
          let res = `\n${indentation}`
          const join = `,\n${indentation}`
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          res += `\n${originalIndentation}`
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        indentation += spacer
        const join = `,\n${indentation}`
        let res = ''
        let separator = ''
        let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (isTypedArrayWithEntries(value)) {
          res += stringifyTypedArray(value, join, maximumBreadth)
          keys = keys.slice(value.length)
          maximumPropertiesToStringify -= value.length
          separator = join
        }
        if (deterministic) {
          keys = sort(keys, comparator)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifyIndent(key, value[key], stack, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}${strEscape(key)}: ${tmp}`
            separator = join
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`
          separator = join
        }
        if (separator !== '') {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifySimple (key, value, stack) {
    switch (typeof value) {
      case 'string':
        return strEscape(value)
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (typeof value.toJSON === 'function') {
          value = value.toJSON(key)
          // Prevent calling `toJSON` again
          if (typeof value !== 'object') {
            return stringifySimple(key, value, stack)
          }
          if (value === null) {
            return 'null'
          }
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        let res = ''

        const hasLength = value.length !== undefined
        if (hasLength && Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifySimple(String(i), value[i], stack)
            res += tmp !== undefined ? tmp : 'null'
            res += ','
          }
          const tmp = stringifySimple(String(i), value[i], stack)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `,"... ${getItemCount(removedKeys)} not stringified"`
          }
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        let separator = ''
        let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (hasLength && isTypedArrayWithEntries(value)) {
          res += stringifyTypedArray(value, ',', maximumBreadth)
          keys = keys.slice(value.length)
          maximumPropertiesToStringify -= value.length
          separator = ','
        }
        if (deterministic) {
          keys = sort(keys, comparator)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifySimple(key, value[key], stack)
          if (tmp !== undefined) {
            res += `${separator}${strEscape(key)}:${tmp}`
            separator = ','
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringify (value, replacer, space) {
    if (arguments.length > 1) {
      let spacer = ''
      if (typeof space === 'number') {
        spacer = ' '.repeat(Math.min(space, 10))
      } else if (typeof space === 'string') {
        spacer = space.slice(0, 10)
      }
      if (replacer != null) {
        if (typeof replacer === 'function') {
          return stringifyFnReplacer('', { '': value }, [], replacer, spacer, '')
        }
        if (Array.isArray(replacer)) {
          return stringifyArrayReplacer('', value, [], getUniqueReplacerSet(replacer), spacer, '')
        }
      }
      if (spacer.length !== 0) {
        return stringifyIndent('', value, [], spacer, '')
      }
    }
    return stringifySimple('', value, [])
  }

  return stringify
}
stringify.stringify = stringify;
stringify.configure = configure;

// Whatever is returned is what `global.safeStableStringify` will b
return {
      stringify: stringify,
      configure: configure,
  };

})));

//const stringify = configure()
// @ts-expect-error
// stringify.configure = stringifyConfigure
// @ts-expect-error
// stringify.stringify = stringify

// @ts-expect-error
// stringify.default = stringify

// @ts-expect-error used for named export
//exports.stringify = stringify
// @ts-expect-error used for named export
//exports.configure = configure

// module.exports = stringify


