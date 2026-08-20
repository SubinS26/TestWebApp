const fs = require('fs')

/**
 * Uploads a file to Azure Blob Storage if AZURE_STORAGE_CONNECTION_STRING is configured.
 * 
 * Environment variables:
 * - AZURE_STORAGE_CONNECTION_STRING: Primary connection string from Azure portal
 * - AZURE_STORAGE_CONTAINER: Container name (default: 'posts')
 * 
 * @param {string} filePath Local file path to read
 * @param {string} filename Destination blob name
 * @param {string} mimetype Content MIME type
 * @returns {Promise<string|null>} Azure Blob URL if uploaded, or null
 */
async function uploadToAzureBlob(filePath, filename, mimetype) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  const containerName = process.env.AZURE_STORAGE_CONTAINER || 'posts'

  if (!connectionString) {
    console.log('[Azure Blob] AZURE_STORAGE_CONNECTION_STRING not set. Using local storage.')
    return null
  }

  try {
    const { BlobServiceClient } = require('@azure/storage-blob')
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)
    
    await containerClient.createIfNotExists({
      access: 'blob',
    })

    const blockBlobClient = containerClient.getBlockBlobClient(filename)
    const fileBuffer = fs.readFileSync(filePath)

    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: {
        blobContentType: mimetype || 'video/mp4',
      },
    })

    console.log(`[Azure Blob] Successfully uploaded ${filename} to container '${containerName}'`)
    return blockBlobClient.url
  } catch (err) {
    console.error('[Azure Blob] Upload error:', err.message)
    return null
  }
}

module.exports = {
  uploadToAzureBlob,
}
