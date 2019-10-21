// IMPORT IMAGE COLLECTION EVERYWHERE
// ==================================
import Images from '/lib/2_images.js';
// ==================================


Template.wall.onDestroyed(function () {

	window.infintyLoadPostTopic = null;
	window.infintyLoadPostTitle = null;
	Session.set("itemsLimit", 15); // to set the limit to 9

});



Template.wall.rendered = function() {

	console.log("RENDERING WALL");

	// SCROLL FOR MORE
	// Infintie Scroll
	Session.set("itemsLimit", 15); // to set the limit to 9


	setTimeout(function(){

		$("html, body").animate({ scrollTop: 0 }, "fast");

		window.noTrollFriend = false;

		lastScrollTop = 2;
		lastScrollTimeout = 0;

		//lastScrollTimeout = 0;
		function getTheSub(){
			// console.log("SUB: " + window.infinityLoadOne +" : " +window.infinityLoadTwo + " : " +window.infintyLoadPostTitle + " : " +Session.get("itemsLimit")); // OLD
			Meteor.subscribe('findPosts', window.contextType, window.contextUser, window.contextReference, Session.get("itemsLimit") );
		}

		setInterval(function(){
			if( Posts.find({}).count() == 0){
				//getTheSub();
			}
		},500);

		// THIS IS FOR SURE WORKING ON SCROLL EVENT
		// Need more work on slowing down the session ItemsLimit -- it can get goofy
		$(window).scroll(function(event){
		  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {

				console.log("fetch");
				var scrollTop = $(this).scrollTop();


				Session.set("itemsLimit", Session.get("itemsLimit") + 10); // when it reaches the end, add another 9 elements
				console.log("GET MORE: "+Session.get("itemsLimit"));


				if(Session.get("itemsLimit")){
					console.log("SUBSCRIBING :" + Session.get("itemsLimit"));
					getTheSub();
					//Meteor.subscribe('findPosts', window.infinityLoadOne, window.infinityLoadTwo, window.infintyLoadPostTitle, Session.get("itemsLimit") );
				}

				lastScrollTimeout = 1;

				setTimeout(function(){
				  lastScrollTimeout = 0;
			  	},500);



				lastScrollTop = scrollTop;

			}else{

				// CHECKS LIKE A MILLION TIMES
				// CHECKS LIKE A MILLION TIMES
				// CHECKS LIKE A MILLION TIMES
				// CHECKS LIKE A MILLION TIMES
				
				console.log("nofetch");

			}

		});

		// setTimeout(function(){
			// $( ".contentMaxHeightWrapper" ).each(function( index ) {

				// var theHeight =  $(this).height();
				// if(theHeight > 800){

					// $(this).css("max-height","800px");
					// $(this).css("overflow-y","hidden");
					// $(this).parent().find(".uiActionExpandContent").show();

				// }

			// });
		// },1000);

		getTheSub();

	},100);

};


Template.wall.created = function(){

	console.log("WALL CREATED");

	setTimeout(function(){

		window.uploadingGalleryMessageTimeout = 0;

		// applying the effect for every form
		window.isUploadingGallery = false;

		$('.uploaderGallery').on('change', function(event, template) {

			$.each(this.files, function(i, file) {
				//$('#filename').append('<p>' + file.name + '</p>');

				var filename = file.name.replace('.', '');



				if( window.uploadingGalleryMessageTimeout == 0 ){
					//toastr.success('Uploading Gallery Photos', '');
				}
				setTimeout(function(){
					window.uploadingGalleryMessageTimeout = 0;
				},3000);
				window.uploadingGalleryMessageTimeout = 1;

				const upload = Images.insert({
					file: file,
					streams: 'dynamic',
					chunkSize: 'dynamic',
					meta: {
						mediaType: "gallery",
					}
				}, false);

				$(".uploaderPercent").css('width',"3%");

				upload.on('progress', function(){

					$(".uploaderPercent").css('width',this.progress.curValue+"%");

				});

				upload.on('start', function() {

					$('.modal .photoGallery .row').append("<div class='grid-item grid-item-3'><img src='"+checkSslMode()+"://"+Meteor.settings.public.cdnPath+"/default/imageLoader.svg' class='galleryTempPhoto-"+filename+"' style='width:100%;'/></div>");

					$(".uploaderPercent").css('width',"3%");

				});

				upload.on('end', function(error, fileObj) {


					if (error) {
						alert('Error during upload: ' + error);
					} else {

						$(".galleryTempPhoto-"+filename).remove();

						setTimeout(function(){
							$('.modal .photoGallery .row').append("<div class='grid-item grid-item-3'><img src='"+checkSslMode()+"://"+Meteor.settings.public.cdnPath+"/default/imageLoader.svg' class='galleryTempPhoto-"+filename+"' style='width:100%;' onerror='imageError(this);' /></div>");

							$(".uploaderPercent").css('width',"0%");
						},2000);

					}

				});

				setTimeout(function(){
					// APPLE DEVICE MAKES YOU WAIT FOR SOME REASON
					// EW???
					upload.start();
				},2000);

			});
		});

	},200);

}

