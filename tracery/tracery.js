var tracery = require('tracery-grammar'),
    raw_grammar = require(__dirname + '/grammar.json'),    
    processed_grammar = tracery.createGrammar(raw_grammar);

processed_grammar.addModifiers(tracery.baseEngModifiers); 

module.exports.grammar = processed_grammar;