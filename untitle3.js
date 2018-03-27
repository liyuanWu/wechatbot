trything = require("./try.js");
trything.get( function(x) { console.log(Object.keys(trything.parse(x).links)); trything.post('6924', x, function(y){console.log(trything.parse(y))}) } );
