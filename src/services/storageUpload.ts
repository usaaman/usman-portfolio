export function safeStorageFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export function uploadFileWithProgress(
  path: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    return Promise.reject(
      new Error('Cloudinary is not configured. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'),
    )
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', path.substring(0, path.lastIndexOf('/')) || 'portfolio')

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const resourceType = isPdf ? 'raw' : 'image'

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(Math.max(1, percent))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          onProgress(100)
          resolve(data.secure_url as string)
        } catch {
          reject(new Error('Failed to parse Cloudinary response.'))
        }
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.responseText}`))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload. Check your connection.'))

    xhr.send(formData)
  })
}

export async function ensureStorageAuth(): Promise<void> {
  return Promise.resolve()
}