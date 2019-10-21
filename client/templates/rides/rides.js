
Router.route('/rides', {
	
	
	waitOn: function () {
		
		return [
			
		];
		
	},

	action: function () {
		
		if (this.ready()){
			
			this.render('rides');
			
		}else{
			this.render('dataLoader');
		}
		updateMenuUI();
		
	}
	
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

Router.route('/rides/:theSearch', {
	
	
	waitOn: function () {
		
		
	},

	action: function () {
		
		if (this.ready()){
			
			if(Meteor.userId()){
				this.render('rides');
				updateMenuUI();
			}
			
		}else{
			this.render('dataLoader');
		}
		updateMenuUI();
		
	}

});  




Template.rides.rendered = function() {
	$('body').addClass("shards-app-promo-page--1");
	
	//ga('send', 'event', "view", "landing");
	
	window.geoCodeProblemShown = false;

	// =============
	// GOOGLE MAPS
	// =============
	var bounds = new google.maps.LatLngBounds();

	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 12,
	  center: new google.maps.LatLng(43.650870, -79.383438),
	  mapTypeId: 'roadmap'
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
	
};




Template.rides.destroyed = function() {

};


Template.rides.events({
	

});



Template.rides.helpers({
	
	Activities() {
		
		// Find and return their recent desk_post
		return Activities.find({}, {sort: { timeUpdated: -1 }});
		
	},
	
	convertToDate(theDate){
		return moment(theDate).format('MMMM DD, YYYY');
	},

});

	