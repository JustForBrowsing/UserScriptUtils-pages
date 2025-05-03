/**  Moving Average Filters
  *   (a.k.a., rolling average, running average, moving mean, or rolling mean) 
  * 
  * Types of filter functions:
  *   - Exponential
  *   - Simple Moving Average (SMA)
  *   - Cumulative Moving Average (CA)
  *   - Weighted Moving Average (WMA) 
  *   - Simple Moving Median (SMM)
  */


/**  Base class for all of the filters
  */
class _MovingAverageFilter {
    _length = -1;
    length {
        get => this._length;
    }

    _sampleTime = null;
    sampleTime {
        get()              => this._sampleTime ?? Number.NaN;
        set(newSampleTime) => this._changeSampleTime(newSampleTime);
    }
    Δt {
        get()              => this._sampleTime ?? Number.NaN;
        set(newSampleTime) => this._changeSampleTime(newSampleTime);
    }
    /** _changeSampleTime - the function may be changed in a subclass to allow 
      *                     any additional calculations that may be needed when 
      *                     the sample rate changes.
      */
    _changeSampleTime(sampleTime) {
        this._sampleTime = Math.abs(sampleTime);
    }

    constructor(sampleTime = null) {
        this._sampleTime = sampleTime ?? Number.NaN;
    }

    clear() {
        this.length = 0;
    }

    update(newData, sampleTime = null) {
        this.sampleTime ??= sampleTime;
        this.sampleTime ??= Number.NaN;
        this.length += 1;
    }

    // static isValidSampleTime(sampleTime) {
    //     return sampleTime != null && !Number.isNan(sampleTime) && sampleTime > 0.0;
    // }
}


/**  Exponential
  *   a.k.a, exponential filter, exponential smoothing, 
  *           exponential window function, or exponential moving average (EMA).
  *    τ 	: time constant (~5 τ = filter time) (timeConstant)
  *    Δt	: sample time (deltaT)
  *    α = 1 - Math.exp(-Δt/τ);
  *    ( α ≈ deltaT / timeConstant; // if Δt << τ )
  *    τ = -Δt / ln(α + 1)
  *
  *    s(0) = x0
  *    s(n) = α∙x(n) + (1 - α)∙s(n-1)
  */
class Exponential extends _MovingAverageFilter {
    static alphaToTimeConstant(alpha, sampleTime) {
        return sampleTime / Math.ln(alpha + 1.0);
    }

    static timeConstantToAlpha(timeConstant, sampleTime){
        return 1.0 - Math.exp(-sampleTime / timeConstant);
    }
    
    _alpha      = 1.0;
    _alphaPrime = 0.0;  // α’ = 1 - α
    alpha {
        get() => this._alpha;
        set(newAlpha) {
            this._alpha      = newAlpha;
            this._alphaPrime = 1 - newAlpha;
        }
    }
    α {
        get()         => this.alpha;
        set(newAlpha) => this.alpha = newAlpha;
    }

    _lastValue = Number.NaN;
    lastValue {
        get() => this._lastValue;
    }

    // Calculated property
    timeConstant {
        get() => Exponential.alphaToTimeConstant(this.alpha, this.sampleTime);
                 // -this.deltaTime / Math.ln(this.alpha + 1.0);
        set(timeConstant) => 
            this.alpha = Exponential.timeConstantToAlpha(timeConstant, this.sampleTime);
                 // this.alpha = ( 1.0 - Math.exp(-this.deltaTime / timeConstant);
    }
    τ {
        get()                => this.timeConstant;
        set(newTimeConstant) => this.timeConstant = newTimeConstant;
    }

    // Exponential() - Exponential filter constructor
    // @param alpha      -- the exponential filter's alpha value (0 < α <= 1) [Optional]
    // @param sampleTime -- the system sample time (in seconds, Δt > 0) [Optional]
    // @example 
    //     const expFilter = Exponential(0.7);             // α = 0.7
    //  OR
    //     const sampleTime = 0.010; // Δt = 10 milliseconds
    //     const expFilter = Exponential(0.3, sampleTime); // α = 0.3
    constructor(alpha = null, sampleTime = null) {
        super(sampleTime);
        this._alpha ??= alpha;
        this.clear();
    }

