const sharp = require("sharp");

module.exports = async function (context, myBlob) {
    const blobName = context.bindingData.blobName;
    context.log(`📥 Processing file: ${blobName}`);

    try {
        // Resize image (200px wide, maintain aspect ratio)
        const resized = await sharp(myBlob)
            .resize({ width: 200 })
            .jpeg()
            .toBuffer();

        // Send output to thumbnails/{blobName}
        context.bindings.outputBlob = resizedImage;

        context.log(`✅ Resized image saved as thumbnails/${blobName}`);
    } catch (err) {
        context.log.error("❌ Image processing failed:", err.message);
    }
};
