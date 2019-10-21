Router.route('/create/group', {
	
	
	waitOn: function () {
		
		if(Meteor.user()){
			return [
			
				
				
			];
		}
		
	},

	action: function () {
		
		if (this.ready()){
			
			if(Meteor.userId()){
				this.render('createGroup');
				updateMenuUI();
			}
			
		}else{
			this.render('dataLoader');
		}
		
	}

}); 

Template.createGroup.rendered = function() {
	
	
	
};




Template.createGroup.destroyed = function() {
	
};


Template.createGroup.events({
	
	'submit #uiActionSubmitNewGroup'(event){
		
		event.preventDefault();
		//const target = event.target;
		
		if( $("input[name=newTitle]").val().length <= 3 ){
			swal({
				title: "Title too short",
				text: "Must be more than 3 characters",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Close",
			});
			return;
		}
		
		if( $("input[name=newTitle]").val().length >= 40 ){
			swal({
				title: "Title too long",
				text: "Must be less than 20 characters",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Close",
			});
			return;
		}
		
		if( $("select[name=newCategory]").val() == "" ){
			swal({
				title: "Please select a group category",
				text: "",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Close",
			});
			return;
		}
		
		if( $("input[name=groupVisibility]:checked").val() == undefined ){
			swal({
				title: "Please select group visibility",
				text: "",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Close",
			});
			return;
		}
		
		if( $("input[name=contentRating]:checked").val() == undefined ){
			swal({
				title: "Please select a content rating",
				text: "",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Close",
			});
			return;
		}
		
		
		Meteor.call('createNewGroup',
		
			$("input[name=createOrUpdate]").val(),
			$("input[name=newTitle]").val(),
			$(".newDescription").val(),
			$("input[name=ownerUsername]").val(),
			$("input[name=ownerUsername]").attr( "data-ownerType" ),
			$("select[name=newCategory]").val(),
			$("input[name=groupVisibility]").val(),
			$("input[name=contentRating]").val(),
			
			
			$("#street_number").val(),
			$("#route").val(),
			$("#locality").val(),
			$("#administrative_area_level_1").val(),
			$("#postal_code").val(),
			$("#country").val(),
			
			$("#lat").val(),
			$("#lng").val(),
			
			
			function(error, result){
				
				if(result){
					
					setTimeout(function(){
						swal({
							title: "Group created!",
							text: "",
							type: "success",
							showCancelButton: false,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "Close",
						});
						
						Router.go('/group/'+result);
					},1);
					
				}
				
			},
		);
			
		
	},
	
	'click .uiActionTicketRowCreate'(event){

		var template = $(".uiActionTickets .row").html();
		
		$(".uiActionTickets").append("<div class='row'>"+template+"</div>");
		
	},
	
	'click .uiActionTicketRowDelete'(event){
		
		
		event.preventDefault();
		const target = event.currentTarget ;
		
		$(target).parent().parent().remove();
		
	}

});

Template.createGroup.helpers({
	
	
	theUserMeta(){
		return UserMeta.find({});
	},
	
});














