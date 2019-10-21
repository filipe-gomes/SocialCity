import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

// IMPORT IMAGE COLLECTION EVERYWHERE
// ==================================
import Images from '/lib/2_images.js';
// ==================================

// ====================================
// COLLECTIONS
// ====================================

/*
dbSubscriptionNotifications = new SubsManager();
dbSubscriptionFriends = new SubsManager();
dbSubscriptionActivites = new SubsManager();
dbSubscriptionUserMeta = new SubsManager();
dbSubscriptionMyUserMeta = new SubsManager();
dbSubscriptionPosts = new SubsManager();
dbSubscriptionComments = new SubsManager();


const dbSubscriptionNotifications = new Mongo.Collection('notifications');
const dbSubscriptionFriends = new Mongo.Collection('friends');
const dbSubscriptionActivites = new Mongo.Collection('activities');
const dbSubscriptionUserMeta = new Mongo.Collection('userMeta');
//const dbSubscriptionMyUserMeta = new Mongo.Collection('counts');
const dbSubscriptionPosts = new Mongo.Collection('posts');
const dbSubscriptionComments = new Mongo.Collection('comments');
*/

// ====================================
// STARTUP / SUBSCRIPTIONS
// ====================================
Meteor.startup(function(){

	toastr.options = {
		"closeButton": true,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-center",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "15000",
		"extendedTimeOut": "0",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}

	Router.configure({
	  layoutTemplate: 'applicationLayout',
	  //notFoundTemplate: 'notFound',
	  loadingTemplate: 'dataLoader',
	});
	Router.onBeforeAction(function(){
		this.next();
	});
	Router.onAfterAction(function(){
		updateMenuUI();
	});
	Router.onStop(function(){
	});

	if(Meteor.userId()){
		///////////window.subscriptionActivites.subscribe('findUserMeta', "self");
		Meteor.subscribe("myFriends","self");
		Meteor.subscribe("findUserMeta","self");
		Meteor.subscribe("myNotifications");
	}




});


