
## Problems with basic Node.js
* Normal exception handling is nearly useless because Node decomposes the call stack, violating the assumption of locality on which the exception pattern rests. Throwing code has no reason to expect that there is an enclosing scope ready to make sense of the exception, so only poorly-behaved code throws. Conversely, writing paranoid calling code requires both wrapping the call in try..catch and handling its explicit err callback argument. 
* Standard node.js code rarely makes use of function return values, because the actual results of functions are not available in time to be returned. It ignores a valuable language feature with a rich history, and makes functional programming awkward. This comes just as the power of functional programming is being rediscovered as a useful approach to scale and concurrency problems (Clojure, Haskell, etc).

## Promises
* Promise chaining restores the power of exception handling. If an exception is thrown within a promise listener, it is converted into a rejection, which propagates down the chain until a rejection listener handles it. 
* Code written using chained promises uses function return values (and ideally, *only* return values) to communicate its results, so with some discipline asynchronous Javascript can behave like a functional language.

## Things to explain
* How basic node.js code computes and returns values. 
* How basic node.js code behaves when exceptions are thrown.
	* Exceptions can be lost.
	* Exceptions can flow from application code into library code, leading to misattribution of problems.
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
* There is a performance cost.
* For better or worse, the normal node.js callback pattern allows for one function to easily "return" return values. Promises do not.

