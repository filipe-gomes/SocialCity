if (Meteor.isServer) {

	
	Meteor.publish('myNotifications', function( ) {
		
		var myNotifications = Notifications.find({ownerId:Meteor.userId()}, {sort: { timeUpdated: -1 }, limit: 20});
		
		return myNotifications;
		
	});
	
	Meteor.methods({
		
		
		'notificationsSetZero'(
		){
			
			
			if( !Meteor.userId() ){
				return;
			}
		
			var meUserMeta = UserMeta.findOne({ meteorUserId:Meteor.userId() });
				
			UserMeta.update( meUserMeta._id, {
				$set: { 
					"notificationsCountSocial": 0, 
				},
			});
		
		},
		
		'notificationsMarkRead'(
		){
		
			var theNotifications = Notifications.find({ read:"false" });
			theNotifications.forEach(function(theNotification){
				
				Notifications.update( theNotification._id, {
					$set: { 
						"read": "true", 
					},
				});
				
			});
		
		},
		
	});
		
}
