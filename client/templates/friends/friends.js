Router.route('/friends', function () {
	
	this.render('friends', {to: 'content'});
	
	if(Meteor.userId()){
		var theFriends = UserMeta.findOne({meteorUserId:Meteor.userId()}).friends;

		theFriends.forEach(function(theFriendId){
			Meteor.subscribe("findUserMetaById", theFriendId);
		});
	}


}); 

Router.route('/friends/:theUsername', function () {

	this.render('friends', {to: 'content'});
	
	var theFriends = UserMeta.findOne({username:Router.current().params.theUsername.split("@")[1]}).friends;

	theFriends.forEach(function(theFriendId){
		Meteor.subscribe("findUserMetaById", theFriendId);
	});


}); 

Template.friends.rendered = function() {

	
	
};

Template.friends.destroyed = function() {

};


Template.friends.events({
	

});


Template.friends.helpers({
	
	
	friends(){
		
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
		
	},

});