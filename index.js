const sharp = require("sharp");
const { BlobServiceClient } = require("@azure/storage-blob");

const AZURE_STORAGE_CONNECTION_STRING = process.env.AzureWebJobsStorage;

module.exports = async function (context, myBlob) {
    context.log("Blob trigger function processed:", context.bindingData.blobTrigger);

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        const outputContainer = "thumbnails";
        const containerClient = blobServiceClient.getContainerClient(outputContainer);
        await containerClient.createIfNotExists();

        const resizedImage = await sharp(myBlob).resize(200).toBuffer();

        const blockBlobClient = containerClient.getBlockBlobClient(context.bindingData.blobName);
        await blockBlobClient.uploadData(resizedImage, {
            blobHTTPHeaders: { blobContentType: "image/jpeg" }
        });

        context.log(`✅ Resized image uploaded to '${outputContainer}/${context.bindingData.blobName}'`);
    } catch (err) {
        context.log.error("❌ Error resizing image:", err.message);
    }
};
