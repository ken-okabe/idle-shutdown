'use strict';
//---------------------------------------
var worldcomponent = require('worldcomponent');
var ___ = worldcomponent;

___.world = ___.log('started');

    //----------------------------

var port = 3333;
var directory = 'www';

var http = require('http');
var url = require('url');
var path = require("path");
var fs = require('fs');

var mimeTypes = {
  "html": "text/html",
  "js": "text/javascript",
  "css": "text/css",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "gif": "image/gif",
  "svg": "image/svg"
    // more
};

var request = function(req, res)
{
  var uri = url.parse(req.url).pathname;
  var dir = path.join(__dirname, directory);
  var filepath = path.join(dir, unescape(uri));
  var indexfilepath = path.join(dir, unescape('index.html'));

  console.info('filepath', filepath);

  var f = function(err, stats)
  {
    if (stats === undefined) // path does not exit 404
    {
      res.writeHead(404,
      {
        'Content-Type': 'text/plain'
      });
      res.write('404 Not Found\n');
      res.end();

      return;
    }
    else if (stats.isFile()) // path exists, is a file
    {
      var mimeType = mimeTypes[path.extname(filepath).split(".")[1]];
      res
        .writeHead(200,
        {
          'Content-Type': mimeType
        });

      var fileStream =
        fs
        .createReadStream(filepath)
        .pipe(res);

      return;
    }
    else if (stats.isDirectory()) // path exists, is a directory
    {
      res
        .writeHead(200,
        {
          'Content-Type': "text/html"
        });

      var fileStream =
        fs
        .createReadStream(indexfilepath)
        .pipe(res);

      return;
    }
    else
    {
      // Symbolic link, other?
      // TODO: follow symlinks?  security?
      res
        .writeHead(500,
        {
          'Content-Type': 'text/plain'
        })
        .write('500 Internal server error\n')
        .end();

      return;
    }
  };

  var component = fs.stat(filepath, f);
  return;
};


var rebootingTime = (20 * 60 + 0)*1000;

var ___idleTime = ___(0);
var ___checked = ___(false);

var x11 = require('x11');
x11.createClient(function(err, display) {
    var X = display.client;
    X.require('screen-saver', function(err, SS)
    {
      var f = function()
      {
        SS.QueryInfo(display.screen[0].root, function(err, info)
        {
          ___.world = ___idleTime.appear(info.idle);

        });
      };
      var t = setInterval(f,1000);

      ___.world = ___idleTime.compute(function(x)
        {
          ___.world = ___.log(___checked.now());

          if (___checked.now())
          if (___idleTime.now() > rebootingTime)
          {
            ___.world = ___.log('rebooting...');
            clearInterval(t);

            var exec = require('child_process').exec;
            var puts = function(error, stdout, stderr)
                              { ___.world = ___.log(stdout) };
            exec("shutdown -h now", puts);
          }
        });

    });
    X.on('error', console.error);
});



var serverUp = function()
{
  console.info('HTTP server listening', port);
  //==============================================

  var app = require('app');
  var BrowserWindow = require('browser-window');
  var mainWindow = null;

  // Quit when all windows are closed.
  app
  .on('window-all-closed', function()
  {
    app.quit();
  })
  .on('ready', function()
  {
    mainWindow = new BrowserWindow({ width: 500, height: 220, show: true });
    mainWindow //.loadUrl('https://mail.google.com/');
    .loadUrl('http://localhost:3333/index.html')
    mainWindow.focus();;
  });

  //==============================================
  return;
};

var server = http
  .createServer(request)
  .listen(port, serverUp);


var io = require('socket.io')(server);

io.on('connection', function(socket)
{
    ___.world = ___.log('a user connected');

    socket.emit('rebootingTime', rebootingTime);

    ___.world = ___idleTime.compute(function(x)
    {
      ___.world = ___.log(x);

      socket.emit('it', x);
    });

    socket.on('checked', function(x){
      ___.world = ___checked.appear(x);
     });

    ___.world = ___checked.compute(function(x)
    {
       ___.world = ___.log(x);

    });
});