updateMenuUI = function(){




	console.log("UPDATING MENU UI ()");

	setTimeout(function(){

		// Window Username
		// ---------------
		window.theUsername = "00000000000";
		window.thePage = "00000000000";

		/*
		if(thePageUsername){

			window.theUsername = thePageUsername.split("@")[1];
			console.log("thePageUsername: " + window.theUsername);

		}else{

			window.theUsername = window.location.href.split("@")[1];
			console.log("window.theUsername 1: "+window.theUsername);

			if(window.theUsername !== undefined){
				window.theUsername = window.theUsername.split("/")[0];
				console.log("window.theUsername 2: "+window.theUsername);
				window.theSearch = window.location.href.split("@")[1].split("/")[2];
			}else{
				console.log("window.theUsername 2: undefined");
				if(Meteor.user()){
					window.theUsername = Meteor.user().username;
					console.log("window.theUsername 3: "+window.theUsername);
				}else{
					// location.reload();
					// DOESNT WORK ON PRODUCTION
				}
			}
			// console.log("window.theUsername 4: "4+window.theUsername);

		}
		*/

		// Window Page
		// -----------
		var first = $(location).attr('pathname');
		first.indexOf(1);
		first.toLowerCase();
		first = first.split("/")[1];
		window.thePage = first;

		if(window.thePage === undefined){
			window.thePage = "social";
		}

		$('body').addClass("shards-app-promo-page--1");

		var path = window.location.pathname;
		console.log("path:indexOf: "+path);

		$(".mainNavSocial").removeClass("btn-danger");
		$(".mainNavRides").removeClass("btn-danger");
		$(".mainNavBrowse").removeClass("btn-danger");
		$(".mainNavCalendar").removeClass("btn-danger");
		$(".mainNavActivities").removeClass("btn-danger");
		$(".mainNavGroups").removeClass("btn-danger");
		$(".mainNavPlaces").removeClass("btn-danger");
		$(".mainNavMarket").removeClass("btn-danger");
		$(".mainNavJobs").removeClass("btn-danger");

		$(".mainNavSocial").removeClass("btn-secondary");
		$(".mainNavRides").removeClass("btn-secondary");
		$(".mainNavBrowse").removeClass("btn-secondary");
		$(".mainNavCalendar").removeClass("btn-secondary");
		$(".mainNavActivities").removeClass("btn-secondary");
		$(".mainNavGroups").removeClass("btn-secondary");
		$(".mainNavPlaces").removeClass("btn-secondary");
		$(".mainNavMarket").removeClass("btn-secondary");
		$(".mainNavJobs").removeClass("btn-secondary");

		$(".mainNavSocial i").removeClass("text-white");
		$(".mainNavRides i").removeClass("text-white");
		$(".mainNavBrowse i").removeClass("text-white");
		$(".mainNavCalendar i").removeClass("text-white");
		$(".mainNavActivities i").removeClass("text-white");
		$(".mainNavGroups i").removeClass("text-white");
		$(".mainNavPlaces i").removeClass("text-white");
		$(".mainNavMarket i").removeClass("text-white");
		$(".mainNavJobs i").removeClass("text-white");

		$(".mainNavSocial span").removeClass("text-white");
		$(".mainNavRides span").removeClass("text-white");
		$(".mainNavBrowse span").removeClass("text-white");
		$(".mainNavCalendar span").removeClass("text-white");
		$(".mainNavActivities span").removeClass("text-white");
		$(".mainNavGroups span").removeClass("text-white");
		$(".mainNavPlaces span").removeClass("text-white");
		$(".mainNavMarket span").removeClass("text-white");
		$(".mainNavJobs span").removeClass("text-white");

		$(".mainNavSocial").addClass("btn-outline-danger");
		$(".mainNavRides").addClass("btn-outline-danger");
		$(".mainNavBrowse").addClass("btn-outline-danger");
		$(".mainNavCalendar").addClass("btn-outline-danger");
		$(".mainNavActivities").addClass("btn-outline-danger");
		$(".mainNavGroups").addClass("btn-outline-danger");
		$(".mainNavPlaces").addClass("btn-outline-danger");
		$(".mainNavMarket").addClass("btn-outline-danger");
		$(".mainNavJobs").addClass("btn-outline-danger");

		if(path == "/s"){
			$(".mainNavSocial").removeClass("btn-outline-danger");
			$(".mainNavSocial").addClass("btn-danger");
			$(".mainNavSocial .fa").addClass("text-white");
			$(".mainNavSocial span").addClass("text-white");
		}

		if(path == "/browse"){
			$(".mainNavBrowse").removeClass("btn-outline-danger");
			$(".mainNavBrowse").addClass("btn-danger");
			$(".mainNavBrowse .fas").addClass("text-white");
			$(".mainNavBrowse span").addClass("text-white");
		}

		if(path == "/calendar"){
			$(".mainNavCalendar").removeClass("btn-outline-danger");
			$(".mainNavCalendar").addClass("btn-danger");
			$(".mainNavCalendar .far").addClass("text-white");
			$(".mainNavCalendar span").addClass("text-white");
		}

		if(path == "/activities"){
			$(".mainNavActivities").removeClass("btn-outline-danger");
			$(".mainNavActivities").addClass("btn-danger");
			$(".mainNavActivities .fa").addClass("text-white");
			$(".mainNavActivities span").addClass("text-white");
		}

		if(path == "/groups"){
			$(".mainNavGroups").removeClass("btn-outline-danger");
			$(".mainNavGroups").addClass("btn-danger");
			$(".mainNavGroups .fa").addClass("text-white");
			$(".mainNavGroups span").addClass("text-white");
		}

		if(path == "/places"){
			$(".mainNavPlaces").removeClass("btn-outline-danger");
			$(".mainNavPlaces").addClass("btn-danger");
			$(".mainNavPlaces .fa").addClass("text-white");
			$(".mainNavPlaces span").addClass("text-white");
		}

		if(path == "/market"){
			$(".mainNavMarket").removeClass("btn-outline-danger");
			$(".mainNavMarket").addClass("btn-danger");
			$(".mainNavMarket .fa").addClass("text-white");
			$(".mainNavMarket span").addClass("text-white");
		}
		if(path == "/jobs"){
			$(".mainNavJobs").removeClass("btn-outline-danger");
			$(".mainNavJobs").addClass("btn-danger");
			$(".mainNavJobs .fa").addClass("text-white");
			$(".mainNavJobs span").addClass("text-white");
		}

		if(path == "/rides"){
			$(".mainNavRides").removeClass("btn-outline-danger");
			$(".mainNavRides").addClass("btn-danger");
			$(".mainNavRides .fa").addClass("text-white");
			$(".mainNavRides span").addClass("text-white");
		}
		//window.scrollTo({ top: 0, behavior: 'smooth' });
		//window.scrollTo(0, 0);

		$('.modal').modal('hide');

		setTimeout(function(){

			$('#searchModal').on('shown.bs.modal', function() {
				$('.searchBarInput').focus();
			});

		},5000);


	},1);



	/*
	setInterval(function(){

		// FOCUS

		// Currently Visible
		if( ifvisible.now() ){
			//location.reload();
		}

		// Tab IN
		ifvisible.on("focus", function(){

			// CHECK TO SEE IF CONNECTION HAS BEEN A FEW MINUTES
			//location.reload();

		});

		// Tab OUT
		ifvisible.on("blur", function(){
			//location.reload();
		});

	},100);

	*/


	/*
	$('.combobox').combobox();
	*/

	$(document).ready(function() {
		setTimeout(function(){

			if(window.toolboxLoaded == false){

				$('.datepicker').datepicker({
					multidate: true,
				});

				$('.timepicker').timepicker({
					timeFormat: 'h:mm p',
					interval: 15,
					minTime: '0',
					maxTime: '23:59pm',
					defaultTime: '12:00am',
					startTime: '0:00',
					dynamic: false,
					dropdown: true,
					scrollbar: true
				});

				// Summernote must be wrapped because it has stupid rendering issues.
				setInterval(function(){
					$('.summernote').summernote({
						height: 300,
						tabsize: 2,
						tooltip: false,
						styleTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
						toolbar: [
							// [groupName, [list of button]]
							['style', ['style']],
							['style', ['bold', 'italic', 'underline']],
							['para', ['ul', 'ol', 'paragraph']],
							['picture', ['picture']],
						  ],
						hint: {
							mentions: ['jayden', 'sam', 'alvin', 'david'],
							match: /\B@(\w*)$/,
							search: function (keyword, callback) {
							  callback($.grep(this.mentions, function (item) {
								return item.indexOf(keyword) == 0;
							  }));
							},
							content: function (item) {
							  return '@' + item;
							}
						},

						callbacks: {
							onImageUpload: function(files) {

								/*
								$('.summernote').summernote('insertImage', "//"+Meteor.settings.public.cdnPath+"/default/imageLoader.svg", function ($image) {
								  $image.css('width', "100%");
								  $image.addClass('summernoteUploadedImageTemp');
								});
								*/

								url = $(this).data('upload'); //path is defined as data attribute for  textarea
								sendFile(files[0], url, $(this));
							}
						}

					});
				},1000);



				$('.tags').tagsInput();
				$(".hashtags").hashtags();



				$("body").bind("paste", function(e){
					// access the clipboard using the api


					window.pastedData = e.originalEvent.clipboardData.getData('text/html');
					//console.log( Meteor.ServerTools.TagStrip(window.pastedData) );

					$(".summernote").summernote("code", "" );
					setTimeout(function(){

						//alert(pastedData);
						//$(".summernote").summernote("code", pastedData );

						//e.preventDefault();

						//var currentSummernote = $(".note-editable").html();
						//console.log("PASTED");
						//console.log(currentSummernote);
						//setTimeout(function(){
							//$(".note-editable").html("");
						//},5000);
						//console.log(Meteor.ServerTools.TagStrip(currentSummernote));

						$(".summernote").summernote("code", Meteor.ServerTools.TagStrip(window.pastedData) );
						//$(".summernote").summernote("code", e.originalEvent.clipboardData.getData('text/html') );
					},100);


				} );


				window.toolboxLoaded = true;
			}else{
				//alert("Toolbox error");
			}

			// Image uploader styling
			$('.uploader').on('dragenter', function() {
				$('.uploaderMessage').addClass('dragover');
			});

			$('.uploader').on('dragleave', function() {
				$('.uploaderMessage').removeClass('dragover');
			});


		},200);



		setInterval(function(){

			// Expand Summernote to inner height
			if( $(".note-editable").is(":visible") ){

				// Expand summer note to match long content
				if($(".note-editable").hasScrollBar().vertical){
					$(".note-editable").css( "height", $(".note-editable")[0].scrollHeight+"px" );
				}

				if( !$(".note-editable").hasClass("summernoteHackFix") ){

					setTimeout(function(){

						window.scrollTo(0,1+Math.random());
						window.scrollTo(0,1+Math.random()+1);
						window.scrollTo(0,1+Math.random()+2);

						$(".note-editable").addClass("summernoteHackFix");

					},1000);

				}


			}
			if( !$(".blueimp-gallery").is(":visible") ){
				$("body").removeAttr("style");
				//$("body").css( "overflow-x", "hidden");
			}

		},100);



		function sendFile(file, url, editor){

			var filename = file.name.replace('.', '');

			const upload = Images.insert({
				file: file,
				streams: 'dynamic',
				chunkSize: 'dynamic',
				meta: {
					mediaType: "posts",
				}
			}, false);

			console.log(file);

			upload.on('start', function() {
				//template.coverPhotoUpload.scset(this);

				$('.note-editable').append("<img src='//"+Meteor.settings.public.cdnPath+"/default/imageLoader.svg' class='summernoteTempPhoto-"+filename+"' style='width:100%;'/>");
				toastr.success('Uploading Photo', '');

			});

			upload.on('end', function(error, fileObj) {
				if (error) {
					alert('Error during upload: ' + error);
				} else {

					var theUserMeta = UserMeta.findOne({ meteorUserId:Meteor.userId() });

					setTimeout(function(){

						$(".summernoteTempPhoto-"+filename).remove();
						$('.note-editable').append("<img src='//"+Meteor.settings.public.cdnPath+"/users/"+Meteor.userId()+"/posts/"+theUserMeta.tempPost+"/large-"+fileObj._id+".jpg"+"' onerror='imageError(this);' style='width:100%;'/>");

					},10);

				}
			});

			setTimeout(function(){
				upload.start();
			},2000);


		}

		// This is required for when an image loads correctly, but needs to be checked
		// Different from when the image is simply broken.
		setInterval(function(){
			$(".imageRechecker").each(function( index, value ){
				console.log(value);
			});
		},1000);


	});
	$(".modal-backdrop").remove();



}



