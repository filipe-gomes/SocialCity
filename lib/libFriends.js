if (Meteor.isServer) {



	Meteor.methods({


		// ================
		//
		// CREATE COMMENT ON POST
		//
		// ================
		'requestFriendOrFollow'(
			theAction,
			theUserId,
		){
			if( !Meteor.userId()){
				return;
			}
			console.log("requestFriendOrFollow: "+theAction+": "+ theUserId);

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			var youUserMeta = UserMeta.findOne({meteorUserId:theUserId});
			if(!youUserMeta){
				youUserMeta = UserMeta.findOne({username:theUserId});
			}

			// ----------------

			var isFriend = false;
			youUserMeta.friends.forEach(function(theFriend){

				if(theFriend == Meteor.userId()){
					isFriend = true;
				}

			});

			// -----------------

			var meIsFollowing = false;
			meUserMeta.following.forEach(function(theFollowingId){

				console.log("XX = " + theFollowingId +":"+youUserMeta.meteorUserId);

				if(theFollowingId == youUserMeta.meteorUserId){
					meIsFollowing = true;
				}

			});

			var youIsFollowing = false;
			youUserMeta.following.forEach(function(theFollowingId){

				if(theFollowingId == Meteor.userId()){
					youIsFollowing = true;
				}

			});


			// =======================
			// FRIENDS NEW
			// =======================
			if(theAction == "friend"){

				// ==================
				// NEW REQUEST
				// ==================
				if(!isFriend){

					UserMeta.update( youUserMeta._id, {
						$push: { friendsRequest:meUserMeta.meteorUserId },
					});

					UserMeta.update( meUserMeta._id, {
						$push: { friendsRequest:youUserMeta.meteorUserId },
					});

					// NOTIFY REQUEST USER
					Notifications.insert({

						type:"friend",
						status:"request",
						read:"true",
						direction:"meToThem",

						ownerId: Meteor.userId(),
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						ownerPhoto:meUserMeta.photo,

						toOwnerId: youUserMeta.meteorUserId,
						toUsername: youUserMeta.username,
						toNameFirst: youUserMeta.nameFirst,
						toNameLast: youUserMeta.nameLast,
						toPhoto: youUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});

					// No need to push MYSELF a notificaiton
					// UserMeta.update( meUserMeta._id, {
					// 	$inc: {
					// 		"notificationsCountSocial": 1,
					// 	},
					// });

					// NOTIFY TO USER
					Notifications.insert({

						type:"friend",
						status:"request",
						read:"false",
						direction:"themToMe",

						ownerId: youUserMeta.meteorUserId,
						ownerUsername: youUserMeta.username,
						ownerNameFirst: youUserMeta.nameFirst,
						ownerNameLast: youUserMeta.nameLast,
						ownerPhoto: youUserMeta.photo,

						toOwnerId: Meteor.userId(),
						toUsername: Meteor.user().username,
						toNameFirst: Meteor.user().profile.nameFirst,
						toNameLast: Meteor.user().profile.nameLast,
						toPhoto: meUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});

					UserMeta.update( youUserMeta._id, {
						$inc: {
							"notificationsCountSocial": 1,
						},
					});

					Meteor.ServerTools.SendEmail(
						youUserMeta.email,
						Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast + " wants to be your friend", "<a href='https://youdoer.com/@"+Meteor.user().username+"'><h1><center><img src='//"+Meteor.settings.public.cdnPath+"/users/"+meUserMeta.meteorUserId+"/profile/large-"+meUserMeta.photo+".jpg'  width='100%' /><br /><br />"+Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast+"</center></h1><br /><center>wants to be your friend!</center></a>"
					);


				}

			}


			// =======================
			// FRIENDS ACCEPT
			// =======================
			if(theAction == "friendAccept"){

				// Add to Friends
				UserMeta.update( youUserMeta._id, {
					$push: { friends:meUserMeta.meteorUserId },
				});

				UserMeta.update( meUserMeta._id, {
					$push: { friends:youUserMeta.meteorUserId },
				});

				// Remove Friends Request
				UserMeta.update( youUserMeta._id, {
					$pull: { friendsRequest:meUserMeta.meteorUserId },
				});

				UserMeta.update( meUserMeta._id, {
					$pull: { friendsRequest:youUserMeta.meteorUserId },
				});


				// In this case, we're just updaing the notification itself, this has nothing to do with actually being friends
				var theNotificationThemToMe = Notifications.findOne({ownerId:Meteor.userId(), type:"friend", status:"request", toOwnerId: theUserId });
				Notifications.update( theNotificationThemToMe._id, {
					$set: {
						"status": "accepted",
					},
				});

				var theNotificationMeToThem = Notifications.findOne({ownerId:theUserId, type:"friend", status:"request", toOwnerId: Meteor.userId() });
				Notifications.update( theNotificationMeToThem._id, {
					$set: {
						"status": "accepted",
					},
				});


				Notifications.insert({

					type:"general",
					read:"false",
					message: " accepted your friendship request",

					ownerId: youUserMeta.meteorUserId,
					ownerUsername: Meteor.user().username,
					ownerNameFirst: Meteor.user().profile.nameFirst,
					ownerNameLast: Meteor.user().profile.nameLast,
					toPhoto:meUserMeta.photo,

					timeCreated:parseInt(Date.now()),
					timeUpdated:parseInt(Date.now()),

				});

				console.log("+++++++++++++++++++++++++++++++ A FRIENDSHIP WAS CREATED, LET'S POST! " + meUserMeta.username + " " + youUserMeta.username);

				// NOTIFICATIONS AND SHARE FOR USER 1
				// -----------------------------------
				/*
				Posts.insert({

					ownerId: meUserMeta.meteorUserId,
					ownerUsername: meUserMeta.username,
					ownerNameFirst: meUserMeta.nameFirst,
					ownerNameLast: meUserMeta.nameLast,
					ownerPhoto: meUserMeta.photo,

					type:"social",
					temp:false,

					message:"<p>I'm now friends with <a href='/social/@"+youUserMeta.username+"' >"+ youUserMeta.nameFirst +" "+ youUserMeta.nameLast +"</a></p><p><img src='//"+Meteor.settings.public.cdnPath+"/users/"+youUserMeta.meteorUserId+"/profile/large-"+youUserMeta.photo+".jpg' onerror='imageError(this);'/></p>",

					timeCreated:parseInt(Date.now()),
					timeUpdated:parseInt(Date.now()),

				});

				Meteor.ServerTools.SendEmail(
					youUserMeta.email,
					Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast + " has accepted your friend request", "<a href='//"+Meteor.settings.public.cdnPath+"/social/@"+Meteor.user().username+"'><h1><center><img src='//"+Meteor.settings.public.cdnPath+"/users/"+youUserMeta.meteorUserId+"/profile/large-"+youUserMeta.photo+".jpg'  width='100%' /><br /><br />"+Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast+"</center></h1><br /><center>has accepted your friend request</center></a>"
				);


				// NOTIFICATIONS AND SHARE FOR USER 2
				// -----------------------------------
				Posts.insert({

					ownerId: youUserMeta.meteorUserId,
					ownerUsername: youUserMeta.username,
					ownerNameFirst: youUserMeta.nameFirst,
					ownerNameLast: youUserMeta.nameLast,
					ownerPhoto: youUserMeta.photo,

					type:"social",
					temp:false,

					message:"<p>I'm now friends with <a href='/social/@"+meUserMeta.username+"' >"+ meUserMeta.nameFirst +" "+ meUserMeta.nameLast +"</a></p><p><img src='//"+Meteor.settings.public.cdnPath+"/users/"+meUserMeta.meteorUserId+"/profile/large-"+meUserMeta.photo+".jpg' onerror='imageError(this);'/></p>",

					timeCreated:parseInt(Date.now()),
					timeUpdated:parseInt(Date.now()),

				});
				*/

				Meteor.ServerTools.SendEmail(
					youUserMeta.email,
					youUserMeta.nameFirst + " " + youUserMeta.nameLast + " has accepted your friend request", "<a href='//"+Meteor.settings.public.cdnPath+"/@"+Meteor.user().username+"'><h1><center><img src='//"+Meteor.settings.public.cdnPath+"/users/"+meUserMeta.meteorUserId+"/profile/large-"+meUserMeta.photo+".jpg'  width='100%' /><br /><br />"+Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast+"</center></h1><br /><center>has accepted your friend request</center></a>"
				);

				return "friendAccept";

			}

			// =======================
			// FRIENDS DECLINED
			// =======================
			if(theAction == "unfriend"){


				// Remove Friends Request
				UserMeta.update( youUserMeta._id, {
					$pull: { friendsRequest:meUserMeta.meteorUserId },
				});

				UserMeta.update( meUserMeta._id, {
					$pull: { friendsRequest:youUserMeta.meteorUserId },
				});

				// Remove Friends
				UserMeta.update( youUserMeta._id, {
					$pull: { friends:meUserMeta.meteorUserId },
				});

				UserMeta.update( meUserMeta._id, {
					$pull: { friends:youUserMeta.meteorUserId },
				});

			}






			// =======================
			// FOLLOW
			// =======================
			if(theAction == "follow"){

				if(!meIsFollowing){

					// Add to Following
					UserMeta.update( meUserMeta._id, {
						$push: { following:youUserMeta.meteorUserId },
					});

					// Add to Followers for the other user
					UserMeta.update( youUserMeta._id, {
						$push: { followers:meUserMeta.meteorUserId },
					});

				}

			}

			if(theAction == "unfollow"){

				if(meIsFollowing){

					// Remove Friends
					UserMeta.update( meUserMeta._id, {
						$pull: { following:youUserMeta.meteorUserId },
					});

					UserMeta.update( youUserMeta._id, {
						$pull: { followers:meUserMeta.meteorUserId },
					});

				}

			}



			/*

			// ACCEPT FRIENDSHIP
			// =================
			if(theAction == "friendAccept"){
				console.log("Friend Accepted:");

				var myFriend = Connections.findOne({ownerId:Meteor.userId(), type:"friend", status:"request", toOwnerId: theUserId });
				Connections.update( myFriend._id, {
					$set: {
						"status": "accepted",
					},
				});

				var theirFriend = Connections.findOne({ownerId:theUserId, type:"friend", status:"request", toOwnerId: Meteor.userId() });
				Connections.update( theirFriend._id, {
					$set: {
						"status": "accepted",
					},
				});

				var theNotificationThemToMe = Notifications.findOne({ownerId:Meteor.userId(), type:"friend", status:"request", toOwnerId: theUserId });
				Notifications.update( theNotificationThemToMe._id, {
					$set: {
						"status": "accepted",
					},
				});

				var theNotificationMeToThem = Notifications.findOne({ownerId:theUserId, type:"friend", status:"request", toOwnerId: Meteor.userId() });
				Notifications.update( theNotificationMeToThem._id, {
					$set: {
						"status": "accepted",
					},
				});

				// NOTIFY REQUEST USER
				youUserMeta = UserMeta.findOne({meteorUserId:theUserId});

				Notifications.insert({

					type:"general",
					read:"false",
					message: " accepted your friendship request",

					ownerId: youUserMeta.meteorUserId,
					ownerUsername: Meteor.user().username,
					ownerNameFirst: Meteor.user().profile.nameFirst,
					ownerNameLast: Meteor.user().profile.nameLast,
					toPhoto:meUserMeta.photo,

					timeCreated:parseInt(Date.now()),
					timeUpdated:parseInt(Date.now()),

				});

				Meteor.ServerTools.SendEmail(
					youUserMeta.email,
					Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast + " has accepted your friend request", "<a href='https://youdoer.com/@"+Meteor.user().username+"'><h1><center><img src='"+ meUserMeta.photo +"' width='100%' /><br /><br />"+Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast+"</center></h1><br /><center>has accepted your friend request</center></a>"
				);

				return "friendAccept";
			}


			// CREATE NEW
			// ==========
			var theNotification = Connections.findOne({ownerId:Meteor.userId(), type:theAction, toOwnerId: theUserId});
			if(theNotification){


				if(theAction == "friend"){
					return "friendAlreadyRequested";
				}

				if(theAction == "follow"){

					Connections.remove({_id:theNotification._id});
					return "followRemove";
				}

			}else{

				if(theAction == "friend"){

					// FRIEND
					Connections.insert({

						type:"friend",
						status:"request",

						ownerId: Meteor.userId(),
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						ownerPhoto:meUserMeta.photo,

						toOwnerId: youUserMeta.meteorUserId,
						toUsername: youUserMeta.username,
						toNameFirst: youUserMeta.nameFirst,
						toNameLast: youUserMeta.nameLast,
						toPhoto: youUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});

					// FRIEND
					Connections.insert({

						type:"friend",
						status:"request",

						ownerId: youUserMeta.meteorUserId,
						ownerUsername: youUserMeta.username,
						ownerNameFirst: youUserMeta.nameFirst,
						ownerNameLast: youUserMeta.nameLast,
						ownerPhoto: youUserMeta.photo,

						toOwnerId: Meteor.userId(),
						toUsername: Meteor.user().username,
						toNameFirst: Meteor.user().profile.nameFirst,
						toNameLast: Meteor.user().profile.nameLast,
						toPhoto: meUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});

					// NOTIFY REQUEST USER
					Notifications.insert({

						type:"friend",
						status:"request",
						read:"true",
						direction:"meToThem",

						ownerId: Meteor.userId(),
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						ownerPhoto:meUserMeta.photo,

						toOwnerId: youUserMeta.meteorUserId,
						toUsername: youUserMeta.username,
						toNameFirst: youUserMeta.nameFirst,
						toNameLast: youUserMeta.nameLast,
						toPhoto: youUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});

					// NOTIFY TO USER
					Notifications.insert({

						type:"friend",
						status:"request",
						read:"false",
						direction:"themToMe",

						ownerId: youUserMeta.meteorUserId,
						ownerUsername: youUserMeta.username,
						ownerNameFirst: youUserMeta.nameFirst,
						ownerNameLast: youUserMeta.nameLast,
						ownerPhoto: youUserMeta.photo,

						toOwnerId: Meteor.userId(),
						toUsername: Meteor.user().username,
						toNameFirst: Meteor.user().profile.nameFirst,
						toNameLast: Meteor.user().profile.nameLast,
						toPhoto: meUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});

					Meteor.ServerTools.SendEmail(
						youUserMeta.email,
						Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast + " wants to be your friend", "<a href='https://youdoer.com/@"+Meteor.user().username+"'><h1><center><img src='"+ meUserMeta.photo +"' width='100%' /><br /><br />"+Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast+"</center></h1><br /><center>wants to be your friend!</center></a>"
					);

					// NOTIFY REQUEST USER
					youUserMeta = UserMeta.findOne({meteorUserId:theUserId});

					return "friendRequest";


				}

				if(theAction == "follow"){

					Connections.insert({

						type:"follow",
						status:"accepted",

						ownerId: Meteor.userId(),
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						ownerPhoto:meUserMeta.photo,

						toOwnerId: youUserMeta.meteorUserId,
						toUsername: youUserMeta.username,
						toNameFirst: youUserMeta.nameFirst,
						toNameLast: youUserMeta.nameLast,
						toPhoto: youUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});

					Notifications.insert({

						type:"follow",
						status:"accepted",
						read: "true",

						ownerId: Meteor.userId(),
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						ownerPhoto:meUserMeta.photo,

						toOwnerId: youUserMeta._id,
						toUsername: youUserMeta.username,
						toNameFirst: youUserMeta.nameFirst,
						toNameLast: youUserMeta.nameLast,
						toPhoto: youUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});


					Notifications.insert({

						type:"general",
						read:"false",
						message: " is now following you",

						ownerId: youUserMeta.meteorUserId,
						ownerUsername: Meteor.user().username,
						ownerNameFirst: Meteor.user().profile.nameFirst,
						ownerNameLast: Meteor.user().profile.nameLast,
						toPhoto:meUserMeta.photo,

						timeCreated:parseInt(Date.now()),
						timeUpdated:parseInt(Date.now()),

					});

					Meteor.ServerTools.SendEmail(
						youUserMeta.email,
						Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast + " is now following you", "<a href='https://youdoer.com/@"+Meteor.user().username+"'><h1><center><img src='"+ meUserMeta.photo +"' width='100%' /><br /><br />"+Meteor.user().profile.nameFirst + " " + Meteor.user().profile.nameLast+"</center></h1><br /><center>is now following you</center></a>"
					);

					return "followActive";
				}


			}


			*/


			// TODO: Check for the input user context, so that B may post on to A, in their context!




		},
		///////////////////////////////////////////////

		'unfriendRequest'(
			theUnfriendedUsername
		){

			if( !Meteor.userId()){
				return;
			}
			console.log("Unfriend: "+theUnfriendedUsername+": "+ Meteor.userId());

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});
			var youUserMeta = UserMeta.findOne({username:theUnfriendedUsername});

			// Remove the friendship notification
			Connections.remove({ownerId:Meteor.userId(), type:"friend", status:"accepted", toOwnerId: youUserMeta.MeteorUserId });
			Connections.remove({ownerId:youUserMeta.MeteorUserId, type:"friend", status:"accepted", toOwnerId: Meteor.userId() });

			// NOTIFY SELF (for history)
			Notifications.insert({

				type:"general",
				read:"true",
				message: " is no longer your friend",

				ownerId: Meteor.userId(),
				ownerUsername: youUserMeta.username,
				ownerNameFirst: youUserMeta.nameFirst,
				ownerNameLast: youUserMeta.nameLast,
				toPhoto: youUserMeta.photo,

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			});

			// NOTIFY THEM
			Notifications.insert({

				type:"general",
				read:"false",
				message: " is no longer your friend",

				ownerId: youUserMeta.meteorUserId,
				ownerUsername: Meteor.user().username,
				ownerNameFirst: Meteor.user().profile.nameFirst,
				ownerNameLast: Meteor.user().profile.nameLast,
				toPhoto:meUserMeta.photo,

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			});



		},


	});

}
