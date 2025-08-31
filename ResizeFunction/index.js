const sharp = require("sharp");

module.exports = async function (context, myBlob) {
    const blobName = context.bindingData.name;
    context.log(`Processing blob: ${blobName}, Size: ${myBlob ? myBlob.length : 0} bytes`);

    // Check if blob exists
    if (!myBlob || myBlob.length === 0) {
        context.log.error(`Blob ${blobName} is missing or empty.`);
        return;
    }

    try {
        // Resize the image to 200x200 (fit inside)
        const resizedImage = await sharp(myBlob)
            .resize(200, 200, { fit: "inside" })
            .toFormat("jpeg") // convert to jpeg
            .toBuffer();

        // Save resized image to output container
        context.bindings.outputBlob = resizedImage;

        context.log(`Image ${blobName} resized and uploaded successfully!`);
    } catch (err) {
        context.log.error(`Failed to resize blob ${blobName}:`, err);
    }
};
