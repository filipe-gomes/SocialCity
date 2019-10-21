Router.route('/register', function () {

	this.render('register', {to: 'content'});

});



Template.register.rendered = function() {

	Ladda.bind( '.ladda-button' );

};

Template.register.events({

    'click .uiActionRegisterButton': function(event){

        event.preventDefault();
		setTimeout(function(){
			Ladda.stopAll();
		},1000);

		// REGISTRATION VALIDATION


		// First Name
		if( $('[name=nameFirst]').val().length < 2 ){

			swal({
				title: "First Name?",
				text: "Your first name is really short...",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}

		// Last Name
		if( $('[name=nameLast]').val().length < 2 ){

			swal({
				title: "Last Name?",
				text: "Your last name is really short...",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}

		// Email
		if( $('[name=email]').val().length < 2 ){

			swal({
				title: "Email Invalid",
				text: "Please check your email address",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}


		// Password too short
		if( $('[name=password]').val() != $('[name=password_repeat]').val() ){

			swal({
				title: "Your password didn't match",
				text: "Please re-type your password, it didn't match",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}

		// Password too long
		if( $('[name=password]').val().length >= 30 ){

			swal({
				title: "Password too long",
				text: "Please shorten your password, must be less than 30 characters",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}

		// Password too short
		if( $('[name=password]').val().length <= 6 ){

			swal({
				title: "Password is Too Short",
				text: "Please choose a longer user name, 6 characters or more",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}

		// Search for existing users
		var user_found = Meteor.users.findOne({"profile.email":$('[name=email]').val()});

		if(user_found){

			swal({
				title: "This email address is already registered",
				text: "Please try another, or click Forgot Password",
				type: "error"
			});
			Ladda.stopAll();
			return;
		}

		// Call this now, because we've been a guest user
		Meteor.logout();

		var random_id = Math.floor(Math.random() * 3000) + 1;
		//var companyId = Math.floor(Math.random()*1000000) + 1; //This has moved to server side

		Accounts.createUser({
			email: $('[name=email]').val(),
			password: $('[name=password]').val(),
			profile: {
				nameFirst:  $('[name=nameFirst]').val(),
				nameLast:  $('[name=nameLast]').val(),
				username:  ($('[name=nameFirst]').val()+$('[name=nameLast]').val()+random_id).toLowerCase(),
			},
			username:  $('[name=nameFirst]').val()+$('[name=nameLast]').val()+random_id, // Must be doubled here, sadly, for the Guest Account logic. Cleanup one day...
		}, function(error){
			if(error){

				swal({
					title: error.reason,
					text: "",
					type: "error"
				});
				Ladda.stopAll();

			} else {

				Ladda.stopAll();
				Router.go("/"); // Redirect user if registration succeeds
				//setTimeout(function(){
					//window.location.reload();
				//},3000);

			}
		});

    }
});
