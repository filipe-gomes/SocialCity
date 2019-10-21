Router.route('/messages', {
	
	waitOn: function () {
		
		if(Meteor.user()){
			return [
				Meteor.subscribe('myChats'),
				Meteor.subscribe('myChatsMessages'),
			];
		}
		
	},
	
	action: function () {

		if (this.ready()){
			
			if(Meteor.userId()){
				if(UserMeta){
					this.render('messages');
					updateMenuUI();
				}
			}
			
		}else{
			this.render('dataLoader');
		}
		
	}
	
}); 


Template.messages.rendered = function() {
	
	setInterval(function(){
		//$(".messagesContainer").animate({ scrollTop: $('.messagesContainer').prop("scrollHeight")}, 1000);
	},1000);
	
	var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
		
	var theChat = Chats.findOne({ _id:meUserMeta.activeChatFriendId  });
	
	var theChatMessagesToObserve = ChatMessages.find({});
	const chatMessagesObserver = theChatMessagesToObserve.observeChanges({
		
		added(theId){
			var theChatMessage = ChatMessages.findOne({ _id:theId });
			if( theChatMessage.status=="unread" && theChatMessage.ownerId != Meteor.userId() ){
				//alert("Read message: "+theId);
				Meteor.call("chatMessageRead", theId);
			}
		}
		
	});

};

Template.messages.destroyed = function() {

};


Template.messages.events({

	'click .uiActionMessagesShowConversation'(event){
		
		const target = event.target;	
		
		var chatWithFriendId = $(event.currentTarget).attr("data-friendId");
		Meteor.call("setActiveChatByFriendId", chatWithFriendId);
		
		// Only perform this action on mobile devices
		if(getResponsiveBreakpoint() == "xs"){
		
			$(".messagesContacts").hide();
			$(".messagesConversation").show();
		
		}
		//Meteor.subscribe('myChats');
		Meteor.subscribe('myChatsMessages');
			
	},
	
	'click .uiActionMessagesHideConversation'(event){
		$(".messagesContacts").show();
		$(".messagesConversation").hide();
	},
	
	'submit .submitTheMessageToChat'(event){
		
		event.preventDefault();
		
		const target = event.target;	
		
		Meteor.call("messengerSubmitMessage", $(".submitChatMessage").val());
			
		$(".submitChatMessage").val("");
		Meteor.subscribe('myChatsMessages');
		
	},

});

Template.messages.helpers({
	
	friends(){
		if(Meteor.userId()){
			return Connections.find({type:"friend", status:"accepted"});
		}
	},
	
	theConversation(){
		
		if(Meteor.userId()){
				
			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			
			var theChat = Chats.findOne({ _id:meUserMeta.activeChatFriendId  });
			
			return theChat;
		
		}
		
	},
	
	messages(){
		
		if(Meteor.userId()){
			
			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			
			var theChat = Chats.findOne({ _id:meUserMeta.activeChatFriendId  });
			
			return ChatMessages.find({ chatParentId: theChat._id });
			
		}
		
	},

});







