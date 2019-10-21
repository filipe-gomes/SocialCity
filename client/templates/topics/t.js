Router.route('/t', function () {

	this.render('t', {to: 'content'});

	//Meteor.subscribe('findPosts', "", "myBrowse");
	window.infinityLoadOne = null;
	window.infinityLoadTwo = "myBrowse";
	window.infintyLoadPostType = "t";
	window.infintyLoadPostTopic = null;
	window.infintyLoadPostTitle = null;
	
});


Router.route('/t/:theTopic', function () {

    Meteor.subscribe('findTopic', Router.current().params.theTopic );
    //Meteor.subscribe('findPosts', Router.current().params.theTopic, "topicBrowse");
	window.infinityLoadOne = null;
	window.infinityLoadTwo = "topicBrowse";
	window.infintyLoadPostType = "t";
	window.infintyLoadPostTopic = Router.current().params.theTopic;
	window.infintyLoadPostTitle = null;

	this.render('wall', {to: 'content'});

});


Router.route('/t/:theTopic/:theTitleUrl', function () {

    //Meteor.subscribe('findPosts', Router.current().params.theTopic, "singleBrowse", Router.current().params.theTitleUrl);
	window.infinityLoadOne = Router.current().params.theTopic;
	window.infinityLoadTwo = "singleBrowse";
	window.infintyLoadPostType = "t";
	window.infintyLoadPostTopic = Router.current().params.theTopic;
	window.infintyLoadPostTitle = Router.current().params.theTitleUrl;

	this.render('wall', {to: 'content'});

});

Template.t.rendered = function() {

	window.YouDoerPostType = "t";

};


Template.t.destroyed = function() {

};


Template.t.events({


});


Template.t.helpers({


	theSearch(){
		return window.theSearch;
	},

	searchResults(){
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
	},


});
