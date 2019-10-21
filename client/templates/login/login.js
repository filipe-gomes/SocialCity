Router.route('/login', function () {

	this.render('login', {to: 'content'});

			if(Meteor.userId()){
				Router.go('/');
			}

});


Template.login.rendered = function() {

	Ladda.bind( '.ladda-button' );

	if( window.sendForgotPassword ){

		window.sendForgotPassword = false
		swal({
			title: "Password reset sent",
			text: "Please click the link sent to your email address.",
			type: "warning",
			showCancelButton: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
		});

	}



}


Template.login.events({

	'click .uiActionLogin'(event){

        event.preventDefault();
		setTimeout(function(){
			Ladda.stopAll();
		},1000);

		//$(".login-container button").prop('disabled', true);

        var email = $('[name=email]').val();
        var password = $('[name=password]').val();

		// Logout of the 'guest account' first
		Meteor.logout();

        Meteor.loginWithPassword(email, password, function(error){
			if(error){

				event.preventDefault();
				//$(".login-container button").prop('disabled', false);
				swal({
					title: error.reason,
					text: "",
					type: "error"
				});
				Ladda.stopAll();

			} else {
				//ga("send", "event", "user", "login");
				Router.go("/");

			}
		});
    }
});
