Router.route('/s', function () {

	this.render('social', {to: 'content'});

    if( !Meteor.userId() ){
        Router.go("/");
    }

	window.contextType = "social";
	window.contextUser = "myself";
	window.contextId = "";

	//Meteor.subscribe('findPosts', Meteor.user().username, "myProfile", Session.get("itemsLimit") );
	if(Meteor.user() && Meteor.user().username){
		Meteor.subscribe("findUserMeta", Meteor.user().username);
		Meteor.subscribe("findPhotosProfile", Meteor.user().username);
		Meteor.subscribe("findPhotosCover", Meteor.user().username);
	}


});


Router.route('/s/:theUsername', function () {

	this.render('social', {to: 'content'});

	window.contextType = "social";
	window.contextUser = "user";
	window.contextReference = "";

	if( Meteor.user() ){

		console.log("VIEW SOCIAL WALL");

		if( Meteor.user().username == Router.current().params.theUsername ){

			console.log("WALL CASE 1");

			// Meteor.subscribe('findPosts', Router.current().params.theUsername.split("@")[1], "myself");
			window.contextReference = Router.current().params.theUsername;

			Meteor.subscribe("findUserMeta", Router.current().params.theUsername);
			Meteor.subscribe("findPhotosProfile", Router.current().params.theUsername);
			Meteor.subscribe("findPhotosCover", Router.current().params.theUsername);

		}else{

			console.log("WALL CASE 2");

			// Meteor.subscribe('findPosts', Router.current().params.theUsername.split("@")[1], "another");
			window.contextReference = Router.current().params.theUsername;

			Meteor.subscribe("findUserMeta", Router.current().params.theUsername);
			Meteor.subscribe("findPhotosProfile", Router.current().params.theUsername);
			Meteor.subscribe("findPhotosCover", Router.current().params.theUsername);

		}

	}else{

		console.log("WALL CASE 3");

		// Meteor.subscribe('findPosts', Router.current().params.theUsername.split("@")[1], "another");
		window.contextReference = Router.current().params.theUsername;

		Meteor.subscribe("findUserMeta", Router.current().params.theUsername);
		Meteor.subscribe("findPhotosProfile", Router.current().params.theUsername);
		Meteor.subscribe("findPhotosCover", Router.current().params.theUsername);

	}



});

Template.social.rendered = function() {

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
