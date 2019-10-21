Router.route('/calendar', {
	
	waitOn: function () {
		
	},

	action: function(params) {

		
		if(Meteor.user()){
			this.render('calendar');
		}else{
			Router.go("/login");
		}
		updateMenuUI();
	},	
	
}); 




Template.calendar.rendered = function() {
	
};




Template.calendar.destroyed = function() {

};


Template.calendar.events({
	

});


Template.calendar.helpers({
	
	
	friends(){
		return Connections.find({type:"friend", status:"accepted"});
	},

});