if (Meteor.isServer) {
	Meteor.methods({
	
	
		'createNewActivity'(
			theUpdateId,
		
			organizerUsername,
			organizerType,
			organizerId,
			
			newTitle,
			newShortDescription,
			newDescription,
			newTags,
			
			newActivityUrl,
			
			newGeoAddress,
			newStreet_number,
			newRoute,
			newLocality,
			newAdministrative_area_level_1,
			newPostal_code,
			newCountry,
			
			newStartHour,
			newStartMinute,
			newStartAmPm,
			
			newEndHour,
			newEndMinute,
			newEndAmPm,
			
			theDates,
			
			theTickets,
			
			newAgeRestriction,
			
		){
			
			console.log("+++++++++++++++++++++++++++++++");
			console.log("Activity: "+theUpdateId+": "+organizerType);
			console.log("+++++++++++++++++++++++++++++++");
			
			var ownerMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			
			if(theUpdateId != "0"){
				console.log("Activity Update: " + theUpdateId);
				
				var theActivity = Activities.findOne({_id:theUpdateId});
				
				Activities.update(theUpdateId, {
					$set: { 
						"title":newTitle,
						"description":newDescription,
						"address":newGeoAddress,
						
						"lat":theLat,
						"lng":theLng,
						
						"category":newCategory,
						
						"dates":theDates,
						"startTime":newStartTime,
						"endTime":newEndTime,
						
						"cost":newCost,
						"costType":newCostType,
						"membership":newMembership,
						"ageRestriction":newAgeRestriction,
						
						"timeUpdated":parseInt(Date.now()),
						"timeAgoUpdated":new Date().toISOString(),
					},
				});
				
				if(newGeoAddress != theActivity.address){
					
					// GEOCODER
					// --------
						var theLat = "NA";
						var theLng = "NA";
						
						console.log("Geocoding new event");
						var geo = new GeoCoder({
							httpAdapter: "https",
							apiKey: 'AIzaSyCIfHcgmj5swUfubLTlPwBKwNvuF07e1PI',
						});
						
						var results = geo.geocode(newGeoAddress);
						results.forEach(function(result){
							//console.log("LAT: "+result.latitude);
							//console.log("LNG: "+result.longitude);
							
							theLat = result.latitude;
							theLng = result.longitude;
						
						});
					// --------
					// GEOCODER
					
					Activities.update(theUpdateId, {
						$set: { 
							"lat":theLat,
							"lng":theLng,
						},
					});
					
				}
				
				
				return theActivity.url;
				
			}else{
				
				
				// ==========================
				// 
				//
				// INSERT NEW ACTIVITY
				//
				//
				// ==========================
				console.log("Activity Insert");
				
				// GEOCODER
				var theLat = "NA";
				var theLng = "NA";
				
				if(newGeoAddress){
					
					console.log("Geocoding new event");
					var geo = new GeoCoder({
						httpAdapter: "https",
						apiKey: 'AIzaSyCIfHcgmj5swUfubLTlPwBKwNvuF07e1PI',
					});
					
					var results = geo.geocode(newGeoAddress);
					results.forEach(function(result){
						//console.log("LAT: "+result.latitude);
						//console.log("LNG: "+result.longitude);
						
						theLat = result.latitude;
						theLng = result.longitude;
					
					});
					
				}
				
				// USER OR GROUP?
				// -------------
				var newOrganizerUsername = "";
				var newOrganizerType = "";
				var newOrganizerId = "";
				var newOrganizerPhoto = "";
				var newOrganizerUrl = "";
				
				if( organizerType == "user"){
					
					newOrganizerUsername = Meteor.user().username;
					newOrganizerType = "user";
					newOrganizerId = Meteor.userId();
					newOrganizerPhoto = ownerMeta.photo;
					newOrganizerUrl = "";
				}
				
				if( organizerType == "group"){
					
					console.log("CREATING AS GROUP: "+organizerId);
					
					var theGroup = Groups.findOne({ _id: organizerId });
					console.log(theGroup);
					
					newOrganizerUsername = theGroup.title;
					newOrganizerType = "group";
					newOrganizerId = organizerId;
					newOrganizerPhoto = theGroup.photo;
					newOrganizerUrl = theGroup.url;
				}
				
				// SEARCH TAGS
				// -----------
				var theSearchTags = [];
				console.log(newTags);
				var splitTags = newTags.split(",");
				splitTags.forEach(function(theTag){
					
					console.log("-----------------SEARCH TAG: " +theTag);
					theSearchTags.push(theTag.replace(/[_\W]+/g, "-"));
					
				});
				
				
				var theActivityId = Activities.insert({
				
					ownerId: Meteor.userId(),
					ownerName: Meteor.user().profile.nameFirst +" "+Meteor.user().profile.nameLast,
					ownerPhoto: ownerMeta.photo,
					
					organizerUsername:newOrganizerUsername,
					organizerType:newOrganizerType,
					organizerId:newOrganizerId,
					organizerPhoto:newOrganizerPhoto,
					organizerUrl:newOrganizerUrl,
					
					activityUrl:newActivityUrl,
					
					tags:theSearchTags,
					
					url:"0000",
					
					title:newTitle,
					shortDescription:newShortDescription,
					description:newDescription,
					photo:"eventDefault.jpg",
					
					address:newGeoAddress,
					
					lat:theLat,
					lng:theLng,
					
					geoAddress:newGeoAddress,
					street_number:newStreet_number,
					route:newRoute,
					locality:newLocality,
					administrative_area_level_1:newAdministrative_area_level_1,
					postal_code:newPostal_code,
					country:newCountry,
					
					status:"new",
					
					nextRunTimestamp:0,
					nextRunMonth:"",
					nextRunDay:"",
					nextRunYear:"",
					nextRunTime:"",
					
					startHour:newStartHour,
					startMinute:newStartMinute,
					startAmPm:newStartAmPm,
					
					endHour:newEndHour,
					endMinute:newEndMinute,
					endAmPm:newEndAmPm,
					
					dates:theDates,
					
					ageRestriction:newAgeRestriction,
					
					tickets:theTickets, 
					
					doersCount:0,
					doersGoing:{
						"doers":[]
					},
					
					timeCreated:parseInt(Date.now()),
					timeAgoCreated:new Date().toISOString(),
					timeUpdated:parseInt(Date.now()),
					timeAgoUpdated:new Date().toISOString(),
					
				});
				
				var theUrl = Meteor.ServerTools.ToSeoUrl( newTitle + "-" + theActivityId );
				
				Activities.update(theActivityId, {
					$set: { 
						"url": theUrl, 
					},
				});
				
				console.log("New Activity: " + theUrl);
				return theUrl;
				
			}
			
			
			
		},
		
		
		
		'activityRegister'(
			theAction,
			theActivityId
		){
			
			// Check to see if user is registered already
			// If not, register
			// If yes, unregister
			
			var theActivity = Activities.findOne({ _id:theActivityId });
			
			var theUserMeta = UserMeta.findOne({ meteorUserId:Meteor.userId() });
			var theActivityOwnerMeta = UserMeta.findOne({ meteorUserId: theActivity.ownerId });
		
			
			//console.log("activityRegister Starting:");
			//console.log(theActivity);
			//console.log(theUserMeta);
			//console.log(theActivityOwnerMeta);
			
			var theConnection = Connections.findOne({ ownerId:Meteor.userId(), type:"activity", status:"Going", activityId:theActivityId });
			console.log("$$$$$$$$$$$$$: USER REGISTRATION EVENT");
			console.log(theConnection);
			
			// REGISTER
			// --------
			if(theAction == "register"){
				if( !theConnection || theConnection.status != "Going" ){
					
					console.log("$$$$$$$$$$$$$$$: New Registration");
				
					// UPDATE ACTIVITY
					// ---------------
					var updatedDoers = theActivity.doersGoing.doers;
					
					updatedDoers.push({
						userId:Meteor.userId(),
						nameFirst:theUserMeta.nameFirst,
						nameLast:theUserMeta.nameLast,
						username:theUserMeta.username,
						photo:theUserMeta.photo,
						time:parseInt(Date.now()),
						status:"Going",
					});
					
					Activities.update({
					  _id:theActivity._id
					}, {
					  $set: {
						'doersGoing.doers': updatedDoers
					  }
					});
					
					Activities.update({
					  _id:theActivity._id
					}, {
					  $inc: {
						'doersCount': 1
					  }
					});
					
					// Connection
					// ----------
					Connections.insert({
						
						type:"activity",
						status:"Going",
						
						ownerId: Meteor.userId(),
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						
						toPhoto: theActivity.photo,
						
						activityId: theActivity._id,
						activityTitle: theActivity.title,
						activityUrl: theActivity.url,
						
						ticketType:"open",
						ticketPrice:"0.00",
						ticketStatus:"new",
						
						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),
						
					});
					
					// My Notificaiton
					// ---------------
					Notifications.insert({
						
						type:"registration",
						status:"Going",
						read:"false",
						
						ownerId: Meteor.userId(),
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						
						toPhoto: theActivity.photo,
						
						activityId: theActivity._id,
						activityTitle: theActivity.title,
						activityUrl: theActivity.url,
						
						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),
						
					});
					
					
					// Activity owner notification
					// --------------------------
					Notifications.insert({
						
						type:"registration",
						status:"Going",
						read:"false",
						
						ownerId: theActivityOwnerMeta.meteorUserId,
						ownerUsername: theActivityOwnerMeta.username,
						ownerNameFirst: theActivityOwnerMeta.nameFirst,
						ownerNameLast: theActivityOwnerMeta.nameLast,
						
						toPhoto: theActivity.photo,
						
						activityId: theActivity._id,
						activityTitle: theActivity.title,
						activityUrl: theActivity.url,
						
						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),
						
					});
					
					
					// email event owner
					Meteor.ServerTools.SendEmail(
						theUserMeta.email, 
						theActivity.title + " activity confirmation", "<a href='https://youdoer.com/activity/"+theActivity.url+"'><h1><center><img src='"+ theActivity.photo +"' width='100%' /><br /><br />"+theActivity.title + " </center></h1><br /><center> You are now registered</center></a>"
					);
					
					// email user a confirmation
					Meteor.ServerTools.SendEmail(
						theActivityOwnerMeta.email, 
						theActivity.title + " activity registration", "<a href='https://youdoer.com/activity/"+theActivity.url+"'><img src='"+ theActivity.photo +"' width='100%' /><br /><br />"+Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast+" has registered for your event: "+theActivity.title + "</a>"
					);
					
					console.log("Activity Registration: " + theActivityId + ": " + theAction);
					return "activityRegistered";
				}
				
			}
			
			// CANCEL REGISTRATION
			// --------
			if(theAction == "cancel"){
				
				Connections.remove(theConnection._id);
				
				// UPDATE ACTIVITY
				// ---------------
				var theDoers = theActivity.doersGoing.doers;
				//console.log(updatedDoers);
				
				var index = 0;
				theDoers.forEach(function(theDoer){
					
					console.log("THE DOER: " + theDoer.userId + " MY ID: " + Meteor.userId() );
					if( theDoer.userId == Meteor.userId() ){
						
						console.log("REMOVING: "+theDoer.username);
						theDoers.splice(index,1);
						
					}
					
					index++;
				});
				
				console.log("The new Doers list:");
				console.log(theDoers);
				
				Activities.update({
				  _id:theActivity._id
				}, {
				  $set: {
					'doersGoing.doers': theDoers
				  }
				});
				
				Activities.update({
				  _id:theActivity._id
				}, {
				  $inc: {
					'doersCount': -1
				  }
				});
				
				return "activityCanceled";
			}	
			
			
		},
	
	
	
		
		// ===========
		// CLOUDINARY
		// ===========
		'cloudinaryUpload'(
			theActivityId,
			theUrl,
		){
			
			if(Activities.findOne({_id:theActivityId}).ownerId == Meteor.userId()){
				
				console.log("Uploading file to Cloudinary");
				
				Activities.update(theActivityId, {
					$set: { 
						"photo": theUrl, 
					},
				});
				console.log("Activity updated an image: " + theActivityId);
				
			}else{
				console.log("INVALID PERMISSION");
			}
				
		},
		
		
		
	});
	
	
	
	Meteor.publish('activityByExplore', function( pageUrl ) {
		
		console.log("Finding All Activities: "+pageUrl);
		var theActivities = Activities.find({ status:"active" },{sort: { nextRunTimestamp: 1 }});
		
		
		return theActivities;
		
	});
	
	
}
