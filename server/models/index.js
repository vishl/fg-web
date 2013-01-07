//require all files in this directory
require("fs").readdirSync("./server/models").forEach(function(file) {
  if(!file.match(/^\w+\.js$/)){
    return;
  }
  if(file!=='index.js'){
    var prefix = file.split(".")[0];
    var name = prefix[0].toUpperCase() + prefix.slice(1); //initialCap
    console.log('Loading model %s', name);

    module.exports[name] = require("./" + file);
  }
});