    clear() {
        super.clear(); // this will set length to 0.
        this._lastValue = null;
    }

    // update - add a new value to the filter
    //      s(0) = x0
    //      s(n) = α∙x(n) + (1 - α)∙s(n - 1)
    // @param newValue  -- the next value to filter [Required]
    // @param deltaTime -- the system sample time (in seconds, Δt > 0) [Optional]
    // @example 
    //     const expFilter = Exponential.fromAlpha(0.7);  // α = 0.7
    //     let newFilteredValue;
    //     while (true) {
    //         // Code to get newValue goes here...
    //         newFilteredValue = expFilter.update(newValue);
    //         // Code to use newFilteredValue
    //     }
    update(newValue, sampleTime = null) {
        super.update(newValue, sampleTime);

        // s(0) = x0
        if (this.lastValue == null) {
            this._lastValue = newValue;
            return this.lastValue ?? Number.NaN;
        }
        
        //  s(n) = α∙x(n) + (1 - α)∙s(n - 1)
        this._lastValue = this.alpha * newValue + this._alphaPrime * this.lastValue;
        return this._lastValue;
    }

    // fromAlpha - Exponential factory constructor
    // @param alpha      -- the exponential filter's alpha value (0 < α <= 1) [Required]
    // @param sampleTime -- the system sample time (in seconds, Δt > 0) [Optional]
    // @example 
    //     const expFilter = Exponential.fromAlpha(0.7);            // α = 0.7
    //  OR
    //     const sampleTime = 0.010; // Δt = 10 milliseconds
    //     const expFilter = Exponential.fromAlpha(0.3, sampleTime); // α = 0.3
    static fromAlpha(alpha, sampleTime = null) {
        deltaTime ??= Number.NaN;
        return Exponential(alpha, sampleTime);
    }

    // fromTimeConstant -- Exponential factory constructor
    // @param timeConstant -- the desired filter time constant (in seconds) [Required]
    // @param sampleTime   -- the system sample time (in seconds) [Required]
    // @example 
    //     const deltaTime = 1 / 100; // Δt = 10 mS
    //     const expFilter = Exponential.fromTimeConstant(0.002, sampleTime); // τ = 2 mS
    static fromTimeConstant(timeConstant, sampleTime) {
        return Exponential(Exponential.timeConstantToAlpha(timeConstant, sampleTime),
                           sampleTime);
    }
}

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

/** Simple Moving Average (SMA)
  *  Simple Moving Average (SMA) acts as a low-pass FIR filter.   
  *  SMA is the mean over the last k entries of data set x[i].
  *      SMA(k)      = (1/n)∙[p(n-k+1) + p(n-k+2) + … + p(n)]
  *      SMA(k)      = (1/k)∙Σ{i=n-k+1 … n}(p(i))
  *      SMA(k,next) = SMA(k,prev) + [(1/k)∙(p(n+1) - p(n-k+1)]
  *
  *      SMA(k)      = (1/k)∙(x[n-k+1] + ... + x[n])
  *      SMA(k)      = (1/k)∙Σ{i=n-k+2 … n}(x[i])
  *      SMA(k,next) = SMA(k,prev) + [(1/k)∙(x[n+1] - x[n-k+1])]
  *
  *      SMA(k)	: the average of x over entries x[n-k] to x[m].
  *      n 			: total number of entries (N)
  *      k 			: width of window
  *      x[i]		: ordered set of points/entries
  *
  *      Notes:
  *        •	if k = n then CA(n) = SMA(n)
  *        •	both SMA(k) and SMA(k,next) need a k-element circular buffer.
  */
class SimpleMovingAverage extends _MovingAverageFilter {
    _priorValues;
    
    _windowLength = Number.NaN;
    windowLength {
        get()                => this._windowLength;
        set(newWindowLength) => this._updateWindowLength(newWindowLength);
    }

    constructor(windowLength, sampleTime = null) {
        super(sampleTime);
        this._windowLength = windowLength;
        this._priorValues = CircularBuffer(this.windowLength);
    }

    // SMA(k,next) = SMA(k,prev) + [(1/k)∙(x[n+1] - x[n-k+1])]
    update(newValue, sampleTime = null) {
        super.update(newValue, sampleTime);
        this._priorValues.add(newValue);
        
        return this._priorValues.mean;
    }

