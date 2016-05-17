var XLink_1_0 = require('w3c-schemas').XLink_1_0;
var OWS_1_1_0 = require('ogc-schemas').OWS_1_1_0;
var WPS_1_0_0 = require('ogc-schemas').WPS_1_0_0;

var context =  new Jsonix.Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0]);
var unmarshaller = context.createUnmarshaller();
unmarshaller.unmarshalFile("../data/wps_get_capabilities_zoo.xml", function(result) {
    console.log(result);
});