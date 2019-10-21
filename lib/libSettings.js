if (Meteor.isServer) {



	Meteor.methods({


		'setMessageRowColor'(
			setMessageRowColor
		){


			if( !Meteor.userId() ){
				return;
			}

			var meUserMeta = UserMeta.findOne({ meteorUserId:Meteor.userId() });

			UserMeta.update( meUserMeta._id, {
				$set: {
					"messageRowColor": setMessageRowColor, 
				},
			});

		},


	});

}
