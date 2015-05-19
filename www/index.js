'use strict';
//---------------------------------------
var worldcomponent = function(initialVal)
{
  var computingF = [];
  var value = {};
  var state;
  Object.defineProperties(value,
  {
    val: //value.val
    {
      get: function()
      {
        return state;
      },
      set: function(x)
      {
        state = x;
        computingF.map(
          function(f)
          {
            f(x);
          });
        return;
      }
    }
  });
  var o = {
    compute: function(f)
    {
      var f1 = function()
      {
        computingF[computingF.length] = f; //push  f
        value.val = initialVal;
      };
      return f1;
    },
    appear: function(a)
    {
      var f1 = function(){value.val = a;};
      return f1;
    },
    now: function()
    {
      return value.val;
    }
  };

  return o;
};

Object.defineProperties(worldcomponent,
{
  world: //our physical world
  {
    set: function(f)
    {
      return f();
    }
  }
});

worldcomponent.log = function(a)
{
  var f = console.log.bind(console, a);
  return f;
};

//module.exports = worldcomponent;
//---------------------------------------

var ___ = worldcomponent;
___.world = ___.log('index.js started'); //for debug

var ___it = ___(0);
var ___outside = ___(false);
var ___rtime = ___(0);

var socket = io();

socket.on('it', function(x){
  ___.world = ___it.appear(x);
 });

socket.on('rebootingTime', function(x){
   ___.world = ___rtime.appear(x);
  });

var HelloComponent = React.createClass(
{
 componentDidMount: function()
 {
   var com = this;
   ___.world = ___it.compute(function(x)
   {
     ___.world = ___.log(x);
     com.forceUpdate();
   });

   ___.world = ___rtime.compute(function(x)
   {
     ___.world = ___.log(x);
     com.forceUpdate();
   });
 },

 checked: function(e)
 {
   ___.world = ___.log(e.target.checked);
   socket.emit('checked', e.target.checked);
 },
 render: function()
 {
   var divStyle = {"font-family": "monospace"};
   var cStyle = {width:"30px", height:"30px"};
   var el = (
     <div style = {divStyle}>
     <h1>==Security Timer Shutdown==</h1>
     <h1>rebootingTime : {Math.round(___rtime.now()/1000/60*10)/10} Minutes</h1>
     <h1>-----idleTime : {Math.round(___it.now()/1000/60*10)/10} Minutes</h1>
     <h1>Outside - Timer Shutdown?
     <input type="checkbox" style={cStyle} onChange={this.checked}/></h1>
     </div>);
   return el;
 }


});

var mount = React.render(<HelloComponent/>, document.body);
