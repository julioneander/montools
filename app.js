var express = require('express'),
    app = express();
    exec = require('child_process').exec,
    fs = require('fs'),
    os = require('os');

// Initialize last usage
var lastUsage = [];
for (var i = 0; i < os.cpus().length; i++) lastUsage[i] = {'load': 0, 'total': 0};

/**
 * Calculates the average CPUs load percentage from last time called.
 * Also, returns the clock speeds
 */
app.get('/cpu', function(req, res) {
  var cpus = os.cpus(),
      usage = [];

  // Retrieve ticks of all CPUS
  for (var i = 0; i < cpus.length; i++) {
    var load = 0,
        total = 0;

    // Calculate load and total times
    for (var type in cpus[i].times) {
      total += cpus[i].times[type];
      if ('idle' != type) load += cpus[i].times[type];
    }

    // Calculate the average load time from last measurement
    usage[i] = {
      'load': Math.round(100 * (load-lastUsage[i]['load']) / (total-lastUsage[i]['total'])),
      'clock': cpus[i].speed
    };

    // Save this usage for further averaging
    lastUsage[i] = {'load': load, 'total': total};
  }

  // Send the usage
  res.json(usage);
});

app.listen(1337);
console.log('Listening on port 1337');
