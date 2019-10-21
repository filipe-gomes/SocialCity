Router.route('/post', {

	waitOn: function () {


	},

	action: function () {
		if (this.ready()){
			Router.go("/social");
		}
	},


});


Router.route('/post/:thePostId', {

	waitOn: function () {

		if(Meteor.userId()){

			return [
				Meteor.subscribe('findPosts', this.params.thePostId, "postSingle"),
				Meteor.subscribe("findUserMeta", this.params.thePostId),
				Meteor.subscribe("findPhotosProfile", this.params.thePostId),
				Meteor.subscribe("findPhotosCover", this.params.thePostId),
			];

		}else{

			Router.go("/login");


			return [
				Meteor.subscribe('findPosts', this.params.thePostId, "postSingle"),
				Meteor.subscribe("findUserMeta", this.params.thePostId),
				Meteor.subscribe("findPhotosProfile", this.params.thePostId),
				Meteor.subscribe("findPhotosCover", this.params.thePostId),
			];

		}

	},

	action: function () {
		if (this.ready()){
			this.render('post');
			updateMenuUI();
		}else{
			this.render('dataLoader');
		}
	},

});

Template.post.rendered = function() {

	window.YouDoerPostType = "social";


	if( window.changedForgotPassword ){

		window.changedForgotPassword = false
		swal({
			title: "Password has been changed!",
			text: "",
			type: "success",
			showCancelButton: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
		});

	}

};
