if (Meteor.isServer) {

	import fs from 'fs-extra';

	var storageRoot = Meteor.settings.public.file_storage_path;
	var storageProcessing = Meteor.settings.public.file_storage_path+'/_processing';

	Meteor.publish('findPosts', function( contextType, contextUser, contextReference, theRequestLimit ) {



			console.log("------- Posts: "+ contextType+" : "+contextUser +" :::: "+theRequestLimit);

			//theRequestLimit = 5;

			var meUserMeta = false;
			var youUserMeta = false;

			var friendsIdsPlusMyId = false;

			var topicsDefault = [
				'AnimalAdvice',
				'Art',
				'AskAnything',
				'AskScience',
				'Aww',
				'Blog',
				'Books',
				'Diy',
				'Documentaries',
				'Fitness',
				'Food',
				'Funny',
				'Futurology',
				'Gadgets',
				'Games',
				'GetMotivated',
				'History',
				'Jokes',
				'LifeHacks',
				'LifeProTips',
				'Memes',
				'MildlyInteresting',
				'Movies',
				'Music',
				'News',
				'PersonalFinance',
				'Philosophy',
				'Pics',
				'Politics',
				'Relationships',
				'Science',
				'Space',
				'Sports',
				'Technology',
				'Television',
				'TodayILearned',
				'Travel',
				'UpliftingNews',
				'Videos',
			];


			// social myself
			// social user



			// GET MY OWN DATA
			if( Meteor.userId() ){
				meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			}


			// VIEWING A PERSON
			if(contextType == "social"){

				// SELF
				if(contextUser == "myself"){

					meUserMeta.friends.push( Meteor.userId() );
					
					friendsIdsPlusMyId = meUserMeta.friends;
					friendsIdsPlusMyId.push( Meteor.userId() );

					console.log("RETURNING SOCIAL:MYSELF");
					console.log(friendsIdsPlusMyId);

					return Posts.find({ type:"social", ownerId:{$in:friendsIdsPlusMyId} }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});
					
				}

				// ANOTHER USER
				if(contextUser == "user"){

					console.log("RETURNING SOCIAL:"+contextReference);
					youUserMeta = UserMeta.findOne({username:contextReference});

					// CHECK FRIEND STATUS
					var isFriend = false;
					if( Meteor.userId() ){
						meUserMeta.friends.forEach(function(theFriendId){

							//console.log(theFriendId +" = "+ youUserMeta.meteorUserId);

							if( theFriendId == youUserMeta.meteorUserId ){
								console.log("WE ARE FRIENDS");
								isFriend = true;
							}

						});
					}

					if(isFriend){
						return Posts.find({ type:"social", ownerId:{$in:youUserMeta.friends} }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});
					}else{
						return false;
					}


				}

			}
			

			


			/*

			if(
				theContextView == "myself" ||
				theContextView == "another"
			){

				youUserMeta = UserMeta.findOne({username:theContextLookup});

			}


			// Build Post Owners array
			// -----------------------
			var thePostOwnersArray = [];

			// SOCIAL MY PROFILE WALL
			// -----------
			if( theContextView == "myself" ){

				console.log("MY PROFILE FEED RETURNING: ");
				console.log(Posts.find({ type:"social", ownerId:{$in:meUserMeta.friends} }, {sort: { timeUpdated: -1 }, limit: theRequestLimit}).count());

				meUserMeta.friends.push(Meteor.userId());
				return Posts.find({ type:"social", ownerId:{$in:meUserMeta.friends} }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});

			}

			// SOCIAL ANOTHER PROFILE
			// -----------
			if( theContextView == "another" ){

				if(isFriend){
					var theReturnPosts = Posts.find({ type:"social", ownerId:youUserMeta.meteorUserId }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});
					return theReturnPosts;
				}else{
					return [];
				}

			}


			// POST SINGLE
			// -----------
			if( theContextView == "postSingle" ){

				return Posts.find({ _id:theContextLookup }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});

			}



			// MY BROWSE
			// -----------
			if( theContextView == "myBrowse" ){

				if( Meteor.userId() ){
					return Posts.find({ type:"browse", topic:{$in:meUserMeta.topics} }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});
				}else{
					return Posts.find({ type:"browse", topic:{$in:topicsDefault} }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});
				}

			}


			// BROWSE SINGLE
			// -----------
			if( theContextView == "topicBrowse" ){

				return Posts.find({ topic:theContextLookup }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});

			}

			// BROWSE TOPIC
			// -----------
			if( theContextView == "singleBrowse" ){

				return Posts.find({ topic:theContextLookup, titleUrl:theTitleUrl }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});

			}



			// GROUPS PRIVATE
			// -----------
			if( theContextView == "groupPostsPrivateByUrl" ){

				console.log("findPosts: CASE 4: andys-test-group-bwkryo53mrse37ha6: "+theContextLookup);

				var thePosts = Posts.find({ type:"group" }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});
				thePosts.forEach(function(post){
					console.log(post);
				});
				return thePosts;
				//console.log("YES");


			}

			// ACTIVITIES
			// -----------
			if( theContextView == "activityByUrl" ){

				var thePosts = Posts.find({ type:"activity", contextId:String(theContextLookup) }, {sort: { timeUpdated: -1 }, limit: theRequestLimit});
				thePosts.forEach(function(post){
					console.log(post);
				});
				return thePosts;
				//console.log("YES");

			}

			*/


	});


	Meteor.publish('findCommentById', function( theId ) {

		console.log("findCommentById: "+theId);
		return Comments.find({_id:theId}, {sort: { timeUpdated: -1 }, limit: 10});

	});
	Meteor.publish('findGalleryByPostId', function( thePostId ) {

		//console.log("findGalleryByPostId: "+thePostId);
		return Galleries.find({parentPostId:thePostId}, {sort: { timeUpdated: -1 }, limit: 20});

	});


	Meteor.publish('findPhotosProfile', function( theUsername ) {

		var thePhotos = PhotosProfile.find({ ownerUsername:theUsername }, {sort: { timeUpdated: -1 }, limit: 10});
		return thePhotos;

		return [];

	});

	Meteor.publish('findPhotosCover', function( theUsername ) {

		var thePhotos = PhotosCover.find({ ownerUsername:theUsername }, {sort: { timeUpdated: -1 }, limit: 10});
		return thePhotos;

		return [];

	});


	Meteor.methods({


		// ================
		//
		// userSeeFrom
		//
		// ================
		'userSeeFrom'(
			addOrRemove,
			type
		){

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});

			console.log("userSeeFrom: "+addOrRemove+": "+type);

			if( type=="friending" ){
				UserMeta.update( meUserMeta._id, {
					$set: {
						"userSeeFromFriending": addOrRemove,
					},
				});
			}

			if( type=="following" ){
				UserMeta.update( meUserMeta._id, {
					$set: {
						"userSeeFromFollowing": addOrRemove,
					},
				});
			}

			if( type=="topics" ){
				UserMeta.update( meUserMeta._id, {
					$set: {
						"userSeeFromTopics": addOrRemove,
					},
				});
			}

		},


		// ================
		//
		// Create Temp Post
		//
		// Use this to create a temporary post so that the File Manager can create a sane physical database of files
		// Example: /users/andy1212/posts/(thisTempId)/___________.jpg / mpeg
		// This way a user can download their entire data structure with ease in the future
		//
		// ================
		'createTempPost'(
			postType,
			topicType,
		){
			if( !Meteor.userId()){
				return;
			}
			if(!topicType || topicType == ""){
				topicType = "0";
			}
			console.log("TEMP: Post: "+topicType);

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			var theTempPost = Posts.findOne({ ownerId: Meteor.userId(), type: postType, temp: true });

			// Remove existing temporary posts
			// -------------------------------
			Posts.remove({ ownerId: Meteor.userId(), type: postType, temp: true });
			if(meUserMeta.tempPost != ""){
				// Try to clean up incase the user abandons the previous post
				// ERROR: this was deleting the published post content
				//fs.remove(storageRoot + '/users/'+Meteor.userId()+'/'+postType+'/'+meUserMeta.tempPost);
			}


			// Insert Temporary Post
			// ---------------------

			theTempPost = Posts.findOne({ ownerId: Meteor.userId(), type: postType, temp: true });
			if( theTempPost ){

				// Nothing to do here :)
				// Temp folders and files are already purged.

				return;

			}else{

				Posts.insert({

					ownerId: Meteor.userId(),
					ownerUsername: Meteor.user().username,
					ownerNameFirst: Meteor.user().profile.nameFirst,
					ownerNameLast: Meteor.user().profile.nameLast,
					ownerPhoto:meUserMeta.photo,

					type:postType,
					topic:topicType,
					temp:true,

					message:"",

					timeCreated:parseInt(Date.now()),
					timeUpdated:parseInt(Date.now()),

					stars:0,
					starers:[],

					commentsCount:0,
					comments:[],

					reports:0,
					reporters:[],

					tips:0,
					tippers:[],
					tipAmount:0.00,

					reports:0,
					reporters:[],

				});

				theTempPost = Posts.findOne({ ownerId: Meteor.userId(), type: postType, temp: true });

				UserMeta.update( meUserMeta._id, {
					$set: {
						"tempPost": theTempPost._id,
					},
				});

				theDirectory = storageRoot+"/users/"+Meteor.userId()+"/posts/"+theTempPost._id;
				theDirectory = storageRoot+"/users/"+Meteor.userId()+"/gallery/"+theTempPost._id;
				fs.ensureDir(theDirectory);

				return;

			}

		},


		// ================
		//
		// CREATE POST
		//
		// ================
		'createPost'(
			thetype,
			theMessage,
			theTitle,
			theTopic,
		){
			// No security check here, it will ONLY ever change your own profile photo LOL

			if( !Meteor.userId()){
				return;
			}

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			var theTempPost = Posts.findOne({ ownerId: Meteor.userId(), type: thetype, temp: true });

			console.log("createPost: "+theMessage);
			console.log("cleaning Message HTML:"+TagStripper.strip(theMessage, "<h1><h2><h3><h4><h5><b><u><a><p><hr><table><tr><td>"));

			console.log("Finding temp post:");
			console.log(theTempPost);

			if(theTempPost){
				Posts.update( theTempPost._id, {
					$set: {
						message:Meteor.ServerTools.TagStrip(theMessage),
						timeUpdated:parseInt(Date.now()),
						temp:false,
					}
				});

				// Sometimes the title and topic aren't required, in the case of Social VS Browser posts
				if(theTitle && theTopic){

					console.log("theTitle:" + theTitle);
					console.log("theTopic:" + theTopic);

					Posts.update( theTempPost._id, {
						$set: {
							title:TagStripper.strip(theTitle, "<h1><h2><h3><h4><h5><b><u><a><p><hr><table><tr><td>"),
							titleUrl:Meteor.ServerTools.ToSeoUrl(theTitle),
							topic:TagStripper.strip(theTopic, "<h1><h2><h3><h4><h5><b><u><a><p><hr><table><tr><td>"),
						}
					});
				}

			}else{
				console.log("ERROR: COULD NOT FIND TEMP POST: " + Meteor.userId() +" : " + thetype);
			}

		},



		// ================
		//
		// CREATE COMMENT ON POST
		//
		// ================
		'createComment'(
			theParentId,
			theParentType,
			theMessage,
		){
			// No security check here, it will ONLY ever change your own profile photo LOL

			if( !Meteor.userId()){
				return;
			}


			// TODO: Check for the input user context, so that B may post on to A, in their context!

			console.log("create "+theParentType+": "+theParentId+": "+theMessage);

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			var fromUserMeta = UserMeta.findOne({meteorUserId:Posts.ownerId});

			var theObject = "";
			if(theParentType == "post"){
				theObject = Posts.findOne({ _id:theParentId });
			}
			if(theParentType == "comment"){
				theObject = Comments.findOne({ _id:theParentId });
			}


			Comments.insert({

				ownerId: Meteor.userId(),
				ownerUsername: Meteor.user().username,
				ownerNameFirst: Meteor.user().profile.nameFirst,
				ownerNameLast: Meteor.user().profile.nameLast,
				ownerPhoto:meUserMeta.photo,

				parentId: theParentId,
				parentType: theParentType,
				message:Meteor.ServerTools.TagStrip(theMessage),

				stars:0,
				starers:[],

				commentsCount:0,
				comments:[],
				messageRowColor:meUserMeta.messageRowColor,

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			}, function(error, resultId){

				// Update the post comments ID array
				// console.log(resultId);
				// 	console.log(theParentType);

				if(theParentType == "post"){

					console.log("POSTS!!!!!!!!!!");

					Posts.update(theParentId, {
						$inc: { commentsCount: 1 },
						$push: { comments:resultId },
					});

				}

				if(theParentType == "comment"){

					console.log("COMMENTS");

					Comments.update(theParentId, {
						$inc: { commentsCount: 1 },
						$push: { comments:resultId },
					});

				}


			});




			// Do not send notifications if you own the post
			if( theObject.ownerId != Meteor.userId() ){

				// Activity owner notification
				// --------------------------
				Notifications.insert({

					type:"reply",
					status:"unread",
					read:"false",

					ownerId: theObject.ownerId,
					ownerUsername: theObject.ownerUsername,
					ownerNameFirst: theObject.ownerNameFirst,
					ownerNameLast: theObject.ownerNameLast,
					ownerPhoto: theObject.ownerPhoto,

					toOwnerId: Meteor.userId(),
					toUsername: Meteor.user().username,
					toNameFirst: Meteor.user().profile.nameFirst,
					toNameLast: Meteor.user().profile.nameLast,
					toPhoto: meUserMeta.photo,

					message:Meteor.ServerTools.TagStrip(theMessage),

					postId: theParentId,

					timeCreated:parseInt(Date.now()),
					timeUpdated:parseInt(Date.now()),

				});

				UserMeta.update( meUserMeta._id, {
					$inc: {
						"notificationsCountSocial": 1,
					},
				});

				Meteor.ServerTools.SendEmail(
					fromUserMeta.email,
					meUserMeta.nameFirst +" "+ meUserMeta.nameLast +" replied to your "+theParentType, "<h1><center>"+Meteor.ServerTools.TagStrip(theMessage)+"</center></h1>"
				);


			}

		},


		// ================
		//
		// EMOTION
		//
		// ================
		'submitStar'(
			theId,
			theType,
		){

			if( !Meteor.userId()){
				return;
			}

			console.log("Created star: "+theId+": "+theType);

			// POST
			if( theType	 == "post"){

				var thePost = Posts.findOne({_id:theId});
				var meUserMeta = UserMeta.findOne({meteorUserId:thePost.ownerId});

				// console.log("Updating post: "+thePost._id);
				// console.log(thePost);

				var isStarer = false;
				thePost.starers.forEach(function(theLiker){

					if(theLiker == Meteor.userId()){
						isStarer = true;
					}

				});

				if( !isStarer){

					Posts.update(thePost._id, {
						$inc: { stars: 1 },
						$push: { starers:Meteor.userId() },
					});

					if(thePost.ownerId != Meteor.userId() ){
						UserMeta.update( meUserMeta._id, {
							$inc: { stars: 1 },
						});
					}


				}else{

					Posts.update(thePost._id, {
						$inc: { stars: -1 },
						$pull: { starers:Meteor.userId() },
					});

					if(thePost.ownerId != Meteor.userId() ){
						UserMeta.update( meUserMeta._id, {
							$inc: { stars: -1 },
						});

						if(meUserMeta.stars -1 <= 0){
							UserMeta.update( meUserMeta._id, {
								$set: { stars: 0 },
							});
						}
					}

				}

			}

			// COMMENT
			if( theType == "comments"){

				var theComment = Comments.findOne({_id:theId});
				var meUserMeta = UserMeta.findOne({meteorUserId:theComment.ownerId});

				// console.log("Updating comment: "+theComment._id);
				// console.log(theComment);

				var isStarer = false;
				theComment.starers.forEach(function(theLiker){

					if(theLiker == Meteor.userId()){
						isStarer = true;
					}

				});

				if( !isStarer){

					Comments.update(theComment._id, {
						$inc: { stars: 1 },
						$push: { starers:Meteor.userId() },
					});

					if(theComment.ownerId != Meteor.userId() ){
						UserMeta.update( meUserMeta._id, {
							$inc: { stars: 1 },
						});
					}

				}else{

					Comments.update(theComment._id, {
						$inc: { stars: -1 },
						$pull: { starers:Meteor.userId() },
					});

					if(theComment.ownerId != Meteor.userId() ){
						UserMeta.update( meUserMeta._id, {
							$inc: { stars: -1 },
						});

						if(meUserMeta.stars -1 <= 0){
							UserMeta.update( meUserMeta._id, {
								$set: { stars: 0 },
							});
						}
					}

				}
			}



		},

		// ================
		//
		// DELETE POST
		//
		// ================
		'deletePost'(
			thePostId,
		){

			var meUserMeta = UserMeta.findOne({ meteorUserId: Meteor.userId() });

			var thePost = Posts.findOne({ _id: thePostId });

			if(thePost.ownerId == meUserMeta.meteorUserId){
				Posts.remove({ _id: thePostId });
			}


		},

		// ================
		//
		// REPORT POST
		//
		// ================
		'reportPost'(
			thePostId,
		){

			var meUserMeta = UserMeta.findOne({ meteorUserId: Meteor.userId() });

			var thePost = Posts.findOne({ _id: thePostId });



			var isReporter = false;
			thePost.reporters.forEach(function(theReporter){

				if(theReporter == Meteor.userId()){
					isReporter = true;
				}

			});

			if( !isReporter){

				Posts.update(thePost._id, {
					$inc: { reports: 1 },
					$push: { reporters:Meteor.userId() },
				});

			}else{

				Posts.update(thePost._id, {
					$inc: { reports: -1 },
					$pull: { reporters:Meteor.userId() },
				});

			}


		},

	});

}
