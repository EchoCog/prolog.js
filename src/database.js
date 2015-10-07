/**
 * database.js
 * 
 * To contain the facts & rules
 * 
 * - need to add facts & rules
 * - need to traverse, depth first, the whole database
 * 
 * @author jldupont
 * 
 * 
 **/

/*
 *  Database
 * 
 * @constructor
 */
function Database(access_layer) {
	this.db = {};
	this.al = access_layer;
};

/**
 *  Insert a rule/fact in the database
 *  
 *  The `root node` can be :
 *  -- Functor('rule', args...)
 *  -- Functor(X, args...)
 *  
 *  Rule:    `head :- body` 
 *   whereas `head`  is made up of `(functor args...)`
 *   
 *  The functor signature is derived 
 *   from the functor name and arity. 
 *  
 *  @param functor_signature {String}
 *  @param rule_nodes [] 
 *  @return signature
 *  @raise Error
 */
Database.prototype.insert = function(root_nodes){

	if (!(root_nodes instanceof Array))
		root_nodes = [root_nodes];
	
	for (var index in root_nodes) {
		this._insert(root_nodes[index]);
	}

};

Database.prototype._insert = function(root_node){

	var functor_signature = this.al.compute_signature(root_node);
	
	var maybe_entries = this.db[functor_signature] || [];
	maybe_entries.push(root_node);
	
	this.db[functor_signature] = maybe_entries;
	
	return functor_signature;
};


Database.prototype.batch_insert_code = function(codes) {

	if (!(codes instanceof Array))
		codes = [codes];
	
	for (var index in codes) {
		var code_object = codes[index];
		var f = code_object.f;
		var a = code_object.a;
		
		this.insert_code(f, a, code_object);
	};

};

/** 
 *  Verifies if the specified Functor exists in this database
 * 
 *  @return Boolean
 */
Database.prototype.exists = function(functor, arity) {

	var functor_signature = this.al.compute_signature([functor, arity]);
	return this.db[functor_signature] !== undefined;
};

Database.prototype.insert_code = function(functor, arity, code) {
	
	var functor_signature = this.al.compute_signature([functor, arity]);

	var maybe_entries = this.db[functor_signature] || [];
	maybe_entries.push(code);
	
	this.db[functor_signature] = maybe_entries;
};

Database.prototype.get_code = function(functor, arity) {
	
	var functor_signature = this.al.compute_signature([functor, arity]);

	var maybe_entries = this.db[functor_signature] || [];

	return maybe_entries;
};


/**
 *  Retrieve clause(s) from looking up
 *   an input Functor node 
 */
Database.prototype.get = function(functor_node) {
	
	var functor_signature = this.al.compute_signature(functor_node);
	return this.db[functor_signature] || null;
	
};

/**
 * Define a Functor in the database
 * 
 * @param root_node
 */
Database.prototype.define = function(root_node){
	
	var functor_signature = this.al.compute_signature(root_node);
	this.db[functor_signature] = root_node;
};


Database.prototype.lookup_functor = function(functor_signature){
	
	return this.db[functor_signature] || null;
};

if (typeof module!= 'undefined') {
	module.exports.Database = Database;
};

