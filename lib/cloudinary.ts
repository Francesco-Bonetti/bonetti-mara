import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = 'paintings'
): Promise<{ url: string; thumbUrl: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) return reject(error)
          const thumbUrl = cloudinary.url(result.public_id, {
            width: 800,
            height: 800,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          })
          resolve({ url: result.secure_url, thumbUrl, publicId: result.public_id })
        }
      )
      .end(fileBuffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export default cloudinary
