var Q = require('q');
var Qfs = require('q-fs');
var fs = require('fs');

// A typical node-style asynchronous method. Returns the number of bytes in a file:
function byteCount(path, cb) {
	fs.readFile(path, function(err, fileData) {
		if (err) {
			cb(err);
		} else {
			cb(null, fileData.length);
		}
	});
}

exports.byteCount = byteCount;

// The same thing, but in promise style:
function byteCount_p(path) {
	return Qfs.read(path).then(
		function(fileData) {
			return fileData.length;
		}
	);
}

exports.byteCount_p = byteCount_p;

// And here's a shorter form, possible in Q.
// This has the added advantage of communicating intent in a way that allows useful optimizations (eg. when the promise is remote).
function byteCount_p2(path) {
	return Qfs.read(path).get('length');
}

exports.byteCount_p2 = byteCount_p2;

// What does Qfs.read look like? Something like this:
function read(path) {
	// create a deferred, the promise component of which will be returned synchronously
	var deferred = Q.defer();
	
	// do some work which will eventually result in the deferred being resolved or rejected
	fs.readFile(path, function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	
	return deferred.promise;
}

exports.read = read;

// Now a more complicated function that returns the largest file size given multiple files. 
// A library like async.js could make this simpler, but here is the basic pattern:
function largestByteCount(paths, cb) {
	var calls = paths.length;
	var aborted = false;
	var max = 0;
	paths.forEach(function(path) {
		byteCount(path, function(err, byteSize) {
			calls--;
			if (!aborted) {
				if (err) {
					aborted = true;
					cb(err);
				} else {
					max = Math.max(max, byteSize);
					if (calls == 0) {
						cb(null, max);
					}
				}
			}
		});
	});
}

exports.largestByteCount = largestByteCount;

// using promises:
function largestByteCount_p(paths) {
	// call byteCount on each path to produce an array of promises
	var sizePromises = paths.map(function(path) {
		return byteCount_p(path);
	});
	// resolve all promises in parallel
	return Q.all(sizePromises).then(
		function(sizes) {
			// the array of promises is now an array of resolved results (file sizes)
			return Math.max.apply(null, sizes);
		}
	);
}

exports.largestByteCount_p = largestByteCount_p;