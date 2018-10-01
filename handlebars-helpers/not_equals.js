module.exports = function(arg1, arg2, options){
  console.log(arg1, arg2);
  return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
}