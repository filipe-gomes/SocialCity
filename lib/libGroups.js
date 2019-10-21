if (Meteor.isServer) {
	Meteor.methods({
	
	
		'createNewGroup'(
			theUpdateId,
			newTitle,
			newDescription,
			ownerUsername,
			ownerType,
			newCategory,
			groupVisibility,
			contentRating,		

			street_number,
			route,
			locality,
			administrative_area_level_1,
			postal_code,
			country,
			
			lat,
			lng,
			
		){
			
			console.log("+++++++++++++++++++++++++++++++");
			console.log("Greoup: "+theUpdateId);
			console.log("+++++++++++++++++++++++++++++++");
			
			var ownerMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			
			
			if(theUpdateId != "0"){
				console.log("Group Update: " + theUpdateId);
				
				var theActivity = Activities.findOne({_id:theUpdateId});
				
				Activities.update(theUpdateId, {
					$set: { 
						"title":newTitle,
						"description":newDescription,
						"address":newAddress,
						
						"lat":theLat,
						"lng":theLng,
						
						"category":newCategory,
						
						"dates":newDates,
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
				
				return theActivity.url;
				
			}else{
				console.log("Group Insert");				
				
				var theGroupId = Groups.insert({
				
					ownerId: Meteor.userId(),
					ownerName: Meteor.user().profile.nameFirst +" "+Meteor.user().profile.nameLast,
					ownerPhoto: ownerMeta.photo,
					ownerPersonOrGroup:ownerType,
					url:"0000",
					
					title:newTitle,
					description:newDescription,
					socialRating:500,
					
					photo:"eventDefault.jpg",
					category:newCategory,
					
					groupVisibility:groupVisibility,
					contentRating:contentRating,
					
					groupMembersCount:1,
					
					locationsCount:1,
					"location":[
						{	
							street_number:street_number,
							route:route,
							locality:locality,
							administrative_area_level_1:administrative_area_level_1,
							postal_code:postal_code,
							country:country,
							
							lat:lat,
							lng:lng,
							
						}
					],
					
					timeCreated:parseInt(Date.now()),
					timeAgoCreated:new Date().toISOString(),
					timeUpdated:parseInt(Date.now()),
					timeAgoUpdated:new Date().toISOString(),
				});
				
				var theUrl = Meteor.ServerTools.ToSeoUrl( newTitle + "-" + theGroupId );
				
				Groups.update(theGroupId, {
					$set: { 
						"url": theUrl, 
					},
				});
				
				
				
				// ADD GROUP CONNECTION
				Connections.insert({
					
					type:"group",
					status:"accepted",
					role:"owner",
					
					ownerId: Meteor.userId(),
					ownerUsername: Meteor.user().username,
					ownerNameFirst: Meteor.user().profile.nameFirst,
					ownerNameLast: Meteor.user().profile.nameLast,
					ownerPhoto:ownerMeta.photo,
					
					groupId: theGroupId,
					groupUrl: theUrl,
					groupTitle: newTitle,
					groupPhoto: "eventDefault.jpg",
					
					timeCreated:parseInt(Date.now()),
					timeUpdated:parseInt(Date.now()),
					
				});
				
				console.log("New Group: " + theGroupId);
				return theUrl;
				
			}
			
			
			
		},
		
		
		
		'groupRegister'(
			theAction,
			theActivityId
		){
			
			// Check to see if user is registered already
			// If not, register
			// If yes, unregister
			
			var theRegistration = Notifications.findOne({ ownerId:Meteor.userId(), type:"registration", status:"going" });
			var theActivity = Activities.findOne({ _id:theActivityId });
			
			var theUserMeta = UserMeta.findOne({ meteorUserId:Meteor.userId() });
			var theActivityOwnerMeta = UserMeta.findOne({ meteorUserId: theActivity.ownerId });
			
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
			
			console.log("THE NEW UPDATE IS");
			console.log(updatedDoers);
			
			Activities.update({
			  _id:theActivity._id
			}, {
			  $set: {
				'doersGoing.doers': updatedDoers
			  }
			});
			
			
			/*
			Activities.update(
				{_id:theActivity._id},
				{$push:
					{doersGoing:
						{doers:{
							car
							}
						}
					}
				}
			);
			*/
			
			//console.log("activityRegister Starting:");
			//console.log(theActivity);
			//console.log(theUserMeta);
			//console.log(theActivityOwnerMeta);
			
			if(theAction == "register" && !theRegistration){
				
				// UPDATE EXAMPLE
				/*
				Projects.update({
				  'fields.options._id': optionId
				}, {
				  $set: {
					`fields.0.options.1.title`: title
				  }
				}
				*/
				
				
				
				// Update the event details
				Activities.update( theNotification._id, {
					$set: { 
						"read": "true", 
					},
				});
				
				
				
				// My notificaiton
				Notifications.insert({
					
					type:"registration",
					status:"going",
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
				Notifications.insert({
					
					type:"registration",
					status:"going",
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
			
		},
	
		
		// ================
		//
		// COVER (cloudinary)
		//
		// ================
		'cloudinaryUploadGroupCoverPhoto'(
			theUrl,
			theGroupUrl,
		){
			
			if( !Meteor.userId()){
				return;
			}
			// No security check here, it will ONLY ever change your own profile photo LOL
			
			var theGroup = Groups.findOne({ url:theGroupUrl });
			
			Groups.update( theGroup._id, {
				$set: { 
					"photo": theUrl, 
				},
			});
			console.log("cloudinaryUploadGroupProfilePhoto updated an image");
				
				
		},
		
		
	});
	
	
	Meteor.publish('findGroups', function( groupSearchType ) {

		console.log("findGroups: "+groupSearchType);
		
		if(groupSearchType=="myGroups"){
			
			var myGroups = Connections.find({ type:"group", status:"accepted", ownerId: Meteor.userId() }, {sort: { timeUpdated: -1 }, limit: 25});
			
			// Build Post Owners array
			// -----------------------
			var theGroupsArray = [];
				
			myGroups.forEach(function(group){
				theGroupsArray.push(group.groupId);
				console.log("Group found: " + group.groupId);
			});
			return Groups.find({ _id:{$in:theGroupsArray} }, {sort: { timeUpdated: -1 }, limit: 25});
			
		}
			
		return [];
		
	});
	
	Meteor.publish('findGroupByUrl', function( theGroupUrl) {

		console.log("findGroupByUrl: "+theGroupUrl);
		return Groups.find({url:theGroupUrl}, {sort: { timeUpdated: -1 }, limit: 10});
		
	});
	
	
}
