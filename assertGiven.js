module.exports = function assertGiven(gives, given){
  if (!given) { 
    throw new Error('create function should return a function or an object') 
  }
  if (typeof gives === 'string' && typeof given !== 'function'){
    throw new Error('create function should return a function when gives is a string') 

  } else if (typeof gives === 'object' && typeof given === 'object') {

    if(!Object.keys(given).every(function(key) {
      return gives[key] 
    })){
      throw new Error('keys returned by create must match keys in given') 
    }
    if(!Object.keys(gives).every(function(key) {
      return given[key] 
    })){
      throw new Error('keys returned by create must match keys in given') 
    }
  }

}
