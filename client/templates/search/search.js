Router.route('/search', function () {

	Router.go('/');


});

Router.route('/search/:theSearchDetails', function () {

	this.render('search', {to: 'content'});

	Meteor.subscribe('searchUserMeta', this.params.theSearchDetails);

});


Template.search.rendered = function() {
	//alert(window.theSearch);
	$("#searchModal").modal('hide');
};




Template.search.destroyed = function() {

};


Template.search.events({


});


Template.search.helpers({


	theSearch(){
		return window.theSearch;
	},

	searchResults(){
		return UserMeta.find({meteorUserId:{$ne:Meteor.userId()}});
	},


});
