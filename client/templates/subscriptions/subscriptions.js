Router.route('/subscriptions', function () {

	this.render('subscriptions', {to: 'content'});

});


Template.subscriptions.rendered = function() {

};




Template.subscriptions.destroyed = function() {

};


Template.subscriptions.events({

	'click .uiActionUnfollowCheck'(event){

		window.theDataTopic = $(event.currentTarget).attr("data-topic");

		swal({
		  title: 'Unfollow '+window.theDataTopic+'?',
		  text: "",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#d33',
		  cancelButtonColor: '#3085d6',
		  confirmButtonText: 'Unfollow'
		}).then((result) => {

			Meteor.call("unsubscribeTopic", window.theDataTopic);

			swal(
				window.theDataTopic,
				'You will no longer see posts from '+ window.theDataTopic,
				'error'
			)

		});

	},



});


Template.subscriptions.helpers({

	subscriptions(){
		var theUserMeta = UserMeta.findOne({});

		return theUserMeta.topics.sort(function (a, b) {
		    return a.toLowerCase().localeCompare(b.toLowerCase()); // sorts alphabetically ignoring case
		});
	},

});
