Router.route('/group', {
	
	waitOn: function () {
		
	},
	
	action: function () {

		Router.go("/groups");
		
	}

}); 

Router.route('/group/:theGroupUrl', {
	
	
	waitOn: function () {
		
		
		return [
			Meteor.subscribe('findGroupByUrl', Router.current().params.theGroupUrl),
			Meteor.subscribe('findPosts', Router.current().params.theGroupUrl, "groupPostsPrivateByUrl"),
		]
		
	},
	
	action: function () {

		if (this.ready()){
			
				this.render('group');
				updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}

}); 

Template.group.rendered = function() {
	
};




Template.group.destroyed = function() {

};


Template.group.events({
	

});


Template.group.helpers({
	
	groups(){
		return Groups.find({});
	},
	
	theSearch(){
		return window.theSearch;
	},
	
	searchResults(){
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
	},
	

});