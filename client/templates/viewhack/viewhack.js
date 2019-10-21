Router.route('/v/:contextType', function () {

	this.render('viewhack', {to: 'content'});

});

Router.route('/v/:contextType/:contextReference', function () {

	this.render('viewhack', {to: 'content'});

});

Template.viewhack.rendered = function() {

	//alert(Router.current().params.contextType);
	//alert(Router.current().params.contextReference);

	if(Router.current().params.contextType == "social" && Router.current().params.contextReference){
		Router.go("/s/"+Router.current().params.contextReference);
	}

	if(Router.current().params.contextType == "social" && !Router.current().params.contextReference ){
		Router.go("/s");
	}

};