// Triggers when the image DOM is broken
imageError = function(theImage){

	$(theImage).addClass("imageRecheck");

	if( !$(theImage).attr("data-recheckUrl") ){
		$(theImage).attr('data-recheckUrl', theImage.src);
	}

	var theLoopCount = 0;
	var theLoop = setInterval(function(){

		theLoopCount++;
		//console.log("rechecking: " + $(theImage).attr("data-recheckUrl"));

		if(theLoopCount >= 8){
			clearInterval(theLoop);
			console.log("Couldn't find the image, giving up!");
		}

		$.ajax({
			type: "HEAD",
			async: true,
			url:  $(theImage).attr("data-recheckUrl"),
		}).done(function(message,text,jqXHR){
			theImage.src =  $(theImage).attr("data-recheckUrl");
			clearInterval(theLoop);
		});
	},3000);

	theImage.src = "//"+Meteor.settings.public.cdnPath+"/default/imageLoader.svg";
    return true;

}




/**
 * Detect the current active responsive breakpoint in Bootstrap
 * @returns {string}
 * @author farside {@link https://stackoverflow.com/users/4354249/farside}
 */
getResponsiveBreakpoint = function() {
    var envs = {xs:"d-none", sm:"d-sm-none", md:"d-md-none", lg:"d-lg-none", xl:"d-xl-none"};
    var env = "";

    var $el = $("<div>");
    $el.appendTo($("body"));

    for (var i = Object.keys(envs).length - 1; i >= 0; i--) {
        env = Object.keys(envs)[i];
        $el.addClass(envs[env]);
        if ($el.is(":hidden")) {
            break; // env detected
        }
    }
    $el.remove();
    return env;
};


