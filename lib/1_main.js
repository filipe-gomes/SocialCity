import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';




// Publish
if (Meteor.isServer) {
	
	console.log("==================================");
	console.log("SocialCity is starting up");
	console.log("==================================");
	console.log("FILE PATH: " + Meteor.settings.public.file_storage_path);
	
}



Meteor.methods({
	
	// GENERAL METHODS ONLY
	// We don't want to get disorganized here ;) 
	
	
});


if (Meteor.isServer) {
	
	
	Meteor.publish('myFriends', function( ) {
		
		var myFriends = Connections.find({ownerId:Meteor.userId()});
		
		return myFriends;
		
	});
	
	Meteor.publish('activityById', function( theId ) {
		
		console.log("Finding Activity for id: "+theId);
		
		var theActivities = Activities.find({_id:theId});
		
		return theActivities;
		
	});
	
	Meteor.publish('activityByPage', function( pageUrl ) {
		
		console.log("Finding Activity for page: "+pageUrl);
		
		var theActivities = Activities.find({url:pageUrl});
		
		return theActivities;
		
	});
	

	Meteor.publish('fetchUserMetaByUsername', function( theUserName ) {
		
		console.log("fetchUserMetaByUsername: "+theUserName);
		
		return UserMeta.find({username: theUserName });
		
	});
	
	
	Meteor.publish('findUserMeta', function( theUserName ) {
		
		console.log("Finding userMeta for user: "+theUserName);
		
		if(theUserName == "self"){
			console.log("User found self meta");
			return UserMeta.find({meteorUserId:Meteor.userId()});	
		}else{
			console.log("User found another user");
			return UserMeta.find({username: {$regex : new RegExp(theUserName, "i")} });
		}
		
	});
	
	Meteor.publish('findUserMetaById', function( theId ) {
		
		return UserMeta.find({meteorUserId:theId});	
		
	});
	
	
	// SEARCH	
	Meteor.publish('searchUserMeta', function( theSearch ) {
		
		
		/*
		var mongoDbArr = [];
		searchArray.forEach(function(text) {
			mongoDbArr.push({name: new RegExp(text)});
			mongoDbArr.push({tags: new RegExp(text,"i")});
		});

		return Items.find({ $or: mongoDbArr});
		*/
		

		console.log("Searching for: " + theSearch);
		
		var parts = theSearch.split(" ");
		console.log("Split");
		console.log(parts);
		
		if(parts.length == 1){
			
			return UserMeta.find( 
				{$or:[
					{nameFirst:{$regex : new RegExp(theSearch, "i")}},
					{nameLast:{$regex : new RegExp(theSearch, "i")}}
				]} 
			);	
			
		}
		
		if(parts.length >= 1){
			
			return UserMeta.find( 
				{$or:[
					{nameFirst:{$regex : new RegExp(parts[0], "i")}},
					{nameLast:{$regex : new RegExp(parts[0], "i")}},
					{nameFirst:{$regex : new RegExp(parts[1], "i")}},
					{nameLast:{$regex : new RegExp(parts[1], "i")}},
				]} 
			);	
			
		}
		
		
	
	});
	
	
	
	
	
	
	
	
	
}
	