Router.route('/create/ride', {
	
	
	waitOn: function () {
		
		if(Meteor.user()){
			return [
			
				Meteor.subscribe('activityById')
				
			];
		}
		
	},

	action: function () {
		
		if (this.ready()){
			
			if(Meteor.userId()){
				this.render('createRide');
				updateMenuUI();
			}
			
		}else{
			this.render('dataLoader');
		}
		
	}

}); 

Template.createRide.rendered = function() {
	
		
		
		if(this.params.query.id){
			
			/*
			window.theActivityId = this.params.query.id;
			window.createOrUpdate = "Updated";
			
			subscriptionActivites.subscribe('activityById', window.theActivityId);
			
			var theActivity = Activities.findOne({_id:window.theActivityId});
			
			setTimeout(function(){
				
				$( "input[name='newTitle']" ).val( theActivity.title );
				$( ".note-editable" ).html( theActivity.description );
				$( "input[name='newAddress']" ).val( theActivity.address );
				$( "select[name='newCategory']" ).val( theActivity.category );
				
				theActivity.dates.forEach(function(theDate){
					var theSplit = theDate.split("/");
				
					 $.each($(".datepicker").find("td"), function () {                              
						if($(this).text()==theSplit[1]){
							$(this).trigger("click");
						}
						if("0"+$(this).text()==theSplit[1]){
							$(this).trigger("click");
						}
					 });
				});
				
				$( "input[name='newStartTime']" ).val( theActivity.startTime );
				$( "input[name='newEndTime']" ).val( theActivity.endTime );
				
				$( "input[name='newCost']" ).val( theActivity.cost );
				
				$('input:radio[name=newCostAmount]').filter('[value="'+theActivity.costAmount+'"]').prop('checked', true);
				$('input:radio[name=newMembership]').filter('[value="'+theActivity.membership+'"]').prop('checked', true);
				$('input:radio[name=newAgeRestriction]').filter('[value="'+theActivity.ageRestriction+'"]').prop('checked', true);
				
				
			},1000);
			*/
			
		}
		
	
};




Template.createRide.destroyed = function() {
	
};


Template.createRide.events({
	
	'submit #btnCreateNewActivity'(event){
		
		event.preventDefault();
		const target = event.target;
		
		var theDates = [];
		$.each($(".datepicker").find("td.active"), function () {
			theDates.push(  moment( $(this).text() +" "+ $(".datepicker-switch").html() ).format('L') );
		});
		
		Meteor.call('createNewActivity',
			window.theActivityId,
			target.newTitle.value,
			$('.note-editable').html(),
			target.newAddress.value,
			target.newCategory.value,
			theDates,
			target.newStartTime.value,
			target.newEndTime.value,
			target.newCost.value,
			target.newCostType.value,
			target.newMembership.value,
			target.newAgeRestriction.value,
			
			function(error, result){
				
				if(result){
					
					setTimeout(function(){
						swal({
							title: "Activity "+window.createOrUpdate,
							text: "",
							type: "success",
							showCancelButton: false,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "Close",
						});
						
						Router.go('/activity/'+result);
					},1000);
					
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

Template.createRide.helpers({
	
});














