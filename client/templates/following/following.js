Router.route('/following', {
	
	waitOn: function () {
		
	},
	
	action: function () {
		router.go("/surf");
	},

}); 

Router.route('/following/:theUsername', {
	
	
	waitOn: function () {
		
		var theFollowers = UserMeta.findOne({username:Router.current().params.theUsername.split("@")[1]}).following;

		theFollowers.forEach(function(theFollowerId){
			Meteor.subscribe("findUserMetaById", theFollowerId);
		});
		
	},
	
	action: function () {

		if (this.ready()){
			
			this.render('following');
			updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}

}); 

Template.following.rendered = function() {
	
};


Template.following.destroyed = function() {

};


Template.following.events({
	

});


Template.following.helpers({
	
	following(){
		
		var theUserMeta = UserMeta.findOne({ });
		
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
		
	},
	
	theSearch(){
		return window.theSearch;
	},
	
	searchResults(){
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
	},
	

});