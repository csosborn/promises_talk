
# Promises

## Problems with basic Node.js
* Node.js and its built-in modules amount to a surprisingly bare-metal system. It's fast, flexible, and quite unconstrained, but certain language niceties that you might expect are effectively absent.
	* Normal exception handling is nearly useless because Node decomposes the call stack, violating the assumption of locality on which the exception pattern rests. Throwing code should not assume that there is an enclosing scope ready to make sense of the exception, so only poorly-behaved code throws. Conversely, writing paranoid calling code requires both wrapping the call in try..catch and handling its explicit err callback argument. 
	* Standard node.js code rarely makes use of function return values, because the actual results of functions are not available in time to be returned. It ignores a valuable language feature with a rich history, and makes functional programming awkward. This comes just as the power of functional programming is being rediscovered as a useful approach to scale and concurrency problems (Clojure, Haskell, etc).
* Node lacks built-in mechanisms to manage calls to multiple asynchronous functions, either serial or parallel. Libraries like async.js are one response to this need. Promises are another.

## Promises to the rescue
* Promise chaining restores the power of exception handling. If an exception is thrown within a promise listener, it is converted into a rejection, which propagates down the chain until a rejection listener handles it. 
* Code written using chained promises uses function return values (and ideally, *only* return values) to communicate its results, so with some discipline asynchronous Javascript can behave like a functional language.

## Things to explain
* How basic node.js code computes and returns values. 
* How basic node.js code behaves when exceptions are thrown.
	* Exceptions can be lost.
	* Exceptions can flow from application code into library code, leading to misattribution of problems.
* How promises work
	* Promise lifecycle
		* A provider creates a "deferred" and passes its corresponding "promise" object off to a consumer.
		* The consumer calls promise.then() or Q.when(promise) to install resolution and/or rejecton listeners.
		* Some asynchronous op completes, and the provider calls deferred.resolve(value) or deferred.reject(reason) to indicate either a return value or an error, respectively.
		* The consumer's listener is called.
		* If the consumer's listener returns a value or throws an exception, that resolution or rejection is propagated to chained listeners.
* Main differences between Q and jQuery promises
	* Q promises chainable by default, while jQuery makes you call a pipe() method for some reason.
	* Q guarantees that no listener will be called before the then/when() call returns; jQuery does not.
	
## Promise guarantees
* Resolution and rejection are idempotent. Moreover, the value of a promise cannot be changed after it is resolved or rejected. Just as you can't change the return value of a function that has already returned you can't change a resolved promise. 
* A promise listener will only be called once, and only one (resolution or rejection) will be called. This is in marked contrast to the normal node.js calling convention, which leaves lots of room for error. Buggy library code can call a callback multiple times, potentially with multiple values, and defensive coding is impractical.
* Promise listeners will not be called before when()/then() returns (not true of jQuery, sadly).

## Promise problems
* Debugging can be difficult, since stack traces tend to be even shorter than with basic node code, and what's left is mostly Q guts.
* Forgetting to return or terminate a promise chain is easy, and results in exceptions being silently swallowed.
* There is a performance cost to wrapping everything in additional function layers and nexTick() calls.
* For better or worse, the normal node.js callback pattern allows for one function to easily "return" multiple values. Promises do not.
* The promise pattern is somewhat contagious. If you adopt it you might be tempted to write promise adapters around callback-based modules.

## Names to know
* Tyler Close: the creator of the Q API (aka ref_send), part of the Waterken project.
* Kris Kowal: author and maintainer of Q and related modules for Node.js

## Interesting projects

