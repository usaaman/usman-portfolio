import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { auth, storage } from '../lib/firebase'

function guessContentType(fileName: string, fallback: string): string {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.pdf')) return 'application/pdf'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  return fallback
}

export function safeStorageFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function ensureStorageAuth(): Promise<void> {
  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to upload files. Please sign in again.')
  }
  await user.getIdToken(true)
}

export function uploadFileWithProgress(
  path: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<string> {
  return ensureStorageAuth().then(
    () =>
      new Promise((resolve, reject) => {
        const storageRef = ref(storage, path)
        const contentType = file.type || guessContentType(file.name, 'application/octet-stream')
        const metadata = { contentType }

        onProgress(1)

        const timeout = window.setTimeout(() => {
          reject(new Error('Upload timed out. Check Firebase Storage rules and your connection.'))
        }, 120_000)

        const finish = (fn: () => void) => {
          window.clearTimeout(timeout)
          fn()
        }

        // Small files: direct upload is more reliable than resumable on some networks
        if (file.size < 8 * 1024 * 1024) {
          onProgress(15)
          uploadBytes(storageRef, file, metadata)
            .then(async (snapshot) => {
              onProgress(90)
              const url = await getDownloadURL(snapshot.ref)
              onProgress(100)
              finish(() => resolve(url))
            })
            .catch((error) => {
              console.error('Storage upload failed:', error)
              finish(() =>
                reject(
                  new Error(
                    error instanceof Error
                      ? error.message
                      : 'Upload failed. Ensure Storage rules are deployed and you are logged in as admin.',
                  ),
                ),
              )
            })
          return
        }

        const task = uploadBytesResumable(storageRef, file, metadata)

        task.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0) {
              const pct = Math.max(
                1,
                Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
              )
              onProgress(pct)
            }
          },
          (error) => {
            console.error('Storage upload failed:', error)
            finish(() =>
              reject(
                new Error(
                  error.message ||
                    'Upload failed. Ensure Storage rules are deployed and you are logged in as admin.',
                ),
              ),
            )
          },
          async () => {
            try {
              const url = await getDownloadURL(task.snapshot.ref)
              onProgress(100)
              finish(() => resolve(url))
            } catch (error) {
              finish(() => reject(error))
            }
          },
        )
      }),
  )
}
