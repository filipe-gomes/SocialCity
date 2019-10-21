if (Meteor.isServer) {

	Meteor.publish('myChats', function() {
		
		console.log("--------------------------------- Finding All Chats");
		
		var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
	
		var theChats = Chats.find({ 
			users:meUserMeta.meteorUserId,
			status:"active"
		});
		
		if(theChats){
			
			// COUNT THE UNREAD MESSAGES
			var theUnreadAmount = 0;
			
			theChats.forEach(function(theChat){
				var countMessagesUnread = ChatMessages.find({ status:"unread", chatParentId:theChat._id });
				countMessagesUnread.forEach(function(theMessage){
					theUnreadAmount ++;
				});
			});
			 
			UserMeta.update( {meteorUserId:Meteor.userId()}, {
				$set: { 
					messagesUnread: theUnreadAmount, 
				},
			});
			
			return theChats;
		}else{
			return [];
		}
		
	});
	
	
	Meteor.publish('myChatsMessages', function() {
		 
		//console.log("Finding Chat Messages");
		
		var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
		
		//console.log("- Active chat is: "+ meUserMeta.activeChatFriendId);
		
		if(!meUserMeta.activeChatFriendId){
			//console.log("Could not find activeChatFriendId, returning empty array");
			return [];
		}
		
		// Find chat from user meta
		// ------------------------
		var chatMessagesFound = 0;
		
		//console.log("SEARCHING CHAT FOR USER: " + meUserMeta.activeChatFriendId );
		
		var theChat = Chats.findOne({_id:meUserMeta.activeChatFriendId});
		
		if(theChat){
			console.log(" AND : " + theChat._id);			
		}else{
			UserMeta.update( meUserMeta._id, {
				$set: { 
					"activeChatFriendId": "",
				},
			});
			return [];
		}
		
		var theChatMessages = ChatMessages.find({
			chatParentId: theChat._id
		}, {sort: { timeUpdated: -1 }, limit: 10});
		
		//console.log("Checking chats");
		theChatMessages.forEach(function(theChatMessage){
			chatMessagesFound++;
			//console.log("Scanning chat:");
			//console.log(theChatMessage);
		});
		
		if(chatMessagesFound != 0){
			//console.log("Returning Chat Messages");
			return theChatMessages;
		}else{
			
			//console.log("No Chat Messages Found");
			return [];
			
		}
		
	});
	
	
	
	
	
	Meteor.methods({
		
	
		// ================
		//
		// CREATE COMMENT ON POST
		//
		// ================
		'setActiveChatByFriendId'(
			theFriendId,
		){
			if( !Meteor.userId()){
				return;
			}
			console.log("setActiveChatByFriendId: "+theFriendId);
			
			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			var youUserMeta = UserMeta.findOne({meteorUserId:theFriendId});
			
			
			var theChat = Chats.findOne({
				//users: {$all:[youUserMeta,theFriendId]},
				
				$and:[{users:Meteor.userId()},{users:theFriendId}],
				status:"active"
			});
			console.log("THE CHAT WAS FOUND:");
			console.log(theChat);
			
			////console.log(youUserMeta);
			if(theChat){
				
				UserMeta.update( meUserMeta._id, {
					$set: { 
						"activeChatFriendId": theChat._id, 
					},
				});
				
				return theChat;
				
			}else{
				
				console.log(")_)_)_)_)_)_)_)_) CREATING NEW CHAT");
				
				Chats.insert({
					
					status:"active",
					
					users:[
						meUserMeta.meteorUserId,
						youUserMeta.meteorUserId,	
					],
					
					lastMessage: meUserMeta.nameFirst + " connected with "+youUserMeta.nameFirst+", say hello!",
					
					timeCreated:parseInt(Date.now()),
					timeUpdated:parseInt(Date.now()),
					
				}, function(error, resultId){
					
					// Update user 1
					UserMeta.update( meUserMeta._id, {
						$push: {
							"data.chats": resultId, 
						},
					});
					
					// Update user 2
					UserMeta.update( youUserMeta._id, {
						$push: { 
							"data.chats": resultId, 
						},
					});
					
					// Insert message
					ChatMessages.insert({
						
						chatParentId:resultId,
						
						status:"unread",
						
						ownerId: Meteor.userId(),
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						ownerPhoto:meUserMeta.photo,
						
						message: meUserMeta.nameFirst + " connected with "+youUserMeta.nameFirst+", say hello!",
						
						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),
						
					});
					
					theChat = Chats.find({ _id:resultId });

					return theChat;
					
				});



				
				
			}
			
		},
		
		
			
		// ================
		//
		// SUBMIT MESSEGE
		//
		// ================
		'messengerSubmitMessage'(
			theMessageContent,
		){
			
			if( !Meteor.userId()){
				return;
			}
			//console.log("messengerSubmitMessage: "+Meteor.ServerTools.TagStrip(theMessageContent));
			
			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			
			var theChat = Chats.findOne({ _id: meUserMeta.activeChatFriendId }); 
			
			console.log("^^^^^^^^^^^^^^^^^^^^^^ messengerSubmitMessage: "+theChat._id+": "+ theMessageContent);
		
			// Insert message
			ChatMessages.insert({
				
				chatParentId:theChat._id,
				
				status:"unread",
				
				ownerId: Meteor.userId(),
				ownerUsername: Meteor.user().username,
				ownerNameFirst: Meteor.user().profile.nameFirst,
				ownerNameLast: Meteor.user().profile.nameLast,
				ownerPhoto:meUserMeta.photo,
				
				message: Meteor.ServerTools.TagStrip(theMessageContent),
				
				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),
				
			});
			
			// Find users in the chat group who need notifications
			var theChatUsers = Chats.findOne({ _id: meUserMeta.activeChatFriendId }); 
			theChatUsers.users.forEach(function(theUserId){
				
				console.log("CHAT USER: " + theUserId);
				
				if( theUserId != Meteor.userId() ){
					
					console.log("NOTIFIYING USER: " + theUserId);
					UserMeta.update( {meteorUserId:theUserId}, {
						$inc: { 
							messagesUnread: 1, 
						},
					});
					
					var theUserMeta = UserMeta.findOne({ meteorUserId: theUserId });
					var fromUserMeta = UserMeta.findOne({ meteorUserId: Meteor.userId() });
					
					Meteor.ServerTools.SendEmail(
						theUserMeta.email, 
						fromUserMeta.nameFirst +" "+ fromUserMeta.nameLast +" sent you a message", "<h1><center>"+Meteor.ServerTools.TagStrip(theMessageContent)+"</center></h1>"
					);
					
				}
				
			});
			
			
		},
		
		
		// ================
		//
		// CHAT MESSAGE HAS BEEN READ
		//
		// ================
		'chatMessageRead'(
			theMessageId,
		){
			
			ChatMessages.update( theMessageId, {
				
				$set: {
					"status": "read", 
				},
				
			});
			
			// Decrease the unread messages count
			UserMeta.update( {meteorUserId:Meteor.userId()}, {
				$inc: { 
					messagesUnread: -1, 
				},
			});
			
			
		},
		
	});
	
}
