'use strict';
//---------------------------------------
var worldcomponent = require('worldcomponent');
var ___ = worldcomponent;

var electron = require('electron-prebuilt');
___.world = ___.log(electron); //for debug to obtain electron path

var proc = require('child_process');
var app1 = proc.spawn(electron, [__dirname + '/app1.js']);
app1.on('close', function(data)
{
  ___.world = ___.log('app1 is closed!!!');

});