function checkSslMode(){
	if(document.domain == "localhost"){
		return "http";
	}else{
		return "https";
	}
}


Template.wall.destroyed = function() {


};


Template.wall.events({

	"click .uiActionSeeFriending"(event){
		if( $(".uiActionSeeFriending").hasClass("active") ){
			$(".uiActionSeeFriending").removeClass("active");
			Meteor.call("userSeeFrom", "remove", "friending");
		}else{
			$(".uiActionSeeFriending").addClass("active");
			Meteor.call("userSeeFrom", "add", "friending");
		}
		location.reload();
	},

	"click .uiActionSeeFollowing"(event){
		if( $(".uiActionSeeFollowing").hasClass("active") ){
			$(".uiActionSeeFollowing").removeClass("active");
			Meteor.call("userSeeFrom", "remove", "following");
		}else{
			$(".uiActionSeeFollowing").addClass("active");
			Meteor.call("userSeeFrom", "add", "following");
		}
		location.reload();
	},

	"click .uiActionSeeTopics"(event){
		if( $(".uiActionSeeTopics").hasClass("active") ){
			$(".uiActionSeeTopics").removeClass("active");
			Meteor.call("userSeeFrom", "remove", "topics");
		}else{
			$(".uiActionSeeTopics").addClass("active");
			Meteor.call("userSeeFrom", "add", "topics");
		}
		location.reload();
	},

	"click .uiActionRequestUnfriendCheck"(event){

		swal({
		  title: 'Unfriend?',
		  text: "",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#d33',
		  cancelButtonColor: '#3085d6',
		  confirmButtonText: 'Unfriend them'
		}).then((result) => {

			Meteor.call("unfriendRequest", Router.current().params.theUsername );

			swal(
				'Unfriended',
				'You will no longer see each others posts.',
				'error'
			)

		})

	},

	"click .uiActionRequestFriendOrFollow"(event){

		if(!Meteor.userId()){
			swal({
				title: "Please Sign In to Follow & Friend",
				text: "DOER IS 100% FREE!",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
			});
			return;
		}


		if(window.noTrollFriend==false){

			window.noTrollFriend = true; // client side timeout

			meUserMeta = UserMeta.findOne({ meteorUserId:Meteor.userId() });
			youUserMeta = UserMeta.findOne({ username:Router.current().params.theUsername });

			var isFriend = false;
			meUserMeta.friends.forEach(function(theFriend){

				if(theFriend == youUserMeta.meteorUserId){
					isFriend = true;
				}

			});

			var isFriendRequest = false;
			meUserMeta.friendsRequest.forEach(function(theFriendRequest){

				if(theFriendRequest == youUserMeta.meteorUserId){
					isFriendRequest = true;
				}

			});

			var isFollowing = false;
			meUserMeta.following.forEach(function(theFollowingId){

				if(theFollowingId == youUserMeta.meteorUserId){
					isFollowing = true;
				}

			});

			if( $(event.currentTarget).attr("data-action") == "friend" ){

				// No Status
				if(!isFriend && !isFriendRequest){

					swal({
					  title: 'Add Friend?',
					  text: "",
					  type: 'question',
					  showCancelButton: true,
					  confirmButtonColor: '#d33',
					  cancelButtonColor: '#3085d6',
					  confirmButtonText: 'Add Friend'
					}).then((result) => {

						Meteor.call("requestFriendOrFollow", "friend", Router.current().params.theUsername);

						swal(
							'Friend Request Sent',
							'Please wait for them to accept',
							'success'
						)

					});

				}

				// Yes, request was sent
				if(!isFriend && isFriendRequest){

					swal({
					  title: 'Cancel request?',
					  text: "",
					  type: 'warning',
					  showCancelButton: true,
					  confirmButtonColor: '#d33',
					  cancelButtonColor: '#3085d6',
					  confirmButtonText: 'Cancel Request'
					}).then((result) => {

						Meteor.call("requestFriendOrFollow", "unfriend", Router.current().params.theUsername);

						swal(
							'Request Cancelled',
							'',
							'error'
						)

					});

				}

				// Yes, request is accepted
				if(isFriend && !isFriendRequest){

					swal({
					  title: 'Unfriend?',
					  text: "",
					  type: 'warning',
					  showCancelButton: true,
					  confirmButtonColor: '#d33',
					  cancelButtonColor: '#3085d6',
					  confirmButtonText: 'Unfriend them'
					}).then((result) => {

						Meteor.call("requestFriendOrFollow", "unfriend", Router.current().params.theUsername);

						swal(
							'Unfriended',
							'You will no longer see each others posts.',
							'error'
						)

					});

				}

			}

			if( $(event.currentTarget).attr("data-action") == "follow" ){

				// No Status
				if(!isFollowing){

					Meteor.call("requestFriendOrFollow", "follow", Router.current().params.theUsername);

					swal({
					  title: 'Following!',
					  text: "",
					  type: 'success',
					  showCancelButton: false,
					  confirmButtonColor: '#d33',
					  cancelButtonColor: '#3085d6',
					  confirmButtonText: 'Close'
					}).then((result) => {

					});

				}

				// Yes, request is accepted
				if(isFollowing){

					swal({
					  title: 'UnFollow?',
					  text: "",
					  type: 'warning',
					  showCancelButton: true,
					  confirmButtonColor: '#d33',
					  cancelButtonColor: '#3085d6',
					  confirmButtonText: 'Unfollow them'
					}).then((result) => {

						Meteor.call("requestFriendOrFollow", "unfollow", Router.current().params.theUsername);

						swal(
							'Unfollowed',
							'You will no longer see each others browse.',
							'error'
						)

					});

				}

			}

		}

		setTimeout(function(){
			window.noTrollFriend = false;
		},1000);

	},

	"click .friendsOrFollowers"(){
		if( $(".friendsOrFollowers").is(":checked") ){
			$(".displayFriendsOrFollowers").html("Connections And Followers");
		}else{
			$(".displayFriendsOrFollowers").html("Connections Only");
		}
	},

	"click .scrollToPosts"(){

	},

	"click .submitPostButton"(event){

		if(!Meteor.userId()){
			swal({
				title: "Please Sign In to Comment",
				text: "DOER IS 100% FREE!",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
			});
			return;
		}

		var theTitle = "";
		theTitle = $(".uiCreatePostTitle").val();

		var theTopic = "";
		theTopic = $(".uiCreatePostTopic").val();

		if(!$(".createTopicControls").is(":visible")){
			Meteor.call("createPost",
				window.YouDoerPostType,
				$(".note-editable").html(),
				theTitle,
				theTopic,
			);
		}

		if($(".createTopicControls").is(":visible")){
			Meteor.call("createTopic",
				$(".uiTopicTitle").val(),
				$(".note-editable").html(),
				$(".uiThePrivacy:checked").val(),
				$(".uiTopic18Only").is(":checked"),
				$(".uiTopic1Graphic").is(":checked"),
			);
		}

		$(".note-editable").html("");
		$(".modal").modal("hide");

		//scroll(1000,$(".comments-container").position().top);

		//window.scrollTo({ top: $(".comments-container").position().top, behavior: 'smooth' });

	},


	"click .emotion"(event){

		if(!Meteor.userId()){
			swal({
				title: "Please Sign In to Share your Emotions!",
				text: "DOER IS 100% FREE!",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
			});
			return;
		}

		$(event.currentTarget).children().effect( "shake" );
		$(event.currentTarget).addClass('animated pulse');
		setTimeout(function(){
			$(event.currentTarget).removeClass('animated animated');
		},1000);


		Meteor.call("submitStar",
			$(event.currentTarget).attr("data-id"),
			$(event.currentTarget).attr("data-theType"),
		);

	},

	"click .uiActionCreateReply"(event){

        // uiActionCreateReply // $(event.currentTarget).attr("data-id"),
        //alert($(event.currentTarget).attr("data-commentId"));
        $(event.target).parent().parent().parent().parent().parent().parent().find('.comment-myReply:first').show();
		$(event.target).parent().parent().parent().parent().parent().parent().find('.comment-myReply:first input').focus();
		$( ".submitComment-"+$(event.currentTarget).attr("data-id") ).select();


		//window.scrollTo('.submitComment-'+$(event.currentTarget).attr("data-id"), 1000, { easing: 'easeInOutExpo', offset: 0, 'axis': 'y' });
	},

	"click .uiActionExpandContent"(event){

		const target = event.target;

		//alert(target.getAttribute('data-thepostid'));

		$(".classExpander-"+target.getAttribute('data-thepostid') +" .contentMaxHeightWrapper").css("max-height","100%");
		$(".classExpander-"+target.getAttribute('data-thepostid') +" .contentMaxHeightWrapper").css("overflow-y","visible");
		$(".classExpander-"+target.getAttribute('data-thepostid')).children(".uiActionExpandContent").hide();
		$(".uiActionSubmitComment .submitYourComment").val("");

	},


	'change .myPhotoUploader' (event, template) {

		//$('#filename').append('<p>' + file.name + '</p>');

		toastr.success('Updating Photo!', '');

		const upload = Images.insert({
			file: event.currentTarget.files[0],
			streams: 1,
			chunkSize: 102400,
			meta: {
				mediaType: $(event.currentTarget).attr("data-type"),
				page: $(event.currentTarget).attr("data-page"),
				theId: $(event.currentTarget).attr("data-id"),
			}
		}, false);

		upload.on('start', function() {
			//toastr.success('Uploading Photo to gallery', '');
		});

		upload.on('end', function(error, fileObj) {

		});

		setTimeout(function(){
			upload.start();
		},2000);


	},


	'click .uiActionCreateTempPost'(event){

		$(".createTopicControls").hide();
		$(".browseControls").show();

		Meteor.call('createTempPost', window.YouDoerPostType);

		var theTempPost = Posts.findOne({temp:true});
		if(theTempPost){
			Meteor.subscribe('findGalleryByPostId', theTempPost._id);
		}

	},

	'click .uiActionCreateTopic'(event){
		$(".createTopicControls").show();
		$(".browseControls").hide();
	},

	'click .uiActionCreateTempGallery'(event){

		Meteor.call('createTempPost', 'gallery');

	},

	'submit .uiActionSubmitComment'(event){

		event.preventDefault();
		const target = event.target;


		if(!Meteor.userId()){
			swal({
				title: "Please Sign In to Comment",
				text: "DOER IS 100% FREE!",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Close",
			});
			return;
		}


		Meteor.call("createComment",
			target.theParentId.value,
			target.theReplyType.value,
			target.submitComment.value
		);

		$('.comment-myReply').hide();
		$('.isDefaultReplyBox').show();
		$(".uiActionSubmitComment .submitYourComment").val("");

	},

	'click .uiActionFollowCheck'(event){

		window.theDataTopic = $(event.currentTarget).attr("data-topic");

		Meteor.call("subscribeTopic", window.theDataTopic);

		swal(
			window.theDataTopic,
			'Subscribed to '+ window.theDataTopic,
			'success'
		)

	},

	'click .uiActionUnfollowCheck'(event){

		window.theDataTopic = $(event.currentTarget).attr("data-topic");

		swal({
		  title: 'Unfollow '+window.theDataTopic+'?',
		  text: "",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#d33',
		  cancelButtonColor: '#3085d6',
		  confirmButtonText: 'Unfollow'
		}).then((result) => {

			Meteor.call("unsubscribeTopic", window.theDataTopic);

			swal(
				window.theDataTopic,
				'You will no longer see posts from '+ window.theDataTopic,
				'error'
			)

		});

	},

	'click .uiActionDeletPost'(event){

		window.theDataTopic = $(event.currentTarget).attr("data-id");

		swal({
		  title: 'Delete?',
		  text: "",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#d33',
		  cancelButtonColor: '#3085d6',
		  confirmButtonText: 'Delete'
		}).then((result) => {

			Meteor.call("deletePost", window.theDataTopic);

			swal(
				window.theDataTopic,
				'Post Deleted',
				'error'
			)

		});

	},

	'click .uiActionReportPost'(event){

		window.theDataTopic = $(event.currentTarget).attr("data-id");

		swal({
		  title: 'Report?',
		  text: "",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#d33',
		  cancelButtonColor: '#3085d6',
		  confirmButtonText: 'Delete'
		}).then((result) => {

			Meteor.call("reportPost", window.theDataTopic);

			swal(
				window.theDataTopic,
				'Post Reported',
				'warning'
			)

		});

	},



});


