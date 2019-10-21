Router.route('/forgot', function () {

	this.render('forgot', {to: 'content'});

	if(Meteor.userId()){
		Router.go('/');
	}


});


Template.forgot.rendered = function() {

	Ladda.bind( '.ladda-button' );
}


Template.forgot.events({

	'click .uiActionLogin'(event){

        event.preventDefault();
		setTimeout(function(){
			Ladda.stopAll();
		},1000);

		//$(".login-container button").prop('disabled', true);

		var options = {
			email: $('[name=email]').val()
		};

		// Logout of the 'guest account' first
		Meteor.logout();

        Accounts.forgotPassword(options, function(error){
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
				window.sendForgotPassword = true;
				Router.go("/login");
			}
		});
    }
});
