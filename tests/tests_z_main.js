/*
 * prolog.js test cases
 * 
 * @author: jldupont
 */

var should = require('should');
var util   = require('util');

var pr = require("../prolog.js");

var Functor = pr.Functor;
var Utils = pr.Utils;


var Prolog = pr.Prolog;
var ParseSummary = pr.ParseSummary;

var ErrorUnexpectedEnd = pr.ErrorUnexpectedEnd;
var ErrorSyntax = pr.ErrorSyntax;

var setup = function(text) {

	//Functor.inspect_compact_version = false;
	Functor.inspect_short_version = false;

	return Prolog.parse_per_sentence(text);
};

var dump_result = function(result) {
	for (var index=0; index<result.length; index++)
		console.log( util.inspect( result[index] ) );
};

function _test(text, expected, options) {

	options = options || {};

	var parsed_result = setup(text);

	if (options.show_parsed)
		console.log("-- Parsed: ", parsed_result);

	if (parsed_result.length != expected.length)
		return false;

	for (var index=0; index<expected.length; index++) {
		
		var expect = expected[index];
		var res    = parsed_result[index];

		//console.log("Res  ", res);
		//console.log("Expect ",expect);
		
		if (res.maybe_error == null)
			if (expect.maybe_error != null) {
				return false;
			} else
				continue;
		
		
		if (res.maybe_error != null) {
			if (expect.maybe_error == null)
				return false;
		
		//console.log(res.maybe_error.classname, expect.maybe_error.classname);	
			
				
			return res.maybe_error.classname == expect.maybe_error.classname;
		}
		
		if (!Utils.compare_objects(res.maybe_token_list, expect))
			return false;
			
	}	
	return true;
};

function test(text, expected, options) {
	
	should.ok( _test(text, expected, options) );
};

it('Main - simple - 1', function() {
	
	//console.log("\n---- Main - simple - 1\n\n");
	
	var text = 'f(1). f(2).';

	test(text, [
		 new ParseSummary(null, new Functor('f', 1))
		,new ParseSummary(null, new Functor('f', 2))
	], {show_parsed : false });	
});

it('Main - simple - 2', function() {
	
	//console.log("\n---- Main - simple - 2\n\n");
	
	var text =  '"""comment"""\n'
				+'f(1). f(2).';

	test(text, [
		 new ParseSummary(null, new Functor('f', 1))
		,new ParseSummary(null, new Functor('f', 2))
	], {show_parsed : false });	
});


it('Main - error - 1', function() {
	
	//console.log("\n---- Main - error - 1\n\n");
	
	var text = 'f(1. [1,2.';
	
	test(text, [
		 new ParseSummary(new ErrorUnexpectedEnd())
		,new ParseSummary(new ErrorUnexpectedEnd())
	], {show_parsed: false});	
});

it('Main - error - 2', function() {
	
	//console.log("\n---- Main - error - 1\n\n");
	
	var text = 'f(1) (f2).';
	
	test(text, [
		 new ParseSummary(new ErrorSyntax())
	], {show_parsed: false});	
});

it('Main - error - 3', function() {
	
	//console.log("\n---- Main - error - 1\n\n");
	
	var text = '[1,2] [3,4]';
	
	test(text, [
		 new ParseSummary(new ErrorSyntax())
	], {show_parsed: false});	
});
