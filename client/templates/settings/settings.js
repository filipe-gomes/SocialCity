Router.route('/settings', function () {

	this.render('settings', {to: 'content'});

});

Router.route('/settings/:theUsername', function () {

	this.render('settings', {to: 'content'});
});



Template.settings.rendered = function() {

};




Template.settings.destroyed = function() {

};


Template.settings.events({

	'click .setChatBubbleColor'(event){

		Meteor.call("setMessageRowColor", $(event.currentTarget).attr("data-color") );

	},


});


Template.settings.helpers({


	theSearch(){
		return window.theSearch;
	},

	searchResults(){
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
	},

	isSelectedColor(checkColor){

		if(Meteor.user()){
			var theUserMeta = UserMeta.findOne({ meteorUserId: Meteor.userId() });

			if(theUserMeta.messageRowColor == checkColor){
				return true;
			}
		}

		return false;

	},


});
