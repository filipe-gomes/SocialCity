Router.route('/groups', {
	
	waitOn: function () {
		
		return[
			Meteor.subscribe('findGroups', 'myGroups')
		]
		
	},
	
	action: function () {

		if (this.ready()){
				
			console.log("RENDER: groups");
			this.render('groups');
			updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}

}); 

Router.route('/groups/:theThing', {
	
	
	waitOn: function () {
		
	},
	
	action: function () {

		if (this.ready()){
			
				this.render('groups');
				updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}

}); 

Template.groups.rendered = function() {
	
};




Template.groups.destroyed = function() {

};


Template.groups.events({
	

});


Template.groups.helpers({
	
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