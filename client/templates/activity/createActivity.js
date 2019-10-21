Router.route('/create/activity', function () {

	this.render('createActivity', {to: 'content'});

	Meteor.subscribe('activityByExplore');

	if(Meteor.user()){

		Meteor.subscribe("activityById");
		Meteor.subscribe("findGroups", "myGroups");
	}

});

Template.createActivity.rendered = function() {



		//if(this.params.query.id){

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

		//}


};




Template.createActivity.destroyed = function() {

};


Template.createActivity.events({

	'change .newRepeatFrequency'(event){

		var newValue = $(event.target).val();

		if(newValue == "once"){

			$(".uiCreateCalendar").show();
			$(".uiCreateDays").hide();

		}
		if(newValue == "weekly"){

			$(".uiCreateCalendar").hide();
			$(".uiCreateDays").show();

		}
		if(newValue == "monthly"){

			$(".uiCreateCalendar").show();
			$(".uiCreateDays").hide();

		}

	},

	'click .btnCreateNewActivity'(event){

		event.preventDefault();
		//const target = event.target;

		window.theActivityId = "0";


		// DATES
		// -----
		var theDates = [];
		$.each($(".datepicker").find("td.active"), function () {

			theDateTimestamp = $(this).attr("data-date");

			var theMoment = moment( $(this).text() +" "+ $(".datepicker-switch").html() ).format('L');
			var theSplit = theMoment.split("/");

			var amPm = $("select[name=newStartAmPm]").find(":selected").val();
			var theTimestamp = 0;

			var addHours = 0;
			var addMinutes = 0;

			if(amPm == "am"){

				addHours = $("select[name=newStartHour]").val();

				if( $("select[name=newStartHour]").val() == "12"){
					addHours = 0;
				}

			}
			if(amPm == "pm"){

				addHours = $("select[name=newStartHour]").val();

				if( $("select[name=newStartHour]").val() == "1"){
					addHours = 13;
				}
				if( $("select[name=newStartHour]").val() == "2"){
					addHours = 14;
				}
				if( $("select[name=newStartHour]").val() == "3"){
					addHours = 15;
				}
				if( $("select[name=newStartHour]").val() == "4"){
					addHours = 16;
				}
				if( $("select[name=newStartHour]").val() == "5"){
					addHours = 17;
				}
				if( $("select[name=newStartHour]").val() == "7"){
					addHours = 18;
				}
				if( $("select[name=newStartHour]").val() == "8"){
					addHours = 19;
				}
				if( $("select[name=newStartHour]").val() == "9"){
					addHours = 20;
				}
				if( $("select[name=newStartHour]").val() == "10"){
					addHours = 21;
				}
				if( $("select[name=newStartHour]").val() == "11"){
					addHours = 22;
				}
				if( $("select[name=newStartHour]").val() == "12"){
					addHours = 23;
				}


			}

			addMinutes = $("select[name=newStartMinute]").find(":selected").val();

			//console.log("ADDING HOURS: " + addHours);
			//console.log("ADDING MINUTES: " + addMinutes);

			theTimestamp = moment( $(this).text() +" "+ $(".datepicker-switch").html() ).add(addHours,"hours").add(addMinutes,"minutes").unix();
			//console.log("THE TIMESTAMP: " + theTimestamp);

			theDates.push({

				timestampCalendar: theDateTimestamp,
				timestampEvent: theTimestamp,
				month:theSplit[0],
				day:theSplit[1],
				year:theSplit[2],

			});

		});
		console.log(theDates);

		// TICKETS
		// -----
		//var theTickets = $(".uiActionTickets input").serializeArray();
		var theTickets = [];
		$.each($(".uiActionTickets .row"), function () {

			theTickets.push({
				name:$(this).find(".ticketName").val(),
				quantity:$(this).find(".ticketQuantity").val(),
				quantityRemaining:$(this).find(".ticketQuantity").val(),
				price:$(this).find(".ticketPrice").val(),
			});

		});
		console.log(theTickets);


		Meteor.call('createNewActivity',

			window.theActivityId,

			$("input[name=organizer]").val(),
			$("input[name=organizer]:checked").attr("data-organizerType"),
			$("input[name=organizer]:checked").attr("data-id"),

			$("input[name=newTitle]").val(),
			$("input[name=newShortDescription]").val(),
			$('.note-editable').html(),
			$("input[name=tags]").val(),

			$("input[name=newActivityUrl]").val(),

			$("#geoAddress").val(),
			$("#street_number").val(),
			$("#route").val(),
			$("#locality").val(),
			$("#administrative_area_level_1").val(),
			$("#postal_code").val(),
			$("#country").val(),

			$("select[name=newStartHour]").find(":selected").val(),
			$("select[name=newStartMinute]").find(":selected").val(),
			$("select[name=newStartAmPm]").find(":selected").val(),

			$("select[name=newEndHour]").find(":selected").val(),
			$("select[name=newEndMinute]").find(":selected").val(),
			$("select[name=newEndAmPm]").find(":selected").val(),

			theDates,

			theTickets,

			$("input[name=newAgeRestriction]").val(),

			function(error, result){

				if(result){

					setTimeout(function(){
						swal({
							title: "Created: "+$("input[name=newTitle]").val(),
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

	'click .uiActionTicketCreateFree'(event){

		var template = $(".uiActionTicketsFreeTemplate .row").html();

		$(".uiActionTickets").append("<div class='row'>"+template+"</div>");

	},

	'click .uiActionTicketCreatPaid'(event){

		var template = $(".uiActionTicketsPaidTemplate .row").html();

		$(".uiActionTickets").append("<div class='row'>"+template+"</div>");

	},

	'click .uiActionTicketRowDelete'(event){


		event.preventDefault();
		const target = event.currentTarget ;

		$(target).parent().parent().remove();

	}

});

Template.createActivity.helpers({

	myGroups(){

		return Groups.find({}, {sort: { title: 1 }});

	},

});
