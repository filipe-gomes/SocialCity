if (Meteor.isServer) {

	import fs from 'fs-extra';

	var storageRoot = Meteor.settings.public.file_storage_path;
	var storageProcessing = Meteor.settings.public.file_storage_path+'/_processing';

	Meteor.publish('findTopic', function( theTopicUrl ) {

			console.log("------- Topic: "+ theTopicUrl);

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});

			var theTopic = Topics.find({ title: theTopicUrl });
			return theTopic;

			/*
			var isFriend = false;
			meUserMeta.friends.forEach(function(theFriendId){

				//console.log(theFriendId +" = "+ youUserMeta.meteorUserId);

				if( theFriendId == youUserMeta.meteorUserId ){
					isFriend = true;
				}

			});
			*/




	});

	Meteor.methods({

		'createTopic'(
			uiTopicTitle,
			theMessage,
			uiThePrivacy,
			uiTopic18Only,
			uiTopic1Graphic,
		){

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});

			console.log("ADDING TOPIC: " + uiTopicTitle);

			Topics.insert({

				ownerId: Meteor.userId(),
				ownerUsername: Meteor.user().username,
				ownerNameFirst: Meteor.user().profile.nameFirst,
				ownerNameLast: Meteor.user().profile.nameLast,

				title:uiTopicTitle,
				message:theMessage,

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

				stars:0,
				starers:[],

				commentsCount:0,
				comments:[],
				subscribersCount:0,

				moderators:[
					Meteor.userId(),
				],

			});

			// Subscribe the user
			UserMeta.update( meUserMeta._id, {
				$push: { topics:uiTopicTitle },
			});

		},

		'subscribeTopic'(theTopic){

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});

			UserMeta.update(meUserMeta._id, {
				$push: { topics:theTopic },
			});

		},

		'unsubscribeTopic'(theTopic){

			var meUserMeta = UserMeta.findOne({meteorUserId:Meteor.userId()});

			UserMeta.update(meUserMeta._id, {
				$pull: { topics:theTopic },
			});

		},

	});


}
