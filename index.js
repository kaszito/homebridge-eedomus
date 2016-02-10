var Service, Characteristic;
var request = require("request");
var fs, credentials;

eedomus_config = '/home/pi/.homebridge/config.json';
fs = require('fs');

var configuration = JSON.parse(fs.readFileSync(eedomus_config));
var ip = JSON.stringify(configuration.credentials.ip);
var api_user = JSON.stringify(configuration.credentials.api_user);
var api_secret = JSON.stringify(configuration.credentials.api_secret);

ip = JSON.parse(ip); 
api_user = JSON.parse(api_user); 
api_secret = JSON.parse(api_secret); 

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-eedomus", "eedomus", HttpAccessory);
}


function HttpAccessory(log, config) {
  this.log = log;

  // url info
  this.on_url                 = config["on_url"];
  this.on_body                = config["on_body"];
  this.off_url                = config["off_url"];
  this.off_body               = config["off_body"];
  this.read_url               = config["read_url"];
  this.brightness_url         = config["brightness_url"];
  this.http_method            = config["http_method"] || "GET";
  this.http_brightness_method = config["http_brightness_method"] || this.http_method;
  this.username               = config["username"] || "";
  this.password               = config["password"] || "";
  this.sendimmediately        = config["sendimmediately"];
  this.service                = config["service"];
  this.name                   = config["name"];
  this.brightnessHandling     = config["brightnessHandling"];
  this.periph_id	= config["periph_id"];

this.urlget = "http://"+ip+"/api/get?action=periph.caract&periph_id="+this.periph_id+"&api_user="+api_user+"&api_secret="+api_secret+"";
this.urlseton = "http://"+ip+"/api/set?action=periph.value&periph_id="+this.periph_id+"&value=100&api_user="+api_user+"&api_secret="+api_secret+"";
this.urlsetoff = "http://"+ip+"/api/set?action=periph.value&periph_id="+this.periph_id+"&value=0&api_user="+api_user+"&api_secret="+api_secret+"";
this.urlperc = "http://"+ip+"/api/set?action=periph.value&periph_id="+this.periph_id+"&value=%b&api_user="+api_user+"&api_secret="+api_secret+"";
}

