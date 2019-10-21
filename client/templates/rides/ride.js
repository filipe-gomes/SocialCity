Router.route('/rides/:rideId', {
	
	
	waitOn: function () {
		
		if(Meteor.user()){
			return [
				Meteor.subscribe("activityByPage", Router.current().params.activityId),
				//Meteor.subscribe('findPosts', "activity", Router.current().params.activityId),
				//Meteor.subscribe('fetchComments', "activity", Activities.findOne({})._id)
			];
		}
		
	},

	action: function () {
		
		if (this.ready()){
			
			if(Meteor.userId()){
				this.render('ride');
				updateMenuUI();
			}
			
		}else{
			this.render('dataLoader');
		}
		
	}

	
});

Template.ride.rendered = function() {
	
	//ga('send', 'event', "view", "landing");
	
	var theActivities = Activities.find({}, {sort: {timeUpdated: -1}});

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
	
	var theActivitiesCount = 0;	
	theActivities.forEach(function(theActivity){
		
		theActivitiesCount++;
				
		var myLatLng = {lat: theActivity.lat, lng: theActivity.lng};
		
		var marker = new google.maps.Marker({
		  map: map,
		  position: myLatLng,
		});
		
		features.push({
			//position: new google.maps.LatLng( theProperty.lat,theProperty.lng ),
			//type: theProperty.status,
			//meteorId:theProperty._id,
			theContentWindow:"<h1>Pearson Int Airport Terminal 1 Ground Level"
		});
		
		loc = new google.maps.LatLng(theActivity.lat, theActivity.lng);
		bounds.extend(loc);
		map.fitBounds(bounds);   
		map.panToBounds(bounds);     
		
	});
	
	if(theActivitiesCount == 1){
		setTimeout(function(){
			map.setZoom(12);
		},100);
	}

	// Create markers.
	features.forEach(function(feature) {
		
		var infowindow = new google.maps.InfoWindow({
		  content: feature.theContentWindow
		});
		
		var marker = new google.maps.Marker({
			position: feature.position,
			icon: '/images/common/card-1.jpg',
			map: map
		});
	  
		marker.addListener('click', function() {
			infowindow.open(map, marker);
			//alert(feature.meteorId);
			//Modal.show('reportPropertyModal', function () {
			//	window.thePropertyId = feature.meteorId;
			//});
		});
		
	});
	
	
	//Todo: Find out if DOM is finished, the calendar might not be loaded
	setTimeout(function(){
		theActivities.forEach(function(theActivity){
			
			theActivity.dates.forEach(function(theDate){
			
				console.log("processing calendar date: "+theDate);
				var theSplit = theDate.split("/");
				
				console.log("datepicking: "+theSplit);

				 $.each($(".datepicker").find("td"), function () {                              
				 
					if(theSplit[1] <= 9){
						if("0"+$(this).text()==theSplit[1]){
							$(this).trigger("click");
						}
					}else{
						if($(this).text()==theSplit[1]){
							$(this).trigger("click");
						}
					}
				 });
				 
			});
			 
		});
		
	},1000);

	
	
};

// Helpers
Template.ride.helpers({
	
	
	Activities() {
		
		// Find and return their recent desk_post
		return Activities.find({url:Router.current().params.activityId}, {sort: { timeUpdated: -1 }});
		
	},
	
	isOwner(){
		
		if(Activities.findOne({}).ownerId == Meteor.userId()){
			return true;
		}
		return false;
		
	},
	
	doerGoing(){
		var theDoers = Activities.findOne({}, {sort: { timeUpdated: -1 }});
		
		return theDoers.doersGoing.doers;
	},
	
	registration(theCheck){
		
		var theRegistration = Notifications.findOne({ type:"registration", theUrl:Router.current().params.activityId }, {sort: { timeCreated: -1 }});
		console.log(theRegistration);
		
		if(theCheck == "none" && !theRegistration){
			return true;
		}
		if(theCheck == "going"  && theRegistration.status == "going" ){
			return true;
		}
		
	},
	
	
	convertToDate(theDate){
		return moment(theDate).format('MMMM DD, YYYY');
	},
	
	posts(){

		var thePosts = Posts.find({},{sort: { timeCreated: -1 }});
		
		dbSubscriptionComments.clear();
		window.thisDbSubscriptionComments = "";
		
		thePosts.forEach(function(thePost){
			window.thisDbSubscriptionComments = dbSubscriptionComments.subscribe('findCommentsByPostId', thePost._id);
		});
			
		
		return thePosts
	},
	
	comment(){

		console.log("Comment for: " + this._id);
		return Comments.find({postId:this._id}, {sort: { timeCreated: 1 }} );
	
	},
	
	
	
	
});


Template.ride.destroyed = function() {

};


Template.ride.events({
	
	"click .uiActionRegisterNow"(event){
		alert( $(event.currentTarget).attr("data-action") );
		var status = Meteor.apply("activityRegister", [$(event.currentTarget).attr("data-action"), $(event.currentTarget).attr("data-activityId")], true, function(error,result){
				
			if(result == "activityRegistered"){
				
				swal({
					title: "Registration Successful!",
					text: "",
					type: "success",
					showCancelButton: false,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Close",
				});
				
			}
			
			if(result == "activityCancelled"){
				
				swal({
					title: "Your registration was cancelled",
					text: "",
					type: "danger",
					showCancelButton: false,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Close",
				});
				
			}
			
			
		},{ returnStubValue: true }); 
		
	},
	
	"click #submitPostButton"(){
		
		if(!Meteor.userId()){
			swal({
				title: "Please Sign In to Comment",
				text: "DOER IS 100% FREE!",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
			});
			return;
		}
		
		Meteor.call("createPost", "activity", Router.current().params.activityId, $("#postMessage").val(), false );
		$("#postMessage").val("");
		$(".note-editable").html("");
		
	},
	
	'submit .submitTheCommentToPost'(event){
		
		event.preventDefault();
		
		if(!Meteor.userId()){
			swal({
				title: "Please Sign In to Comment",
				text: "DOER IS 100% FREE!",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
			});
			return;
		}
		
		const target = event.target;				
		Meteor.call("createCommentOnPost",
			event.target.submitCommentToPostId.value,
			event.target.submitComment.value
		);
		$(".submitComment").val("");
		
	},
	
	
	"click .emotion"(event){
		
		if(!Meteor.userId()){
			swal({
				title: "Please Sign In to Share your Emotions!",
				text: "DOER IS 100% FREE!",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
			});
			return;
		}
		
		$(event.currentTarget).children().effect( "shake" );
		
		/*
		$(event.currentTarget).addClass('animated pulse'); 
		setTimeout(function(){
			$(event.currentTarget).removeClass('animated animated'); 
		},1000);
		*/
		console.log("Your "+ $(event.currentTarget).attr("data-context") +" feels "+$(event.currentTarget).attr("data-emotion") );
		
		Meteor.call("submitEmotion", 
			$(event.currentTarget).attr("data-context"), 
			$(event.currentTarget).attr("data-voteid"), 
			$(event.currentTarget).attr("data-emotion"),
		);
		
	},
	
	
	

});