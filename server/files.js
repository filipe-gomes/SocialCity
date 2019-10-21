import fs from 'fs-extra';
import graphicsMagick from 'gm';
import ffmpeg from 'ffmpeg';

import Images from '/lib/2_images.js';

const bound = Meteor.bindEnvironment((callback) => {
    return callback();
});

Images.on('afterUpload', function(fileRef) {


	// Fetch the user Meta first
	// We will use the temporary post ID's to upload these photos
	// Will ensure a nice clean filesystem
	// ------------------
	var theUserMeta = UserMeta.findOne({meteorUserId:fileRef.userId});
	var theGroupMeta = "";

    if( fileRef.meta.page == "group" ){
		theGroupMeta = Groups.findOne({ _id:fileRef.meta.theId });
	}

    if( fileRef.meta.page == "topic" ){
		theTopicMeta = Topics.findOne({ _id:fileRef.meta.theId });
	}


	// Begin FS
	// -----------------
	var mediaType = fileRef.meta.mediaType;
	console.log("-------------------------------------- USER IS UPLOADING AN IMAGE: "+fileRef.userId +" AN: " +mediaType);
	console.log(fileRef.meta);

	var storageRoot = Meteor.settings.public.file_storage_path;
	var storageProcessing = Meteor.settings.public.file_storage_path+'/_processing';

	const image = graphicsMagick(fileRef.path);

	// CHECK: data-type passed in from HTML to determine file location in:
	// We want to explicitly set this, we do not trust values coming in from the client here on the server. Someone could fill us right up.



	// Set Media Type Pathing
	var theMediaTypePath = "/users/"+fileRef.userId+"/";
	var theDirectory = "";

	// USERS
	// ------------------------------------------------------------

	// Profile
	theDirectory = storageRoot+"/users/"+fileRef.userId+"/profile";
	fs.ensureDir(theDirectory);

	// Cover
	theDirectory = storageRoot+"/users/"+fileRef.userId+"/cover";
	fs.ensureDir(theDirectory);

	// Posts
	theDirectory = storageRoot+"/users/"+fileRef.userId+"/posts";
	fs.ensureDir(theDirectory);

	theDirectory = storageRoot+"/users/"+fileRef.userId+"/posts/"+theUserMeta.tempPost;
	fs.ensureDir(theDirectory);

	// Gallery
	theDirectory = storageRoot+"/users/"+fileRef.userId+"/gallery";
	fs.ensureDir(theDirectory);


    // TOPICS
	// ------------------------------------------------------------
	if( fileRef.meta.page == "topic" ){

        theMediaTypePath = "/topics/"+fileRef.meta.theId+"/";

        // Profile
		theDirectory = storageRoot+"/topics/"+fileRef.meta.theId+"/profile";
		fs.ensureDir(theDirectory);

        // Cover
		theDirectory = storageRoot+"/topics/"+fileRef.meta.theId+"/cover";
		fs.ensureDir(theDirectory);

	}


	// GROUPS
	// ------------------------------------------------------------
	if( fileRef.meta.page == "group" ){

		theMediaTypePath = "/groups/"+fileRef.meta.theId+"/";

		// Cover
		theDirectory = storageRoot+"/groups/"+fileRef.meta.theId+"/cover";
		fs.ensureDir(theDirectory);

		// Posts
		theDirectory = storageRoot+"/groups/"+fileRef.meta.theId+"/posts";
		fs.ensureDir(theDirectory);

		theDirectory = storageRoot+"/groups/"+fileRef.meta.theId+"/posts/"+theUserMeta.tempPost;
		fs.ensureDir(theDirectory);

		// Gallery
		theDirectory = storageRoot+"/groups/"+fileRef.meta.theId+"/gallery";
		fs.ensureDir(theDirectory);
	}


    console.log(fileRef);

	// PNG, JPG and JPEG files
    if (/png|jpe?g/i.test(fileRef.extension || '')) {

        fs.exists(fileRef.path, (exists) => {
            bound(() => {

                if (!exists) {
                    throw Meteor.log.error('Original file was not found: ' + fileRef.path);
                }

				// COMPRESS IMAGE (large)
				// --------------
                image.size((error, features) => {
                    bound(() => {
                        if (error) {
                            console.error('[_app.createLarge] [_.each sizes]', error);
                            graphicsMagick && graphicsMagick(Meteor.Error('[_app.createLarge] [image.size]', error));
                            return;
                        }

                        var path = storageRoot + theMediaTypePath+mediaType+'/large-' + fileRef._id +".jpg";
						if( mediaType == "posts" ){
							path = storageRoot + theMediaTypePath+mediaType+'/'+theUserMeta.tempPost+'/large-' + fileRef._id +".jpg";
						}
						if( mediaType == "gallery" ){
							path = storageRoot + theMediaTypePath+mediaType+'/'+theUserMeta.tempPost+'/large-' + fileRef._id +".jpg";
						}

                        const img = graphicsMagick(fileRef.path)
                            .quality(70)
                            .define('filter:support=2')
                            .define('jpeg:fancy-upsampling=false')
                            .define('jpeg:fancy-upsampling=off')
                            .define('png:compression-filter=5')
                            .define('png:compression-level=9')
                            .define('png:compression-strategy=1')
                            .define('png:exclude-chunk=all')
                            .autoOrient()
                            .noProfile()
                            .strip()
                            .dither(false)
                            .interlace('Line')
                            .filter('Triangle');

                        // Change width and height proportionally
                        img.resize(1500).interlace('Line').setFormat("jpg").write(path, (resizeError) => {
                            bound(() => {
                                if (resizeError) {
                                    console.error('[createLarge] [img.resize]', resizeError);
                                    graphicsMagick && graphicsMagick(resizeError);
                                    return;
                                }

                                fs.stat(path, (fsStatError, stat) => {
                                    bound(() => {
                                        if (fsStatError) {
                                            console.error('[_app.createLarge] [img.resize] [fs.stat]', fsStatError);
                                            graphicsMagick && graphicsMagick(fsStatError);
                                            return;
                                        }

                                        graphicsMagick(path).size((graphicsMagickSizeError, imgInfo) => {
                                            bound(() => {
                                                if (graphicsMagickSizeError) {
                                                    //console.error('[_app.createLarge] [_.each sizes] [img.resize] [fs.stat] [graphicsMagick(path).size]', graphicsMagickSizeError);
                                                    graphicsMagick && graphicsMagick(graphicsMagickSizeError);
                                                    return;
                                                }

                                                fileRef.versions.large = {
                                                    path: path,
                                                    size: stat.size,
                                                    type: fileRef.type,
                                                    extension: fileRef.extension,
                                                    meta: {
                                                        width: imgInfo.width,
                                                        height: imgInfo.height
                                                    }
                                                };

                                                const upd = {
                                                    $set: {}
                                                };
                                                upd['$set']['versions.large'] = fileRef.versions.large;

                                                Images.update(fileRef._id, upd, (colUpdError) => {
                                                    if (graphicsMagick) {
                                                        if (colUpdError) {
                                                            graphicsMagick(colUpdError);
                                                        } else {
                                                            graphicsMagick(void 0, fileRef);
                                                        }
                                                    }
                                                });

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
				// END CREATE LARGE
				// -----------------


            });

        });

    }else{
        console.log("NOT VALID JPG");
    }

	// ==========================================
	//
	// VIDEO
	//
	// ==========================================
    if (/mp4|MOV/i.test(fileRef.extension || '')) {

        fs.exists(fileRef.path, (exists) => {
            bound(() => {
                if (!exists) {
                    throw Meteor.log.error('Original file was not found: ' + fileRef.path);
                }

				console.log("###################### VIDEO FILE IS PROCESSING!");

				// TODO: add individual post support
				path = storageRoot + '/users/'+fileRef.userId+'/gallery/'+theUserMeta.tempPost+'/large-' + fileRef._id+".mp4";

				/*
				var path = storageRoot + theMediaTypePath+mediaType+'/large-' + fileRef._id +".jpg";
				if( mediaType == "posts" ){
					path = storageRoot + theMediaTypePath+mediaType+'/'+theUserMeta.tempPost+'/large-' + fileRef._id +".jpg";
				}
				if( mediaType == "gallery" ){
					path = storageRoot + theMediaTypePath+mediaType+'/'+theUserMeta.tempPost+'/large-' + fileRef._id +".jpg";
				}
				*/


				try {

					var process = new ffmpeg(fileRef.path);
					process.then(function (video) {

						/* SETTINGS: https://superuser.com/questions/490683/cheat-sheets-and-presets-settings-that-actually-work-with-ffmpeg-1-0
						CRF,Preset,Seconds,score,MB,score,totalscore
						18,1_ultrafast,5.7,1.00,59.5,0.09,1.09
						18,2_superfast,8.4,0.98,62.3,0.00,0.98
						18,3_veryfast,10.8,0.97,30.9,0.98,1.94
						18,4_faster,16.0,0.93,33.5,0.89,1.83
						18,5_fast,24.0,0.88,36.8,0.79,1.68
						18,6_medium,29.1,0.85,34.9,0.85,1.70
						18,7_slow,48.1,0.73,33.9,0.88,1.61
						18,8_slower,84.9,0.49,33.0,0.91,1.40
						18,9_veryslow,162.0,0.00,30.1,1.00,1.00
						21,1_ultrafast,5.7,1.00,38.0,0.00,1.00
						21,2_superfast,7.9,0.98,35.0,0.15,1.14
						21,3_veryfast,10.0,0.97,19.0,0.97,1.94
						21,4_faster,14.2,0.94,21.0,0.87,1.80
						21,5_fast,19.9,0.89,23.0,0.77,1.66
						21,6_medium,24.6,0.86,22.0,0.82,1.67
						21,7_slow,43.1,0.72,21.0,0.87,1.58
						21,8_slower,69.8,0.51,20.5,0.89,1.41
						21,9_veryslow,137.3,0.00,18.4,1.00,1.00
						24,1_ultrafast,5.5,1.00,24.9,0.00,1.00
						24,2_superfast,7.5,0.98,21.4,0.27,1.25
						24,3_veryfast,9.3,0.97,12.0,0.99,1.96
						24,4_faster,13.2,0.93,14.0,0.84,1.77
						24,5_fast,17.4,0.90,15.0,0.76,1.66
						24,6_medium,21.0,0.87,14.4,0.81,1.67
						24,7_slow,37.3,0.72,14.0,0.84,1.56
						24,8_slower,62.2,0.51,13.0,0.92,1.42
						24,9_veryslow,121.1,0.00,11.9,1.00,1.00
						27,1_ultrafast,5.5,1.00,16.8,0.00,1.00
						27,2_superfast,7.4,0.98,13.6,0.38,1.36
						27,3_veryfast,9.0,0.97,8.4,1.00,1.97
						27,4_faster,12.6,0.93,10.1,0.80,1.73
						27,5_fast,15.8,0.90,10.4,0.76,1.66
						27,6_medium,18.8,0.87,10.0,0.81,1.68
						27,7_slow,34.1,0.73,9.8,0.83,1.56
						27,8_slower,59.6,0.48,9.0,0.93,1.41
						27,9_veryslow,109.7,0.00,8.4,1.00,1.00
						*/

						video.addCommand('-preset', 'veryfast');
						video.addCommand('-crf', '27');
						video.addCommand('-c:v', 'libx264');
						video.addCommand('-f', 'mp4');
						video.addCommand('-profile:v', 'main');
						video.addCommand('-acodec', 'aac');

						video.addCommand('-movflags', '+faststart');



						//video.addCommand('-f', 'avi');
						//video.addCommand('-vcodec','libvpx');
						/*

						video.addCommand('-g', '120');
						video.addCommand('-lag-in-frames', '16');
						video.addCommand('-deadline', 'good');
						video.addCommand('-cpu-used', '0');
						video.addCommand('-vprofile', '0');
						video.addCommand('-qmax', '51');
						video.addCommand('-qmin', '11');
						video.addCommand('-slices', '4');
						video.addCommand('-b:a', '2M');

						video.addCommand('-maxrate', '24M');
						video.addCommand('-minrate', '100k');
						video.addCommand('-auto-alt-ref', '1');
						video.addCommand('-arnr-maxframes', '7');
						video.addCommand('-arnr-strength', '5');
						video.addCommand('-arnr-type', 'centered');
						*/

						video
						.save(path, function (error, file) {
							if(!error){
								console.log('Video file: ' + file);
								console.log(file);
								console.log("###################### VIDEO FILE IS DONE!");
							}else{
								console.log("########### VIDEO ERROR ############");
								console.log("########### VIDEO ERROR ############");
								console.log("########### VIDEO ERROR ############");
								console.log(error);

							}
						});

						video.fnExtractFrameToJPG(storageRoot + '/users/'+fileRef.userId+'/gallery/'+theUserMeta.tempPost+'/', {
							frame_rate : 1,
							number : 1,
							file_name : "large-"+fileRef._id+".jpg"
						})

					}, function (err) {
						console.log('Error: ' + err);
					});
				} catch (e) {

					console.log("########### VIDEO FAIL ############");
					console.log("########### VIDEO FAIL ############");
					console.log("########### VIDEO FAIL ############");
					console.log(e.code);
					console.log(e.msg);
				}

            });

        });

    }










	// INSERT DATABASE OBJECT
	// ======================

	if( fileRef.extension == "jpeg"){
		fileRef.extension = "jpg";
	}
	if( fileRef.extension == "MOV" || fileRef.extension == "mov"){
		fileRef.extension = "mp4";
	}

	// PROFILE
	// -------
	if( mediaType == "profile" ){

		PhotosProfile.insert({

			status:"active",

			ownerId:fileRef.userId,
			ownerUsername:theUserMeta.username,

			fileId: fileRef._id,
			extension: fileRef.extension,

			timeCreated:parseInt(Date.now()),
			timeUpdated:parseInt(Date.now()),

		});

		Meteor.setTimeout(function(){

			//console.log("---- CREATING POST: friending: " + theUserMeta._id );
			//Meteor.call("createPost", 'friending', theUserMeta._id, 'created new profile photo!' );


			Posts.insert({

				ownerId: theUserMeta.meteorUserId,
				ownerUsername: theUserMeta.username,
				ownerNameFirst: theUserMeta.nameFirst,
				ownerNameLast: theUserMeta.nameLast,
				ownerPhoto: theUserMeta.photo,

				temp:false,

				contextType: 'friending',
				contextId: theUserMeta._id,
				message:"<p>Updated my profile photo</p><p><img src='//"+Meteor.settings.public.cdnPath+"/users/"+fileRef.userId+"/profile/large-"+fileRef._id+".jpg' onerror='imageError(this);'/></p>",

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			});

			//console.log("---- PROFILE IMAGE IS UPDATING: " + fileRef.userId + " : " + fileRef._id );

			// UserMeta
			// --------------------------------------
			UserMeta.update( {meteorUserId:fileRef.userId}, {
				$set: {
					"photo": fileRef._id,
				},
			}, {multi: true});

			// Notifications
			// --------------------------------------
			Notifications.update( {ownerId:fileRef.userId}, {
				$set: {
					"ownerPhoto": fileRef._id,
				},
			}, {multi: true});


			// Posts
			// --------------------------------------
			Posts.update( {ownerId:fileRef.userId}, {
				$set: {
					"ownerPhoto": fileRef._id,
				},
			}, {multi: true});

			// Comments
			// --------------------------------------
			Comments.update( {ownerId:fileRef.userId}, {
				$set: {
					"ownerPhoto": fileRef._id,
				},
			}, {multi: true});

			// Connections
			// --------------------------------------
			Connections.update( {ownerId:fileRef.userId}, {
				$set: {
					"ownerPhoto": fileRef._id,
				},
			}, {multi: true});
			Connections.update( {toOwnerId:fileRef.userId}, {
				$set: {
					"toPhoto": fileRef._id,
				},
			}, {multi: true});

			// Chats
			// --------------------------------------
			Chats.update( {ownerId:fileRef.userId}, {
				$set: {
					"ownerPhoto": fileRef._id,
				},
			}, {multi: true});
			Chats.update( {toOwnerId:fileRef.userId}, {
				$set: {
					"toPhoto": fileRef._id,
				},
			}, {multi: true});

			// ChatMessages
			// --------------------------------------
			ChatMessages.update( {ownerId:fileRef.userId}, {
				$set: {
					"ownerPhoto": fileRef._id,
				},
			}, {multi: true});
			ChatMessages.update( {toOwnerId:fileRef.userId}, {
				$set: {
					"toPhoto": fileRef._id,
				},
			}, {multi: true});

			// Activities
			// --------------------------------------
			Activities.update( {ownerId:fileRef.userId}, {
				$set: {
					"ownerPhoto": fileRef._id,
				},
			}, {multi: true});

			// Groups
			// --------------------------------------
			Groups.update( {ownerId:fileRef.userId}, {
				$set: {
					"ownerPhoto": fileRef._id,
				},
			}, {multi: true});


		},3000);

	}

	// COVER
	// -------
	if( mediaType == "cover" ){

        if( fileRef.meta.page == "social" ){

			PhotosCover.insert({

				status:"active",

				ownerId:fileRef.userId,
				ownerUsername:theUserMeta.username,

				fileId: fileRef._id,
				extension: fileRef.extension,

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			});

			Posts.insert({

				ownerId: theUserMeta.meteorUserId,
				ownerUsername: theUserMeta.username,
				ownerNameFirst: theUserMeta.nameFirst,
				ownerNameLast: theUserMeta.nameLast,
				ownerPhoto: theUserMeta.photo,

				temp:false,

				contextType: 'social',
				contextId: theUserMeta._id,
				message:"<p>Updated my cover photo</p><p><img src='//"+Meteor.settings.public.cdnPath+"/users/"+fileRef.userId+"/cover/large-"+fileRef._id+".jpg' onerror='imageError(this);' /></p>",

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			});

			Meteor.setTimeout(function(){
				//console.log("_____ PROFILE IMAGE IS UPDATING: " + fileRef.userId + " : " + fileRef._id );
				UserMeta.update( {meteorUserId:fileRef.userId}, {
					$set: {
						"photoCover": fileRef._id,
					},
				});
			},3000);

		}

        if( fileRef.meta.page == "topic" ){

			PhotosCover.insert({

				status:"active",

				topicId:fileRef.meta.theId,

				fileId: fileRef._id,
				extension: fileRef.extension,

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			});


			Meteor.setTimeout(function(){
				//console.log("_____ PROFILE IMAGE IS UPDATING: " + fileRef.userId + " : " + fileRef._id );
				Topics.update( {_id:theTopicMeta._id}, {
					$set: {
						"photoCover": fileRef._id,
					},
				});
			},3000);

		}


		if( fileRef.meta.page == "group" ){

			PhotosCover.insert({

				status:"active",

				groupId:fileRef.meta.theId,

				fileId: fileRef._id,
				extension: fileRef.extension,

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			});

			Posts.insert({

				ownerId: theGroupMeta._id,
				ownerUsername: theGroupMeta.title,
				ownerPhoto: theGroupMeta.photo,

				temp:false,

				type: 'group',
				message:"<p>Updated our cover photo</p><p><img src='//"+Meteor.settings.public.cdnPath+"/groups/"+theGroupMeta._id+"/cover/large-"+fileRef._id+".jpg' onerror='imageError(this);' /></p>",

				timeCreated:parseInt(Date.now()),
				timeUpdated:parseInt(Date.now()),

			});

			Meteor.setTimeout(function(){
				//console.log("_____ PROFILE IMAGE IS UPDATING: " + fileRef.userId + " : " + fileRef._id );
				Groups.update( {_id:theGroupMeta._id}, {
					$set: {
						"photoCover": fileRef._id,
					},
				});
			},3000);

		}



	}


	// GALLERY
	// -------
	if( mediaType == "gallery" ){

		//console.log("GALLERY UPLAOD IS COMPLETE");

		Galleries.insert({

			ownerId: theUserMeta.meteorUserId,
			ownerUsername: theUserMeta.username,
			ownerNameFirst: theUserMeta.nameFirst,
			ownerNameLast: theUserMeta.nameLast,
			ownerPhoto: theUserMeta.photo,

			parentPostId: theUserMeta.tempPost,

			fileId:fileRef._id,
			extension: fileRef.extension,

			timeCreated:parseInt(Date.now()),
			timeUpdated:parseInt(Date.now()),

		});

	}



	// REMOVE BIG FAT ORIGINAL FILE
	// ============================
	setTimeout(function(){
		//console.log("____________________ REMOVING PROCESSING IMAGE: " + fileRef.path);
		fs.remove(fileRef.path);
	},60000);

});
