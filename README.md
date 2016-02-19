# homebridge-eedomus
eedomus plugin for homebridge

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-eedomus
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

You need to add your eedomus credentials:
- ip: your eedomus IP
- api_user: your eedomus API user
- api_secret: your eedomus API password

In the below example you have four type of services:
- Switch
- WindowCovering
- TemperatureSensor
- Light

Configuration sample:

 ```
{
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    
    "description": "This is an example configuration file with one fake accessory and one fake platform. You can use this as a template for creating your own configuration file containing devices you actually own.",

    "credentials": {
        "ip" : "your_local_eedomus_ip",
        "api_user" : "your_eedomus_api_user",
        "api_secret" : "your_eedomus_api_secret"
    },

    "accessories": [
       {
           "accessory": "eedomus",
           "name": "Devide name",
           "periph_id": "device API id",
           "service": "Switch"
       },
       {
           "accessory": "eedomus",
           "name": "Devide name",
           "periph_id": "device API id",
           "service": "WindowCovering"
       },
       {
           "accessory": "eedomus",
           "name": "Devide name",
           "periph_id": "device API id",
           "service": "TemperatureSensor"
       },
       {
           "accessory": "eedomus",
           "name": "Devide name",
           "periph_id": "device API id",
           "brightnessHandling": "yes",
           "service": "Light"
       }
    ]
}
