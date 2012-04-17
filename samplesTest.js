// This is a Testpilot test file. See http://github.com/capsela/testpilot for details.

var samples = require('./samples');

exports["callback-based functions"] = {

	"byteCount": function(test) {
		samples.byteCount(__dirname + "/fixtures/file1.txt", function(err, byteSize) {
			test.equal(err, null);
			test.equal(byteSize, 9);
			test.done();
		});
	},
	
	"largestByteCount": function(test) {
		samples.largestByteCount(
			[
				__dirname + "/fixtures/file1.txt", 
				__dirname + "/fixtures/file2.txt",
				__dirname + "/fixtures/file3.txt"
			],
			function(err, byteSize) {
				test.equal(err, null);
				test.equal(byteSize, 153);
				test.done();
			}
		);
	}

};

exports["promise-based functions"] = {

	"byteCount_p": function(test) {
		test.equal(samples.byteCount_p(__dirname + "/fixtures/file1.txt"), 9);
		test.done();
	},
	
	"byteCount_p verbose version": function(test) {
		samples.byteCount_p(__dirname + "/fixtures/file2.txt").then(
			function(byteSize) {
				test.equal(byteSize, 153);
				test.done();
			}, 
			function(err) {
				test.fail(err);
				test.done();
			}
		);
	},

	"byteCount_p2": function(test) {
		test.equal(samples.byteCount_p2(__dirname + "/fixtures/file3.txt"), 30);
		test.done();
	},
	
	"largestByteCount_p": function(test) {
		test.equal(samples.largestByteCount_p(
			[
				__dirname + "/fixtures/file1.txt", 
				__dirname + "/fixtures/file2.txt",
				__dirname + "/fixtures/file3.txt"
			]
		), 153);
		test.done();
	}
	
};

exports["Qfs explanation"] = {

	"read": function(test) {
		test.equal(
			samples.read(__dirname + "/fixtures/file3.txt"), 
			"My hovercraft is full of eels."
		);
		test.done();
	}
	
};

