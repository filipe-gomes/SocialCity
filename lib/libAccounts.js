
if (Meteor.isServer) {

	import fs from 'fs-extra';

	// have to setit up like this, I guess we're completely overrideing?
	Accounts.onCreateUser(function(options, user) {

		console.log('New account created!');

		console.log(user);
		user.profile = options.profile;

		var storageRoot = Meteor.settings.public.file_storage_path;
		var storageProcessing = Meteor.settings.public.file_storage_path+'/_processing';

		// CREATE DIRECTORIES
		var theDirectory = "";

		// Profile Directory
		theDirectory = storageRoot+"/users/"+user._id+"/profile";
		fs.ensureDir(theDirectory);

		// Cover Directory
		theDirectory = storageRoot+"/users/"+user._id+"/cover";
		fs.ensureDir(theDirectory);

		var randomPhoto = Math.floor(Math.random() * 20) + 1;
		var randomPhotoCover = Math.floor(Math.random() * 4) + 1;

		// Move profile photos
		fs.copy(storageRoot+'/default/medium-defaultUser ('+randomPhoto+').jpg', storageRoot+'/users/'+user._id+'/profile/small-defaultUser ('+randomPhoto+').jpg')
		  .then(() => console.log('success!'))
		  .catch(err => console.error(err));
		fs.copy(storageRoot+'/default/medium-defaultUser ('+randomPhoto+').jpg', storageRoot+'/users/'+user._id+'/profile/medium-defaultUser ('+randomPhoto+').jpg')
		  .then(() => console.log('success!'))
		  .catch(err => console.error(err));
		fs.copy(storageRoot+'/default/medium-defaultUser ('+randomPhoto+').jpg', storageRoot+'/users/'+user._id+'/profile/large-defaultUser ('+randomPhoto+').jpg')
		  .then(() => console.log('success!'))
		  .catch(err => console.error(err));

		// Move cover
	    fs.copy(storageRoot+'/default/medium-defaultCover ('+randomPhotoCover+').jpg', storageRoot+'/users/'+user._id+'/cover/small-defaultCover ('+randomPhotoCover+').jpg')
		  .then(() => console.log('success!'))
		  .catch(err => console.error(err));
		fs.copy(storageRoot+'/default/medium-defaultCover ('+randomPhotoCover+').jpg', storageRoot+'/users/'+user._id+'/cover/medium-defaultCover ('+randomPhotoCover+').jpg')
		  .then(() => console.log('success!'))
		  .catch(err => console.error(err));
		fs.copy(storageRoot+'/default/medium-defaultCover ('+randomPhotoCover+').jpg', storageRoot+'/users/'+user._id+'/cover/large-defaultCover ('+randomPhotoCover+').jpg')
		  .then(() => console.log('success!'))
		  .catch(err => console.error(err));


		UserMeta.insert({
			meteorUserId:user._id,
			photo:"defaultUser ("+randomPhoto+")",
			photoCover:"defaultCover ("+randomPhotoCover+")",
			username:user.username,
			nameFirst:user.profile.nameFirst,
			nameLast:user.profile.nameLast,
			email:user.emails[0].address,
			age:"",
			address:"",
			address2:"",
			city:"",
			province:"",
			postal:"",
			country:"",

			stars:0,

			friends:[],
			friendsRequest:[],
			followers:[],
			following:[],

			topics:[
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
			],

			notificationsCountSocial:0,
			notificationsCountMessages:0,
			notificationsCountPayment:0,

			messageRowColor:"grey",

		});
		var theUserMeta = UserMeta.findOne({meteorUserId:user._id});

		// Insert Profile Photo
		PhotosProfile.insert({

			status:"active",

			ownerId:user._id,
			ownerUsername:user.username,

			fileId: "defaultUser ("+randomPhoto+")",

			timeCreated:parseInt(Date.now()),
			timeUpdated:parseInt(Date.now()),

		});

		// Insert Cover Photo
		PhotosCover.insert({

			status:"active",

			ownerId:user._id,
			ownerUsername:user.username,

			fileId: "defaultCover ("+randomPhotoCover+")",

			timeCreated:parseInt(Date.now()),
			timeUpdated:parseInt(Date.now()),

		});


		// Insert new post for cakeDay
		Posts.insert({

			ownerId: user._id,
			ownerUsername: user.username,
			ownerNameFirst: user.profile.nameFirst,
			ownerNameLast: user.profile.nameLast,
			ownerPhoto: "defaultUser ("+randomPhoto+")",

			contextType: 'social',
			contextId: theUserMeta._id,
			message:"<p>I just signed up!</p><p><img src='//"+Meteor.settings.public.cdnPath+"/users/"+user._id+"/profile/medium-defaultUser ("+randomPhoto+").jpg' /></p>",

			cakeDay:true,
			timeCreated:parseInt(Date.now()),
			timeUpdated:parseInt(Date.now()),

		});


		if (options.profile){
            user.profile = options.profile;
			return user;
		}


		// So we must also manually publish the data
		Meteor.publish("userData", function () {
			return Meteor.users.find({}, {sort: {'score': -1}});
		});

	});

}
