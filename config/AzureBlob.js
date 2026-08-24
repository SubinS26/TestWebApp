const fs = require('fs')

/**
 * Uploads a file to Azure Blob Storage using streaming to prevent OOM/memory pressure.
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
    
    // Stream directly from disk without buffering whole file into RAM
    await blockBlobClient.uploadFile(filePath, {
      blobHTTPHeaders: {
        blobContentType: mimetype || 'video/mp4',
      },
    })

    console.log(`[Azure Blob] Successfully streamed ${filename} to container '${containerName}'`)
    return blockBlobClient.url
  } catch (err) {
    console.error('[Azure Blob] Upload error:', err.message)
    return null
  }
}

module.exports = {
  uploadToAzureBlob,
}
