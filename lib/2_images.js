// ------
// IMAGES
// ------
const Images = new FilesCollection({
  debug: true,
  collectionName: 'Images',
  storagePath: Meteor.settings.public.file_storage_path+'/_processing',
  allowClientCode: false, // Disallow remove files from Client
  
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 20 && /png|jpe?g/i.test(file.extension)) {
      return true;
    }
	if (file.size <= 1024 * 1024 * 2000 && /mp4|MOV/i.test(file.extension)) {
		return true;
	}
    return 'Photos: 10mb - Videos: 50mb';
  }
  
});

if (Meteor.isServer) {
  Images.denyClient();
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
} else {
  //Meteor.subscribe('files.images.all');
}

export default Images;