HttpAccessory.prototype = {

  httpRequest: function(url, body, method, username, password, sendimmediately, callback) {
    request({
      url: url,
      body: body,
      method: method,
      auth: {
        user: username,
        pass: password,
        sendImmediately: sendimmediately
      }
    },
    function(error, response, body) {
      callback(error, response, body)
    })
  },

  setPowerState: function(powerOn, callback) {
    var url;
    var body;

    if (powerOn) {
      url = this.urlseton;
      body = this.on_body;
      this.log("Setting power state to on");
    } else {
      url = this.urlsetoff;
      body = this.off_body;
      this.log("Setting power state to off");
    }

    this.httpRequest(url, body, this.http_method, this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
      if (error) {
        this.log('HTTP set power function failed: %s', error.message);
        callback(error);
      } else {
        this.log('HTTP set power function succeeded!');
        // this.log(response);
        // this.log(responseBody);
        callback();
      }
    }.bind(this));
  },
  
  getPowerState: function(callback) {
//    if (!this.read_url) { callback(null); }
    if (!this.urlget) { callback(null); }
    
//    var url = this.read_url;
    var url = this.urlget;
    this.log("Getting power state");

    this.httpRequest(url, '', 'GET', this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
      if (error) {
        this.log('HTTP get power function failed: %s', error.message);
console.log(this.urlget);
        callback(error);
      } else {

        var obj = JSON.parse(responseBody);
	//console.log(obj.body.last_value);
	//var binaryState = console.log(obj.body.last_value);
        var binaryState = parseInt(obj.body.last_value);
	//var binaryState = parseInt(responseBody);
        var powerOn = binaryState > 0;
        this.log("Power state is currently %s", binaryState);
        callback(null, powerOn);
      }
    }.bind(this));
  },


  getCurrentTemperature: function(callback) {
    var url = this.urlget;
//    var url = this.read_url;
    this.log("Getting Current Temperature");

    this.httpRequest(url, '', 'GET', this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
      if (error) {
        this.log('Get current temperature failed: %s', error.message);
        callback(error);
      } else {
        var obj = JSON.parse(responseBody);
        var binaryState = Number(obj.body.last_value);
        this.log('Current temperature - %s', binaryState);
        callback(null, binaryState);
      }
    }.bind(this));
  },  

  getCurrentPosition: function(callback) {
//    var url = this.read_url;
    var url = this.urlget;
    this.log("Getting Current Position");

    this.httpRequest(url, '', 'GET', this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
      if (error) {
        this.log('Get current position failed: %s', error.message);
        callback(error);
      } else {
        var obj = JSON.parse(responseBody);
        var binaryState = Number(obj.body.last_value);
        this.log('Current position -> %s', binaryState);
        callback(null, binaryState);
      }
    }.bind(this));
  }, 

  getPositionState: function(callback) {
//    var url = this.read_url;
    var url = this.urlget;
    this.log("Getting Position State");
//    this.log("Setting Position State to STOPPED");

    this.httpRequest(url, '', 'GET', this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
      if (error) {
        this.log('Get position state failed: %s', error.message);
        callback(error);
      } else {
        var obj = JSON.parse(responseBody);
//        var binaryState = Number(obj.body.last_value);
        var binaryState = Number(obj.success);
        this.log('Position State -> %s', binaryState);
        callback(null, binaryState);
      }
    }.bind(this));
  },

  getTargetPosition: function(callback) {
//    var url = this.read_url;
    var url = this.urlget;
    this.log("Getting Target Position");

    this.httpRequest(url, '', 'GET', this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
      if (error) {
        this.log('Get target position failed: %s', error.message);
        callback(error);
      } else {
        var obj = JSON.parse(responseBody);
        var binaryState = Number(obj.body.last_value);
        this.log('Get Target Position to %s', binaryState);
        callback(null, binaryState);
      }
    }.bind(this));
  },

  setTargetPosition: function(level, callback) {
//    var url = this.brightness_url.replace("%b", level)
    var url = this.urlperc.replace("%b", level)

    this.log("Setting Target Position to %s", level)
//console.log(this.urlperc.replace("%b", level))

    this.httpRequest(url, "", this.http_brightness_method, this.username, this.password, this.sendimmediately, function(error, response, body) {
      if (error) {
        this.log('HTTP level window function failed: %s', error);
        callback(error);
      } else {
        this.log('HTTP level window function succeeded!');
        callback();
      }
    }.bind(this));
  },


  setBrightness: function(level, callback) {
//    var url = this.brightness_url.replace("%b", level)
    var url = this.urlperc.replace("%b", level)

    this.log("Setting brightness to %s", level);
console.log(this.urlperc.replace("%b", level))

    this.httpRequest(url, "", this.http_brightness_method, this.username, this.password, this.sendimmediately, function(error, response, body) {
      if (error) {
        this.log('HTTP brightness function failed: %s', error);
        callback(error);
      } else {
        this.log('HTTP brightness function succeeded!');
        callback();
      }
    }.bind(this));
  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function() {

    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();

    informationService
    .setCharacteristic(Characteristic.Manufacturer, "HTTP Manufacturer")
    .setCharacteristic(Characteristic.Model, "HTTP Model")
    .setCharacteristic(Characteristic.SerialNumber, "HTTP Serial Number");
    

    if (this.service == "Switch") {
      var switchService = new Service.Switch(this.name);

      switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerState.bind(this))
      .on('set', this.setPowerState.bind(this));

      return [switchService];
    } else if (this.service == "Light") {
      var lightbulbService = new Service.Lightbulb(this.name);

      lightbulbService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerState.bind(this))
      .on('set', this.setPowerState.bind(this));

      if (this.brightnessHandling == "yes") {

        lightbulbService
        .addCharacteristic(new Characteristic.Brightness())
        .on('set', this.setBrightness.bind(this));
      }

      return [lightbulbService];
    } else if (this.service == "TemperatureSensor") {
      var temperatureSensorService = new Service.TemperatureSensor("Sensor de Temperatura");

      temperatureSensorService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getCurrentTemperature.bind(this));

      return [temperatureSensorService];
    } else if (this.service == "WindowCovering") {
      var windowcoveringService = new Service.WindowCovering(this.name);

      windowcoveringService
      .getCharacteristic(Characteristic.CurrentPosition)
      .on('get', this.getCurrentPosition.bind(this));
      windowcoveringService
      .getCharacteristic(Characteristic.TargetPosition)
      .on('get', this.getTargetPosition.bind(this))
      .on('set', this.setTargetPosition.bind(this));
      windowcoveringService
      .getCharacteristic(Characteristic.PositionState)
      .on('get', this.getPositionState.bind(this));

      return [informationService, windowcoveringService];
    }
  }
};
