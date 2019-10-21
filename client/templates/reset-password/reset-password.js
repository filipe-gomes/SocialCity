Router.route('/reset-password/:theToken', {

	waitOn: function () {
		
		
	},
	
	action: function () {
		
		if (this.ready()){
			this.render('reset-password');
		}else{
			this.render('dataLoader');
		}
		
	}
	
		
}); 


Template.resetPassword.rendered = function() {
	
	Ladda.bind( '.ladda-button' );
}


Template.resetPassword.events({
	
	'click .uiActionResetPassword'(event){
		
        event.preventDefault();
		setTimeout(function(){
			Ladda.stopAll();
		},1000);
		
		//$(".login-container button").prop('disabled', true);
		
		Accounts.resetPassword(Router.current().params.theToken, $("#newPassword").val(), function(error){
			
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
				window.changedForgotPassword = true;
				Router.go("/login");
			}
			
		});
    }
});