timeAgo = function(){
	console.log("XXXXXXXXXXX timeAgo was called!");
};



Template.navigation.events({

	"click .navigationOpenMobileModal"(event){
		alert("OPEN");
		$("#menuModal").modal("show");
	},


	"click #search button.close"(event){
		$('#search').css('display','none');
	},

	"submit .searchBar"(event){

		event.preventDefault();
		const target = event.target;

		var theUsername = "guest";
		if( Meteor.userId() ){
			theUsername = Meteor.user().username;
		}

		Router.go("/p/"+ $(".searchBarInput").val() );
		$('#search').removeClass('open');

	},


	"click .uiActionFriendshipReply"(event){

		const target = event.target;
		console.log($(event.currentTarget).attr("data-notificationId")+":"+$(event.currentTarget).attr("data-response"));

	},


	"click .uiActionRequestFriendOrFollow"(event){
		//alert($(event.currentTarget).attr("data-action"));
		var status = Meteor.apply("requestFriendOrFollow", [$(event.currentTarget).attr("data-action"), $(event.currentTarget).attr("data-userId")], true, function(error,result){

			if(result == "friendAccept"){

				swal({
					title: "You are now friends",
					text: "",
					type: "success",
					showCancelButton: false,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Close",
				});

			}

		},{ returnStubValue: true });

	},


});

