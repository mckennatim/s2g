#!/usr/bin/env node
var app = require('./app');
var cfg = require('./cfg').cfg();


app.set('port', process.env.PORT || cfg.port);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
