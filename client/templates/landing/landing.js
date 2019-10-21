Router.route('/', function () {

		Router.current().layout("applicationLayoutEmpty");
		this.render('landing', {to: 'content'});

		if(Meteor.userId()){
			Router.go("/s");
		}


});


Template.landing.rendered = function() {
	//$('body').addClass("shards-app-promo-page--1");

	//ga('send', 'event', "view", "landing");

};

Template.landing.destroyed = function() {

};


Template.landing.events({



});
