const sharp = require("sharp");

module.exports = async function (context, myBlob) {
    context.log(`Processing blob: ${context.bindingData.name}, Size: ${myBlob.length} bytes`);

    try {
        // Resize the image (example: 200x200 thumbnail)
        const resizedImage = await sharp(myBlob)
            .resize(200, 200, { fit: "inside" })
            .toFormat("jpeg")
            .toBuffer();

        // Save resized image to output binding (resized container)
        context.bindings.outputBlob = resizedImage;

        context.log("Image resized and uploaded successfully!");
    } catch (err) {
        context.log.error("Image resize failed:", err);
        throw err;
    }
};