Template.wall.helpers({

	loggedIn(){
		if( Meteor.userId()){
			return true;
		}
		return false;
	},

	currentUser(){
		if( Meteor.userId()){
			return true;
		}
		return false;
	},

	currentUpload() {
		return Template.instance().currentUpload.get();
	},

	checkPage(thePageCheck, thePageCheck2, thePageCheck3, thePageCheck4){

		var pageCheckArray = [
			thePageCheck,
			thePageCheck2,
			thePageCheck3,
			thePageCheck4
		];

		//console.log("CHECK PAGE:");
		//console.log( Iron.Location.get().path.split("/")[1] + " / " + Iron.Location.get().path.split("/")[2] + " / " + Iron.Location.get().path.split("/")[3]);

		//console.log("social: " + pageCheckArray.includes("social") );
		//console.log("browse: " + pageCheckArray.includes("browse") );

		// Social
		// Wall | Post
		if(

			Iron.Location.get().path.split("/")[1] == "s"
			&& pageCheckArray.includes("social")

			|| Iron.Location.get().path.split("/")[1] == "post"
			&& pageCheckArray.includes("social")

		){
			return true;
		}


		// Browse
		if(
			Iron.Location.get().path.split("/")[1] == "t"
			&& pageCheckArray.includes("t")
		){
			return true;
		}


		// Browse Topic
		if(
			Iron.Location.get().path.split("/")[1] == "browse"
			&& pageCheckArray.includes("browseTopic")
			&& Iron.Location.get().path.split("/")[2]
		){
			return true;
		}

		// Has Comments
		// Social | Browse
		if(
			Iron.Location.get().path.split("/")[1] == "browse"
			&& Iron.Location.get().path.split("/")[2]
			&& pageCheckArray.includes("hasComments")

			|| Iron.Location.get().path.split("/")[1] == "s"
			&& pageCheckArray.includes("hasComments")
		){
			return true;
		}

		if(
			pageCheckArray.includes("browsePost")
			&& Iron.Location.get().path.split("/")[1]
			&& Iron.Location.get().path.split("/")[2]
		){
			return true;
		}

		// Groups
		if(
			Iron.Location.get().path.split("/")[1] == "group"
			&& pageCheckArray.includes("group")
		){
			return true;
		}

		return false;

	},

	showCreatePostButton(){

		if( Iron.Location.get().path.split("/")[1] == "post"){
			return false;
		}
		return true;

	},

	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	uploadedFiles: function () {
		return Images.find();
	},
	photosProfile(){
		return PhotosProfile.find({ },{sort: { timeCreated: -1 }});
	},
	photosCover(){
		return PhotosCover.find({ },{sort: { timeCreated: -1 }});
	},

	seeTypeActive(addOrRemove){

		var myUserMeta = UserMeta.findOne({ username: Meteor.user().username });
		if(addOrRemove == "userSeeFromFriending" && myUserMeta.userSeeFromFriending == "add"){
			return true;
		}

		if(addOrRemove == "userSeeFromTopics" && myUserMeta.userSeeFromFollowing == "add"){
			return true;
		}

		if(addOrRemove == "userSeeFromFollowing" && myUserMeta.userSeeFromTopics == "add"){
			return true;
		}
	},

	checkExtension( theExtension ){

		var theGallery = Galleries.findOne({ _id:this._id });
		//console.log("CHECKING GALLERIES: " + this._id);

		if(theExtension == "jpg" && theGallery.extension == "jpg"){
			return true;
		}
		if(theExtension == "mp4" && theGallery.extension == "mp4"){
			return true;
		}
		return false;

	},

	isTopicSubcriber(){

		var theUserMeta = UserMeta.findOne({ meteorUserId: Meteor.userId() });

		if(  theUserMeta.topics.includes(Iron.Location.get().path.split("/")[2] ) ){
			return true;
		}
		return false;

	},

	myProfile(){

		if( Iron.Location.get().path.split("/")[1] == "s"){

			if(Meteor.user()){

				if( Router.current().route.path(this) == "/s" ){
					return true;
				}

				// Checking /friending/@username
				if( Router.current().params.theUsername ){

					if( Router.current().params.theUsername == Meteor.user().username ){
						return true
					}else{
						return false
					}

				}

				return false;

			}
		}
		return false;

	},

	myGroup(){
		if( Iron.Location.get().path.split("/")[1] == "group"){
			return true;
		}
	},

	myTopic(){

		var theTopic = Topics.findOne({});
		if( theTopic.ownerId == Meteor.userId() ){
			return true;
		}

		// TODO: Moderators

	},
	theTopic(){
		return Topics.findOne({});
	},

	theGroup(){

		return Groups.findOne({});

	},

	theHeaderObject(){

		if( Iron.Location.get().path.split("/")[1] == "s"){
			if( Router.current().params.theUsername ){
				var myUserMeta = UserMeta.findOne({ username: Router.current().params.theUsername });
			}else{

				if(Meteor.user()){
					var myUserMeta = UserMeta.findOne({ username: Meteor.user().username });
				}
			}

			if( myUserMeta ){
				return myUserMeta;
			}
		}

		// Browsing Topic Feed
		if( Iron.Location.get().path.split("/")[1] == "browse" && !Iron.Location.get().path.split("/")[2] ){
			if( Router.current().params.theUsername ){
				var myUserMeta = UserMeta.findOne({ username: Router.current().params.theUsername });
			}else{
				if(Meteor.user()){
					var myUserMeta = UserMeta.findOne({ username: Meteor.user().username });
				}
			}

			if( myUserMeta ){
				return myUserMeta;
			}
		}

		// Browsing Topic
		if(
			Iron.Location.get().path.split("/")[1] == "browse"
			&& Iron.Location.get().path.split("/")[2]
			&& !Iron.Location.get().path.split("/")[3]
		){
			var theTopic = Topics.findOne({ title: Router.current().params.theTopic });
			return theTopic;
		}

		// Browsing Topic Post
		if(
			Iron.Location.get().path.split("/")[1] == "browse"
			&& Iron.Location.get().path.split("/")[2]
			&& Iron.Location.get().path.split("/")[3]
		){
			//alert("BROSE TOPIC");
		}

		// Group
		if( Iron.Location.get().path.split("/")[1] == "group"){
			return Groups.findOne({});
		}

	},

	thisUserMeta(){

		if( Router.current().params.theUsername ){
			console.log("---------------------------CHECKING: thisUserMeta: "+Router.current().params.theUsername);
			console.log("browser check: "+Router.current().params.theUsername);

			var myUserMeta = UserMeta.findOne({ username: Router.current().params.theUsername });
			console.log(myUserMeta);
		}else{

			if(Meteor.user()){
				console.log("---------------------------CHECKING: thisUserMeta: "+Meteor.user().username);
				console.log("browser check: "+Meteor.user().username);

				var myUserMeta = UserMeta.findOne({ username: Meteor.user().username });
				console.log(myUserMeta);
			}
		}

		if( myUserMeta ){
			return myUserMeta;
		}

	},

	posts(){

			console.log("GENERATING WALL POSTS WITH INFINITIE LOADER");
			console.log(window.contextType);

			// Init
			var theUserMeta = "not_found";
			var thePosts = false;
			var friendsIdsPlusMyId = false;

			// TO FIX:
			// We must compare the active user and only pull their feed
			// Currently it just loads in ALL POSTS, which is not contextually correct

			if(window.contextType == "social"){

				console.log(window.contextType+":"+window.contextUser);

				// The user context
				if(window.contextUser == "myself"){
					theUserMeta = UserMeta.findOne({ username: Meteor.user().username });

					friendsIdsPlusMyId = theUserMeta.friends;
					friendsIdsPlusMyId.push( Meteor.userId() );

					thePosts = Posts.find({temp:false, type:"social", ownerId: { $in: friendsIdsPlusMyId } },{sort: { timeCreated: -1 }});

				}


				if(window.contextUser == "user"){
					theUserMeta = UserMeta.findOne({ username: Router.current().params.theUsername });

					friendsIdsPlusMyId = theUserMeta.friends;
					friendsIdsPlusMyId.push( theUserMeta.meteorUserId );



					// Are we friends? If so, display the posts, if not, hide
					youUserMeta = UserMeta.findOne({ username:Router.current().params.theUsername });
					
					var isFriend = false;
					youUserMeta.friends.forEach(function(theFriendId){

						if(theFriendId == Meteor.userId()){
							isFriend = true;

							

						}

					});

					console.log("VALID POST FRIEND FOR USER: "+theUserMeta.username+" IDS: ");
					console.log(friendsIdsPlusMyId);

					if(isFriend){
						thePosts = Posts.find({temp:false, type:"social", ownerId: { $in: friendsIdsPlusMyId } },{sort: { timeCreated: -1 }});
					}

				}

			}

			/*
			if( window.infintyLoadPostTopic ){
				thePosts = Posts.find({temp:false, type:window.contextType, topic:window.infintyLoadPostTopic },{sort: { timeCreated: -1 }});

				if( window.infintyLoadPostTitle ){
					thePosts = Posts.find({temp:false, type:window.contextType, topic:window.infintyLoadPostTopic, titleUrl:window.infintyLoadPostTitle },{sort: { timeCreated: -1 }});
				}

			}
			*/



			//alert(thePosts.count());


				thePosts.forEach(function(thePost){

					Meteor.subscribe('findGalleryByPostId', thePost._id);

					if(thePost.comments){
						thePost.comments.forEach(function(theCommentId){
							Meteor.subscribe('findCommentById', theCommentId);

							var theComments = Comments.findOne({ _id:theCommentId });
							if(theComments){
								theComments.comments.forEach(function(theCommentId){
									Meteor.subscribe('findCommentById', theCommentId);

									var theComments = Comments.findOne({ _id:theCommentId });
									if(theComments){
										theComments.comments.forEach(function(theCommentId){
											Meteor.subscribe('findCommentById', theCommentId);

											var theComments = Comments.findOne({ _id:theCommentId });
											if(theComments){
												theComments.comments.forEach(function(theCommentId){
													Meteor.subscribe('findCommentById', theCommentId);

													var theComments = Comments.findOne({ _id:theCommentId });
													if(theComments){
														theComments.comments.forEach(function(theCommentId){
															Meteor.subscribe('findCommentById', theCommentId);

															var theComments = Comments.findOne({ _id:theCommentId });
															if(theComments){
																theComments.comments.forEach(function(theCommentId){
																	Meteor.subscribe('findCommentById', theCommentId);

																	var theComments = Comments.findOne({ _id:theCommentId });
																	if(theComments){
																		theComments.comments.forEach(function(theCommentId){
																			Meteor.subscribe('findCommentById', theCommentId);

																			var theComments = Comments.findOne({ _id:theCommentId });
																			if(theComments){
																				theComments.comments.forEach(function(theCommentId){
																					Meteor.subscribe('findCommentById', theCommentId);

																					var theComments = Comments.findOne({ _id:theCommentId });
																					if(theComments){
																						theComments.comments.forEach(function(theCommentId){
																							Meteor.subscribe('findCommentById', theCommentId);

																							var theComments = Comments.findOne({ _id:theCommentId });
																							if(theComments){
																								theComments.comments.forEach(function(theCommentId){
																									Meteor.subscribe('findCommentById', theCommentId);

																									var theComments = Comments.findOne({ _id:theCommentId });
																									if(theComments){
																										theComments.comments.forEach(function(theCommentId){
																											Meteor.subscribe('findCommentById', theCommentId);

																											var theComments = Comments.findOne({ _id:theCommentId });
																											if(theComments){
																												theComments.comments.forEach(function(theCommentId){
																													Meteor.subscribe('findCommentById', theCommentId);

																													var theComments = Comments.findOne({ _id:theCommentId });
																													if(theComments){
																														theComments.comments.forEach(function(theCommentId){
																															Meteor.subscribe('findCommentById', theCommentId);


																														});

																													}

																												});

																											}

																										});

																									}

																								});

																							}

																						});

																					}

																				});

																			}


																		});

																	}


																});

															}


														});

													}


												});

											}


										});

									}


								});

							}

						});
					}




				});

				return thePosts;



	},

	comment(){

		//console.log("Comment for: " + this._id);
		return Comments.find({postId:this._id}, {sort: { timeCreated: -1 }} );

	},

	thisObjectComments(){

		if(this.comments){

			return Comments.find({_id: {$in:this.comments}});

		}

	},

	galleryImage(){
		return Galleries.find({parentPostId:this._id}, {sort: { timeCreated: 1 }} );
	},

	galleryImageForTemp(){

		var theTempPost = Posts.findOne({temp:true, ownerId:Meteor.userId()});
		console.log("XXXXXXXXX THE TEMP POST");
		console.log(theTempPost);

		if(theTempPost){
			Meteor.subscribe('findGalleryByPostId', theTempPost._id);
			return Galleries.find({parentPostId:theTempPost._id}, {sort: { timeCreated: 1 }} );
		}
		return false;


	},

	galleryImageSizer(){

		var theCount = Galleries.find({parentPostId:this._id}).count();
		if(theCount == 1){
			return 1;
		}
		if(theCount == 2){
			return 2;
		}
		if(theCount >= 3){
			return 3;
		}
	},

	weAreFriends(){

		//if( Notifications.findOne({type:"friends",idFrom:"",idTo:""}) || Router.current().params.theUsername.split("@")[1] == Meteor.user().username ){
		if(Meteor.user()){
			if( Router.current().route.path(this) == "/s"){
				return true;
			}
			if(Router.current().params.theUsername){
				if( Router.current().params.theUsername == Meteor.user().username ){
					return true;
				}
			}
		}

		return false;

	},

	friendStatusCheck(theStatusCheck){

		//console.log("friendRequestCheck: "+theStatusCheck);

		meUserMeta = UserMeta.findOne({ meteorUserId:Meteor.userId() });
		youUserMeta = UserMeta.findOne({ username:Router.current().params.theUsername });

		var isFriend = false;
		youUserMeta.friends.forEach(function(theFriend){

			if(theFriend == Meteor.userId()){
				isFriend = true;
			}

		});

		var isFriendRequest = false;
		youUserMeta.friendsRequest.forEach(function(theFriendRequest){

			if(theFriendRequest == Meteor.userId()){
				isFriendRequest = true;
			}

		});


		// No Status
		if(theStatusCheck == "none" && !isFriend && !isFriendRequest){
			return true;
		}

		// Yes, request was sent
		if(theStatusCheck == "request" && !isFriend && isFriendRequest){
			return true;
		}

		// Yes, request is accepted
		if(theStatusCheck == "accepted" && isFriend && !isFriendRequest){
			return true;
		}


		return false;

	},

	followCheck(theStatusCheck){

		meUserMeta = UserMeta.findOne({ meteorUserId:Meteor.userId() });
		youUserMeta = UserMeta.findOne({ username:Router.current().params.theUsername });

		var isFollowing = false;


		meUserMeta.following.forEach(function(theFollowingIds){

			if( theFollowingIds == youUserMeta.meteorUserId ){
				isFollowing = true;
			}

		});


		if(!isFollowing && theStatusCheck == "none"){
			return true;
		}

		if(isFollowing && theStatusCheck == "accepted"){
			return true;
		}


	},

	isStarer(){

		var thePost = Posts.findOne({_id:this._id});

		isStarer = false;
		if(thePost.starers){
			thePost.starers.forEach(function(theLiker){

				if(theLiker == Meteor.userId()){
					isStarer = true;
				}

			});
		}

		if( isStarer){
			return true;
		}
		return false;
	},

	
	subscriptions(){
		var theUserMeta = UserMeta.findOne({});

		return theUserMeta.topics.sort(function (a, b) {
		    return a.toLowerCase().localeCompare(b.toLowerCase()); // sorts alphabetically ignoring case
		});
	},

	theIndex(whatNumber, theIndexCount){
		if(whatNumber == theIndexCount){
			return true;
		}else{
			return false;
		}
	},

	postOwner(){

		var thePost = Posts.findOne({ ownerId: Meteor.userId() });
		if(thePost){
			return true;
		}
		return false;

	},

	friendingOrFollowingPage(){

		if(Iron.Location.get().path.split("/")[1] == "s"){
			return "/v/social"
		}
		return "/?????";
	},


});

Template.wallComment.helpers({


	friendingOrFollowingPage(){

		if(Iron.Location.get().path.split("/")[1] == "s"){
			return "/v/social"
		}
		return "/?????";
	},

	isStarerComment(){
		var theComment = Comments.findOne({_id:this._id});

		isStarer = false;
		theComment.starers.forEach(function(theLiker){

			if(theLiker == Meteor.userId()){
				isStarer = true;
			}

		});

		if( isStarer){
			return true;
		}
		return false;
	},


});