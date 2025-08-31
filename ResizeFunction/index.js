const Jimp = require("jimp");

module.exports = async function (context, myBlob) {
  context.log("Processing image with Jimp...");

  try {
    const image = await Jimp.read(myBlob);

    // Resize to 200px wide (auto height)
    image.resize(200, Jimp.AUTO);

    // Get buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    // Save resized image to output binding (thumbnails container)
    context.bindings.outputBlob = buffer;

    context.log("Thumbnail created successfully!");
  } catch (err) {
    context.log.error("Error processing image with Jimp:", err);
    throw err;
  }
};