Template.navigation.helpers({

	myNotifications(){

		return Notifications.find({}, {sort: { timeUpdated: -1 }});

	},

	notificationType(theType){

		var thisNotification = Notifications.findOne({ _id:this._id });
		if(thisNotification.type == theType){
			return true;
		}
		return false;

	},

	notificationDirection(theDirection){

		var thisNotification = Notifications.findOne({ _id:this._id });
		if(thisNotification.direction == theDirection){
			return true;
		}
		return false;

	},

	notificationStatus(theStatus){

		var thisNotification = Notifications.findOne({ _id:this._id });
		if(thisNotification.status == theStatus){
			return true;
		}
		return false;

	},

	theNotificationStatusAlert(){

		var thisNotification = Notifications.findOne({ _id:this._id });
		if(thisNotification.read == "true"){
			return " alert-secondary";
		}
		if(thisNotification.read == "false"){
			return " alert-primary";
		}

	},



	hasNotifications() {

		var myNotifications = Notifications.find({ read:"false" });

		var count = 0;
		myNotifications.forEach(function(theNotification){
			count ++;
		});

		if(count >= 1){
			return true;
		}else{
			return false;
		}

	},



});

// =======================
//
// GLOBAL HELPERS
//
// =======================

Template.registerHelper("myUserMeta", function () {

	return UserMeta.find({ meteorUserId:Meteor.userId() });

});

Template.registerHelper("timeAgo", function (theTime) {
	return moment(theTime).fromNow();
});

Template.registerHelper("cdnPath", function () {
	return Meteor.settings.public.cdnPath;
});

Template.registerHelper("sslMode", function () {
	return checkSslMode();
});

function checkSslMode(){
	if(document.domain == "localhost"){
		return "http";
	}else{
		return "https";
	}
}


// ====================================
// GENERAL
// ====================================

Template.dataLoader.onRendered(function () {

	$(".cssload-zenith").css({'transform': 'rotate('+Math.floor(Math.random() * 180) + 1+'deg)'});

});



// ALL SCREENS RENDER (with extension)
Template.footer.onRendered(function () {

	window.toolboxLoaded = false;

	// Fixes Summernote Render issue in Modal
	$('#postModal').on('shown.bs.modal', function () {
		window.scrollTo({ top: $(".comments-container").position().top, behavior: 'smooth' });
	})

});
