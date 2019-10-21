Router.route('/places', {
	
	waitOn: function () {
		
	},
	
	action: function () {

		if (this.ready()){
			
				this.render('places');
				updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}
		
	

}); 



Template.places.rendered = function() {
	
};




Template.places.destroyed = function() {

};


Template.places.events({
	

});


Template.places.helpers({
	
	
	theSearch(){
		return window.theSearch;
	},
	
	searchResults(){
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
	},
	

});