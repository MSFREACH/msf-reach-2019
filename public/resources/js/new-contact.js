// Create map
var newContactMap = L.map('map').setView([20, 110], 4);
var autocompleteMap=newContactMap;

newContactMap.locate({setView: true, maxZoom: 16});
// Add some base tiles
var mapboxTerrain = L.tileLayer('https://api.mapbox.com/styles/v1/acrossthecloud/cj9t3um812mvr2sqnr6fe0h52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWNyb3NzdGhlY2xvdWQiLCJhIjoiY2lzMWpvOGEzMDd3aTJzbXo4N2FnNmVhYyJ9.RKQohxz22Xpyn4Y8S1BjfQ', {
	attribution: '© Mapbox © OpenStreetMap © DigitalGlobe',
	minZoom: 0,
	maxZoom: 18
}).addTo(newContactMap);

// Add some satellite tiles
var mapboxSatellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG9tYXN1c2VyZ3JvdXAiLCJhIjoiY2o0cHBlM3lqMXpkdTJxcXN4bjV2aHl1aCJ9.AjzPLmfwY4MB4317m4GBNQ', {
	attribution: '© Mapbox © OpenStreetMap © DigitalGlobe'
});

var baseMaps = {
	"Terrain": mapboxTerrain,
	"Satellite" : mapboxSatellite
};

var overlayMaps = {};

var layerControl = L.control.layers(baseMaps, overlayMaps, {'position':'topright'}).addTo(newContactMap);

var marker;
var latlng = null;
newContactMap.on('click', function(e) {
	if(marker)
	newContactMap.removeLayer(marker);
	latlng = e.latlng; // e is an event object (MouseEvent in this case)
	marker = L.marker(e.latlng).addTo(newContactMap);
});

function postContact() {
	var contName=($("#inputContactFirstName").val() || '')+' '+($("#inputContactLastName").val() || '')+' '+($("#inputContactOtherName").val() || '');
	var affiliationName = '';
	if ($("#inputContactAff").val() === 'Current MSF Staff') {
		affiliationName = 'MSF';
	} else {
		affiliationName = $('#inputAffName').val() || '';
	}
	var body = {
		"location":latlng,
		"properties":{
			"address": $('#mapAddress').val(),
			"title": $("#inputContactTitle").val() || '',
			"gender": $("#inputGender").val(),
			"name": contName.trim(),
			"speciality": $("#inputSpeciality").val() || '',
			"type":$("#inputContactAff").val() || $("#inputContactOtherAff").val() ,
			"affiliationName": affiliationName,
			"OC": $("#inputContactOC").val() || '',
			"employment": $("#inputContactMSFEmploy").val() || '',
			"position": $("#inputContactMSFPosition").val() || '',
			"dob":$("#datepicker").val(),
			"cell":$("#inputContactCell").val() || '',
			"home":$("#inputContactHome").val() || '',
			"work":$("#inputContactWork").val() || '',
			"email":$("#inputContactEmail").val(),
			"email2": $("#inputContactEmail2").val() || '',
			"WhatsApp": $("#inputWhatsApp").val() || '',
			"Twitter": $("#inputTwitter").val() || '',
			"Telegram": $("#inputTelegram").val() || '',
			"Facebook": $("#inputFacebook").val() || '',
			"Skype": $("#inputSkype").val() || '',
			"Instagram": $("#inputInstagram").val() || '',
		}
	};
	//console.log(body);
	$.ajax({
		type: "POST",
		url: "/api/contacts",
		data: JSON.stringify(body),
		contentType: 'application/json'
	}).done(function( data, textStatus, req ){
		$('#divProgress').html('Contact submitted!');
		$('#divSuccess').show(500);
	}).fail(function (req, textStatus, err){
		$('#divProgress').html('An error occured');
		console.log(err);
		console.log(textStatus);
	});
}

$( function() {
	$( "#datepicker" ).datepicker({
      changeMonth: true,
      changeYear: true,
			dateFormat: 'dd/mm/yy',
			yearRange: '1900:' + new Date().getFullYear(),
			onSelect: function(dateText, inst) {
	 				$('#datepicker').text(dateText);
				}
    });
});

$('#createContact').on('click', function (e) {
		$('#divProgress').html('Submitting new contact...');
		postContact();
});
