
Router.route('/market', {

	waitOn: function () {
		
	},
	
	action: function () {

		if (this.ready()){
			
				this.render('market');
				updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}
	
}); 

Router.route('/market/:someJobThingy', {
	
	waitOn: function () {
		
	},
	
	action: function () {

		if (this.ready()){
			
				this.render('market');
				updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}
	
}); 




Template.market.rendered = function() {
	
};




Template.market.destroyed = function() {

};


Template.market.events({
	

});


Template.market.helpers({
	
	
	theSearch(){
		return window.theSearch;
	},
	
	searchResults(){
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
	},
	

});