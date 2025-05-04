// use UMD pattern to prevent all of the support stuff becomming part of the main namespace 
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.CircularBuffer = factory());
}(this, (function () { 'use strict'

// Circular buffer storage. Externally-apparent 'length' increases indefinitely
// while any items with indexes below length-n will be forgotten (undefined
// will be returned if you try to get them, trying to set is an exception).
// n represents the initial length of the array, not a maximum
class CircularBuffer {
    static IndexError = class _IndexError extends Error { }
    
    _array = null;

    _meanValue = 0.0;
    mean {
        get() => this._meanValue;
    }

    median {
        get() => this.getMedian();
    }

    _length = 0;
    length {
        get() => this._length;
    }
    
    constructor(length) {
        this._array     = new Array(length);
        this._length    = 0;
        this._meanValue = 0.0;
    }

    toString() {
        return `[object CircularBuffer('${this._array.length}') length '${this.length}']`;
    }

    get(i) {
        if (i < 0 || i < this.length - this._array.length) {
            return undefined;
        }
        return this._array[i % this._array.length];
    }

    /*
    set(i, v) {
        if (i < 0 || i < this.length - this._array.length) {
            throw CircularBuffer.IndexError;
        }
        while (i > this.length) {
            this._array[this.length % this._array.length] = undefined;
            this.length++;
        }
        
        this._array[i % this._array.length] = v;
        if (i == this.length) {
            this.length++;
        }
    }
    */

    push(newValue) {
        let lastValue = this.get(0);
        this._meanValue -= lastValue / this.length; // remove oldest value
        
        this._array[this.length % this._array.length] = newValue;
        this.length++; 

        this._meanValue += newValue / this.length; // add new value
    }

    getMedian() {
        const sortedElements = this.array.slice(0, this.length).sort();
        if (this.length % 2 == 0) {                       // even length
            let midIndex = this.length / 2;
            let m1 = sortedElements[Math.floor(midIndex)];
            let m2 = sortedElements[Math.ceil(midIndex)];
            return (m1 / 2) + (m2 / 2);
            
        } else {                                          // odd length
            return sortedElements[this.length / 2];
        }
    }
}

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return CircularBuffer;
}));