    _updateWindowLength(newWindowLength) {
        if (newWindowLength != this.windowLength) {
            this._windowLength       = windowLength;
            this._priorValues.length = newWindowLength;
        }
    }
}

/**  Cumulative Moving Average (CA)
  *   (a.k.a, Cumulative Average)
  *    CA(n)	: the average of x over entries x[1] to x[n].
  *    n 		: total number of entries (N)
  *    x(i)	    : points/samples/entries
  *
  *    CA(n) = (x[1] + ... + x[n]) / n
  *    CA(n) = (1/n)∙Σ{i=1...n}(x[i])
  *
  *    CA(n+1) = [x[n+1] + n∙CA(n)] / (n + 1)
  *    CA(n+1) = CA(n) + [(x[n-1] - CA(n)) / (n + 1)]
  *
  *    Note: 
  *        • No circular buffer is needed for CA (only the previous value: x[n-1])
  */
class CumulativeMovingAverageFilter extends _MovingAverageFilter {
    _lastValue = 0;
    _meanValue = 0;
    
    constructor(sampleTime = null) {
        super(sampleTime);
    }

    update(newValue, sampleTime = null) {
        if (this.length > 1) {
            this._meanValue -= this._meanValue / this.length;
        }
        super.update(newValue, sampleTime);
        
        this._meanValue += newValue / this.length;
        this._lastValue = newValue;
        
        return this._meanValue;
    }
}

/** Weighted Moving Average (WMA)
  *    In the analyses of financial data, a weighted moving average is assumed to 
  *    have weights that decrease in an arithmetical progression ([k, k-1, ..., 1]).
  *
  *    WMA(k) : the weighted average of x over entries x[n-k] through x[n]. 
  *    n 			: total number of entries
  *    k 			: width of window
  *    x[i] 	: points (x[n] is sample n)
  *    w[j]		: weight of element (w[a] is the weight of x[a])
  *
  *    Partial Results:
  *        Denominator(n) = ½∙n∙(n + 1) (financial)
  *        Denominator(n) = Σ{i=1 … n}[w[i]] (for other weightings)
  *        WMA(k)       = [ k∙x[k] + (k-1)∙x[k-1] + … + 2∙x[(k-n)+2] + x[(k-n)+1)] ] / 
  *                       [                   Denominator(n)                       ]
  *        Total(k + 1) = Total(k) + x[k + 1] - x[(k - n) + 1]
  *        Notes:
  *          	•	[n + (n-1) + … + 2 + 1] = ½∙(n∙(n+1)) [triangle numbers]
  *
  *    For Financial Data:
  *        Numerator(k + 1) = Numerator(k) + n∙x[k + 1] -	Total(k)  
  *        Denominator(k)n  = ½∙k∙(k + 1)
  *
  *    For Other Weightings:
  *        Numerator(k + 1) =	Numerator(k) + w[k + 1]∙x[k + 1] - Total(k)
  *        Denominator(k) = Σ{i=n-k+2 … n}(w[i]) 
  *        Denominator(k+1) =	Denominator(k) + w[k] 
  *        WMA(k+1) =	Numerator(k+1) / Denominator(k+1)
  */
class WeightedMovingAverageFilter extends _MovingAverageFilter {
    constructor() {
        super();
    }
}


/**  Simple Moving Median (SMM)
  *    ~pS(k)	: the median of x over entries x[n-k] to x[n].
  *    n 		 	: total number of entries
  *    k 			: width of window
  *    x(i) 	: points (x[n] is sample n)
  *
  *    Xs(k)      = Sort(x[{1, …, k}])
  *    Median(k)  = Xs[⌊(k/2) + ½⌋] 
  *
  *    ~pS(k)     = Median(x[k], x[k-1], …, x[k-n+1])
  *
  *    Notes:
  *       - Needs a circular buffer of size k
  */
class SimpleMovingMedianFilter extends SimpleMovingAverage {
    constructor(windowLength, sampleTime = null) {
        super(windowLength, sampleTime);
    }

    update(newValue, sampleTime = null) {
        super.update(newValue, sampleTime); // ignore this return value
        return this._priorValues.median;
    }
}
















