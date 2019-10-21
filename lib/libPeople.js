if (Meteor.isServer) {

	Meteor.publish('peopleSearch', function( search ) {
		
		console.log("SEARCHING FOR PEOPLE");

		if(!search){
			var peoples = UserMeta.find({}, {sort: { timeUpdated: -1 }, limit: 1000});
		}

		if(search){

			var pieces = search.split(" ");

			console.log("SEARCH PIECES = " + pieces.length);

			if(pieces.length == 1){

				var peoples = UserMeta.find({
					
					$or:[
						{nameFirst:{$regex : new RegExp(search, "i")}},
						{nameLast:{$regex : new RegExp(search, "i")}}
					]

				}, {
					sort: { timeUpdated: -1 }, limit: 1000
				});



			}

			if(pieces.length == 2){

				var peoples = UserMeta.find({

						$and:[
							{nameFirst:{$regex : new RegExp(pieces[0], "i")}},
							{nameLast:{$regex : new RegExp(pieces[1], "i")}}
						]

					}, {
						sort: { timeUpdated: -1 }, limit: 1000
					}
				);

			}

		}

		console.log("RETURNING: ");
		//console.log(peoples);
		
		return peoples;
		
	});

	Meteor.methods({



	});

}
