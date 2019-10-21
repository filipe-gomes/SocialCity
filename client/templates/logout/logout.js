
Router.route('/logout', {

	waitOn: function () {
		
		
	},
	
	action: function () {
		
		if (this.ready()){
			
			Meteor.logout();
			
			if(Meteor.userId()){
				
			}else{
				Router.go('/');
			}
			
		}else{
			this.render('dataLoader');
		}
		
	}
	
		
}); 



Template.logout.rendered = function() {
	
}


Template.logout.events({
	
});


