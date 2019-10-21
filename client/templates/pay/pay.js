Router.route('/pay', function () {

	Router.go("/social");

});

Router.route('/pay/:theUsername', function () {

	this.render('pay', {to: 'content'});

	if(Meteor.user()){
		Meteor.subscribe('fetchUserMetaByUsername', Router.current().params.theUsername.split("@")[1] );
	}

});

Template.pay.rendered = function() {

};

Template.pay.destroyed = function() {

};


Template.pay.events({


});


Template.pay.helpers({


	theUser(){
		return UserMeta.findOne({username:Router.current().params.theUsername.split("@")[1]});
	},

});
