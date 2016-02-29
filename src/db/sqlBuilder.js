'use strict';

var Query = function (literals, ...substitutions){
  let result ="";
  for (let i = 0; i < substitutions.length; i++) {
          result += literals[i];
          result += substitutions[i];
      }
      // add the last literal
      result += literals[literals.length - 1];
      return result;
}



module.exports = Query;
