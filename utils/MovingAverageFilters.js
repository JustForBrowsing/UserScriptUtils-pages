/**  Moving Average (Filters)
  *   (a.k.a., rolling average, running average, moving mean, or rolling mean) 
  *   Window (Filter) Functions
  * 
  * Types of filter functions:
  *   - Exponential
  *   - Simple Moving Median (SMM)
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

    constructor() {
    }
}


/**  Exponential
  *   a.k.a, exponential filter, exponential smoothing, 
  *           exponential window function, or exponential moving average (EMA).
  *    τ 	: time constant (~5 τ = filter time)
  *    Δt	: sample time
  *    α = 1 - Math.exp(-Δt/τ);
  *    α ≈ deltaT / timeConstant; // if Δt << τ
  * 
  *    s(0) = x0
  *    s(n) = α∙x(n) + (1 - α)∙s(n-1)
  */
class Exponential extends _MovingAverageFilter {

    constructor() {
        super();
    }
}


/** Simple Moving Average (SMA)
  *  Simple Moving Average (SMA) acts as a low-pass FIR filter.   
  *  SMA is the mean over the last k entries of data set x[i].
  *      SMA(k)      = (1/n)∙[p(n-k+1) + p(n-k+2) + … + p(n)]
  *      SMA(k)      = (1/k)∙Σ{i=n-k+1 … n}(p(i))
  *      SMA(k,next) = SMA(k,prev) + [(1/k)∙(p(n+1) - p(n-k+1)]
  *
  *      SMA(k)	: the average of x over entries x[n-k] to x[m].
  *      n 			: total number of entries (N)
  *      k 			: width of window
  *      x[i]		: ordered set of points/entries
  *
  *      Notes:
  *        •	if k = n then SMA(n) = CA(n)
  *        •	both SMA(k) and SMA(k,next) need a k-element circular buffer.
  *
  *      SMA(k)      = (1/k)∙(x[n-k+1] + ... + x[n])
  *      SMA(k)      = (1/k)∙Σ{i=n-k+2 … n}(x[i])
  *      SMA(k,next) = SMA(k,prev) + [(1/k)∙(x[n+1] - x[n-k+1])]
  */
class SimpleMovingAverage extends _MovingAverageFilter {

    constructor() {
        super();
    }
}

/**  Cumulative Moving Average (CA)
  *   (a.k.a, Cumulative Average)
  *    CA(n)	: the average of x over entries x[1] to x[n].
  *    n 		  : total number of entries (N)
  *    x(i)	  : points/samples/entries
  *
  *    CA(n) = (x[1] + ... + x[n]) / n
  *    CA(n) = (1/n)∙Σ{i=1...n}(x[i])
  *
  *    CA(n+1) = [x[n+1] + n∙CA(n)] / (n + 1)
  *    CA(n+1) = CA(n) + [(x[n-1] - CA(n)) / (n + 1)]
  *
  *    Note: 
  *      - No circular buffer is needed for CA (only the previous value: x[n-1]).
  */
class CumulativeMovingAverageFilter extends _MovingAverageFilter {

    constructor() {
        super();
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
  *       - Would need a circular buffer of size ⌈k/2⌉
  */
class SimpleMovingMedianFilter extends _MovingAverageFilter {


    constructor() {
        super();
    }
}









