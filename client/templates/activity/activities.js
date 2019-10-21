Router.route('/activities', function () {

	this.render('activities', {to: 'content'});

	Meteor.subscribe('activityByExplore');


	/*
	action: function () {

	var sessionData = Session.get('mySession');
		Session.set('mySession', sessionData ++);
		console.log(sessionData);

		setTimeout(function(){

			dbSubscriptionActivites.clear();
			window.thisDbSubscriptionActivites = "";
			window.thisDbSubscriptionActivites = dbSubscriptionActivites.subscribe("activityByExplore");

			Tracker.autorun(function() {
				if(window.thisDbSubscriptionActivites.ready()) {

					BlazeLayout.render("activities");
					$('body').removeClass("shards-app-promo-page--1");

				}
			});

			updateMenuUI();

		},1); // Must wait for DOM?

	}
	*/

});

Router.route('/activities/:theSearch', {


	waitOn: function () {


	},

	action: function () {

		if (this.ready()){

			if(Meteor.userId()){
				this.render('activities');
				updateMenuUI();
			}

		}else{
			this.render('dataLoader');
		}
		updateMenuUI();
	}

});




Template.activities.rendered = function() {
	$('body').addClass("shards-app-promo-page--1");

	//ga('send', 'event', "view", "landing");

	window.geoCodeProblemShown = false;

	// =============
	// GOOGLE MAPS
	// =============
	$("#map").html("");
	setTimeout(function(){
		var bounds = new google.maps.LatLngBounds();

		map = new google.maps.Map(document.getElementById('map'), {
		  zoom: 12,
		  center: new google.maps.LatLng(43.650870, -79.383438),
		  mapTypeId: 'roadmap'
		});

		map.data.forEach((feature) => {
			feature.getGeometry().getType() === 'Point' ? map.data.remove(feature) : null
		});

		var geocoder = new google.maps.Geocoder();

		var features = [];

		Activities.find({}).forEach(function(theActivity){

			setTimeout(function(){

				var myLatLng = {lat: theActivity.lat, lng: theActivity.lng};

				var marker = new google.maps.Marker({
				  map: map,
				  position: myLatLng,
				});


				features.push({
					//position: new google.maps.LatLng( theProperty.lat,theProperty.lng ),
					//type: theProperty.status,
					//meteorId:theProperty._id,
					theContentWindow:"<h1>"+theActivity+"</h1>"
				});

				loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
				bounds.extend(loc);

				map.fitBounds(bounds);
				map.panToBounds(bounds);
				map.setZoom(12);

			},100);


		});

		// Create markers.
		features.forEach(function(feature) {

			var infowindow = new google.maps.InfoWindow({
			  content: feature.theContentWindow
			});

			var marker = new google.maps.Marker({
				position: feature.position,
				icon: '/images/icon.png',
				map: map
			});

			marker.addListener('click', function() {
				infowindow.open(map, marker);
				//alert(feature.meteorId);
				//Modal.show('reportPropertyModal', function () {
				//	window.thePropertyId = feature.meteorId;
				//});
			});

			bounds.extend(marker.position);
		});
		map.fitBounds(bounds);

	},100);

};




Template.activities.destroyed = function() {

};


Template.activities.events({


});



Template.activities.helpers({

	Activities() {

		// Find and return their recent desk_post
		return Activities.find({},{sort: { nextRunTimestamp: 1 }});

	},

	convertToDate(theTimestamp){
		console.log("CONVERTING DATE:"+theTimestamp);
		return moment.unix(theTimestamp).fromNow();
	},

});
