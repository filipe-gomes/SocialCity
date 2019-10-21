import { Meteor } from 'meteor/meteor';
import fs from 'fs-extra';


var OneSignal = require('onesignal-node');

// create a new Client for a single app
var oneSignalMessenger = new OneSignal.Client({
	app: { appAuthKey: Meteor.settings.public.oneSignalAppAuthKey, appId: Meteor.settings.public.oneSignalAppId }
});



Meteor.startup(() => {
  // code to run on server at startup
  


	/*
	Accounts.emailTemplates.resetPassword.text = function(user, url) { 
		var id = url.split('/')[5]; 
		return "Click this link to reset your YouDoer password: <a href='//"+Meteor.settings.public.cdnPath+"/reset-password/" + id +"'>RESET PASSWORD</a>"; 
	}
	*/
	/*
	Accounts.emailTemplates.verifyEmail.html = function(user, url) {
		return '<h1>Thank you for your registration.</h1><br/><a href="' + url + '">Verify eMail</a>';
	};
	
	Accounts.emailTemplates.enrollAccount.subject
	Accounts.emailTemplates.enrollAccount.title
	*/
	
	Accounts.emailTemplates.siteName = 'SocialCity.website';
	Accounts.emailTemplates.from = 'SocialCity NoReply <noreply@socialcity.com>';
	Accounts.emailTemplates.resetPassword.subject = "SocialCity password reset";
	Accounts.emailTemplates.resetPassword.title =  "SocialCity password reset";
	
	/*
	Accounts.emailTemplates.resetPassword.html = function (user, url) {
	  SSR.compileTemplate('forgotPassword', Assets.getText('forgotPassword.html'));
	  return SSR.render("forgotPassword", { username: user.username, url: url });
	};
	*/	
	
	Accounts.emailTemplates.resetPassword = {
	  from: ()=> "SocialCity <noreply@SocialCity.website>",
	  subject: ()=> "Reset Your SocialCity Account Password",
	  text: (user, url)=> {
		newUrl = url.replace("#/reset-password", "reset-password");
		newUrl = newUrl.replace("http://localhost:3000", "https://socialcity.ca");
		return `Click this link to reset your password:\n${newUrl}`;
	  }
	};
  
	var geo = new GeoCoder();
	// var result = geo.geocode('29 champs elysée paris');
	
	process.env.MAIL_URL = 'smtp://'+Meteor.settings.public.sendGridUser+':'+Meteor.settings.public.sendGridPassword+'@smtp.sendgrid.net:587';
	
	//Meteor.ServerTools.SendEmail("youremailfortesting@gmail.com", "YouDoer Server has started", "<h1><center>The YouDoer server has started</center></h1>");
	
	var serverTime = 30;
	var serverTick = 0;
	Meteor.setInterval(function(){
		

		// FIX BROKEN IMAGES FROM ORIGINAL DATA
		// This should end up disabled and deleted
		var theUserMeta = UserMeta.find({photoFix:"false"}, {limit:10});
		theUserMeta.forEach(function(userMeta){
			
			console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ PHOTO FIX: " + userMeta.meteorUserId);
			
			var storageRoot = Meteor.settings.public.file_storage_path;
			var storageProcessing = Meteor.settings.public.file_storage_path+'/_processing';
			
			// CREATE DIRECTORIES
			var theDirectory = "";
			
			// Profile Directory
			theDirectory = storageRoot+"/users/"+userMeta.meteorUserId+"/profile";
			fs.ensureDir(theDirectory);
			
			// Cover Directory
			theDirectory = storageRoot+"/users/"+userMeta.meteorUserId+"/cover";
			fs.ensureDir(theDirectory);
			
			var randomPhoto = Math.floor(Math.random() * 20) + 1;
			var randomPhotoCover = Math.floor(Math.random() * 4) + 1;
			
			// Move profile photos
			fs.copy(storageRoot+'/default/medium-defaultUser ('+randomPhoto+').jpg', storageRoot+'/users/'+userMeta.meteorUserId+'/profile/small-defaultUser ('+randomPhoto+').jpg')
			  .then(() => console.log('success!'))
			  .catch(err => console.error(err));
			fs.copy(storageRoot+'/default/medium-defaultUser ('+randomPhoto+').jpg', storageRoot+'/users/'+userMeta.meteorUserId+'/profile/medium-defaultUser ('+randomPhoto+').jpg')
			  .then(() => console.log('success!'))
			  .catch(err => console.error(err));
			fs.copy(storageRoot+'/default/medium-defaultUser ('+randomPhoto+').jpg', storageRoot+'/users/'+userMeta.meteorUserId+'/profile/large-defaultUser ('+randomPhoto+').jpg')
			  .then(() => console.log('success!'))
			  .catch(err => console.error(err));  
			
			// Move cover
			fs.copy(storageRoot+'/default/medium-defaultCover ('+randomPhotoCover+').jpg', storageRoot+'/users/'+userMeta.meteorUserId+'/cover/small-defaultCover ('+randomPhotoCover+').jpg')
			  .then(() => console.log('success!'))
			  .catch(err => console.error(err));
			fs.copy(storageRoot+'/default/medium-defaultCover ('+randomPhotoCover+').jpg', storageRoot+'/users/'+userMeta.meteorUserId+'/cover/medium-defaultCover ('+randomPhotoCover+').jpg')
			  .then(() => console.log('success!'))
			  .catch(err => console.error(err));
			fs.copy(storageRoot+'/default/medium-defaultCover ('+randomPhotoCover+').jpg', storageRoot+'/users/'+userMeta.meteorUserId+'/cover/large-defaultCover ('+randomPhotoCover+').jpg')
			  .then(() => console.log('success!'))
			  .catch(err => console.error(err));  
			
			
			
			
			UserMeta.update( {meteorUserId:userMeta.meteorUserId},{
				$set:{
					photo:"defaultUser ("+randomPhoto+")",
					photoCover:"defaultCover ("+randomPhotoCover+")",
					photoFix:"true",
				}
			});
			
			// Insert Profile Photo
			PhotosProfile.insert({
					
				status:"active",
		
				ownerId:userMeta.meteorUserId,
				ownerUsername:userMeta.username,
				
				fileId: "defaultUser ("+randomPhoto+")",
				
				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),
				
			});
			
			// Insert Cover Photo
			PhotosCover.insert({
					
				status:"active",
		
				ownerId:userMeta.meteorUserId,
				ownerUsername:userMeta.username,
				
				fileId: "defaultCover ("+randomPhotoCover+")",
				
				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),
				
			});
			
			
			// Notifications
			// --------------------------------------
			Notifications.update( {ownerId:userMeta.meteorUserId}, {
				$set: { 
					"ownerPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			
			
			// Posts
			// --------------------------------------
			Posts.update( {ownerId:userMeta.meteorUserId}, {
				$set: { 
					"ownerPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			
			// Comments
			// --------------------------------------
			Comments.update( {ownerId:userMeta.meteorUserId}, {
				$set: { 
					"ownerPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			
			// Connections
			// --------------------------------------
			Connections.update( {ownerId:userMeta.meteorUserId}, {
				$set: { 
					"ownerPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			Connections.update( {toOwnerId:userMeta.meteorUserId}, {
				$set: { 
					"toPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			
			// Chats
			// --------------------------------------
			Chats.update( {ownerId:userMeta.meteorUserId}, {
				$set: { 
					"ownerPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			Chats.update( {toOwnerId:userMeta.meteorUserId}, {
				$set: { 
					"toPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			
			// ChatMessages
			// --------------------------------------
			ChatMessages.update( {ownerId:userMeta.meteorUserId}, {
				$set: { 
					"ownerPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			ChatMessages.update( {toOwnerId:userMeta.meteorUserId}, {
				$set: { 
					"toPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			
			// Activities
			// --------------------------------------
			Activities.update( {ownerId:userMeta.meteorUserId}, {
				$set: { 
					"ownerPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			
			// Groups
			// --------------------------------------
			Groups.update( {ownerId:userMeta.meteorUserId}, {
				$set: { 
					"ownerPhoto": "defaultUser ("+randomPhoto+")",
				},
			}, {multi: true});
			
			
			
			
		});
		
		
		
		
		
		var ALL = true;
		if(ALL){
			
			var newActivities = Activities.find({});
			newActivities.forEach(function(theActivity){
				processTime(theActivity);
			});
			
		}else{
		
			var newActivities = Activities.find({ status:"new" });
			newActivities.forEach(function(theActivity){
				processTime(theActivity);
			});
			
			var allActivities = Activities.find({ status:"active" });
			allActivities.forEach(function(theActivity){
				
				console.log("--- NEXT RUN TIME: " + (theActivity.nextRunTimestamp - (Date.now()/1000) ) );
				if( (theActivity.nextRunTimestamp - (Date.now()/1000)) <= 0){
					console.log("---- EXPIRED: " + theActivity.title);
					processTime(theActivity);
				}
				
			});
			
		}
		
		/*
		var newActivities = Activities.find({ nextRunTimestamp:0 });
		processTime(newActivities);
		
		var expiredActivities = Activities.find({ nextRunTimestamp:{$	gte:(Date.now()/1000)} });
		//processTime(expiredActivities);
		expiredActivities.forEach(function(theActivity){
			//console.log(theActivity.title + " HAS EXPIRED");
		});
		*/
		
		// ------------------------------
		console.log("Tick: "+serverTick+" @ "+Date.now());
		serverTick++
		
	},1000*serverTime);
});


var processTime=function(theActivity){
	
	//theActivities.forEach(function(theActivity){
			
		// console.log(theActivity.dates);
		
		console.log("-----Update Activity: "+ theActivity.title);
		console.log("------Select next date: "+Date.now());
		
		
		var theTimestampNow = Date.now()/1000;
		var theSelectedIndex = 0;
		
		
		var smallestTime = "";
		var smallestIndex = 0;
		
		theActivity.dates.forEach(function(theDate,index){
			
			
			var thisTime = (theDate.timestampEvent - theTimestampNow);
			console.log("--------- ["+ index + "] = "+thisTime + " < " + smallestTime); 
			
			if( thisTime > 0 ){				
				
				if(smallestTime == ""){
					smallestTime = thisTime;
					smallestIndex = index;
					console.log("+++++++ Smallest smallestTime default: " +smallestTime);	
					console.log("+++++++ Smallest smallestIndex default: " +smallestIndex);	
				}
				
				if( thisTime < smallestTime ){
					console.log("------ SET!");
					smallestTime = thisTime;
					smallestIndex = index;
					console.log("+++++++ Smallest index was set: " +index);	
				}
				
			}
			
			
		});
		
		console.log("----------Next Activity: " + smallestTime + " on index: " + smallestIndex + " = " + theActivity.dates[smallestIndex].timestampEvent);
		//console.log(theActivity.dates[smallestIndex]);
		//console.log(theActivity.dates[smallestIndex].day);
		
		if( smallestTime >= 1 ){
			
			Activities.update(theActivity._id,{
				
				$set:{
					"status":"active",
					"nextRunTimestamp":theActivity.dates[smallestIndex].timestampEvent,
					"nextRunMonth":theActivity.dates[smallestIndex].month,
					"nextRunDay":theActivity.dates[smallestIndex].day,
					"nextRunYear":theActivity.dates[smallestIndex].year,
				}
				
			});
			
		}else{
			
			console.log("xxxxxxxxxxxxxxxxx Activity has complete");
			Activities.update(theActivity._id,{
				$set:{
					"status":"complete",
				}
			});
			
		}
		
		console.log("--------------------------------");
		
	//});
	
}

/*
// contents is REQUIRED unless content_available=true or template_id is set.
var oneSignalMessage = new OneSignal.Notification({
    contents: {
        en: "I'm not entirely happy... 3 star at best",
    }
});

// set target users
oneSignalMessage.setIncludedSegments(['All']);
oneSignalMessage.setExcludedSegments(['Inactive Users']);
 

oneSignalMessenger.sendNotification(oneSignalMessage, function (err, httpResponse,data) {
   if (err) {
       console.log('Something went wrong...');
   } else {
       console.log(data, httpResponse.statusCode);
   }
});
*/