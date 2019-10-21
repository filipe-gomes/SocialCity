Router.route('/p', function () {
	
	this.render('people', {to: 'content'});

	Meteor.subscribe("peopleSearch", "");
	
	/*
	if(Meteor.userId()){
		var theFriends = UserMeta.findOne({meteorUserId:Meteor.userId()}).friends;

		theFriends.forEach(function(theFriendId){
			Meteor.subscribe("findUserMetaById", theFriendId);
		});
	}
	*/


}); 

Router.route('/p/:theUsername', function () {

	this.render('people', {to: 'content'});

	Meteor.subscribe("peopleSearch", Router.current().params.theUsername);
	
	/*
	var theFriends = UserMeta.findOne({username:Router.current().params.theUsername.split("@")[1]}).friends;

	theFriends.forEach(function(theFriendId){
		Meteor.subscribe("findUserMetaById", theFriendId);
	});
	*/

}); 

Template.people.rendered = function() {

	
	
};

Template.people.destroyed = function() {

};


Template.people.events({
	

});


Template.people.helpers({
	
	
	people(){
		
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}},{sort: { nameLast: -1 }});
		
	},

});