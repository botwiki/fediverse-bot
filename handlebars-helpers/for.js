module.exports = function(from, to, incr, block){
  var accum = '';
  for(var i = from; i <= to; i += incr)
      accum += block.fn(i);
  return accum;
}