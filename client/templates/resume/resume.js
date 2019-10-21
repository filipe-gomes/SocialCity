Router.route('/resume', {


	waitOn: function () {
		
	},
	
	action: function () {

		if (this.ready()){
			
				this.render('resume');
				updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}
	

}); 

Router.route('/resume/:theUsername', {


	waitOn: function () {
		
	},
	
	action: function () {

		if (this.ready()){
			
				this.render('resume');
				updateMenuUI();
			
		}else{
			this.render('dataLoader');
		}
		
	}
	

}); 

Template.resume.rendered = function() {
	
};




Template.resume.destroyed = function() {

};


Template.resume.events({
	

});


Template.resume.helpers({
	
	

});