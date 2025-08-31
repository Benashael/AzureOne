const sharp = require("sharp");
const { BlobServiceClient } = require("@azure/storage-blob");

const AZURE_STORAGE_CONNECTION_STRING = process.env.AzureWebJobsStorage;

module.exports = async function (context, myBlob) {
    const blobName = context.bindingData.blobName;
    context.log(`📥 Blob trigger - processing file: ${blobName}`);

    try {
        // Connect to Blob Service
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // Define source & destination containers
        const outputContainer = "thumbnails";
        const containerClient = blobServiceClient.getContainerClient(outputContainer);
        await containerClient.createIfNotExists();

        // Resize the image
        const resizedImage = await sharp(myBlob)
            .resize({ width: 200 }) // width fixed, height auto
            .toBuffer();

        // Upload to "thumbnails" container
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(resizedImage, {
            blobHTTPHeaders: { blobContentType: "image/jpeg" }
        });

        context.log(`✅ Successfully uploaded resized image to '${outputContainer}/${blobName}'`);
    } catch (err) {
        context.log.error("❌ Error while processing image:", err.message);
    }
};
