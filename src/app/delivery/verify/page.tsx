'use client'

import { useState, useRef } from 'react'
import { useAuth } from '../../../lib/useAuth'
import { storage, databases, ID } from '../../../lib/appwrite'
import { useRouter } from 'next/navigation'
import BottomDock from '../../../components/BottomDock'
import Image from 'next/image'

export default function VerifyPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [studentCardPreview, setStudentCardPreview] = useState<string>('')
  const [selfiePreview, setSelfiePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const studentCardInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  const handleStudentCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setStudentCardFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setStudentCardPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelfieFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!studentCardFile || !selfieFile) {
      setError('Please upload both images.')
      return
    }

    if (!user) {
      setError('You must be logged in to submit verification.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('Uploading documents...')

    try {
      // Upload student card to Appwrite Storage
      const studentCardUpload = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_BUCKET_ID!,
        ID.unique(),
        studentCardFile
      )

      setMessage('Student card uploaded, uploading selfie...')

      // Upload selfie to Appwrite Storage
      const selfieUpload = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_BUCKET_ID!,
        ID.unique(),
        selfieFile
      )

      setMessage('Creating verification request...')

      // Create verification request document in database
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID!,
        ID.unique(),
        {
          userId: user.$id,
          userName: user.name,
          userEmail: user.email,
          studentCardFileId: studentCardUpload.$id,
          selfieFileId: selfieUpload.$id,
          status: 'pending',
          submittedAt: new Date().toISOString()
        }
      )

      setMessage('✓ Verification request submitted successfully!')
      setTimeout(() => {
        router.push('/delivery')
      }, 2000)

    } catch (err: unknown) {
      console.error('Verification submission error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to submit verification: ${errorMessage}`)
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(to right, #0d47a1, #bbdefb)'}}>
        <div className="text-white text-xl">Please log in to access verification.</div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .background {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(to right, #0d47a1, #bbdefb);
          color: #fff;
          padding: 18px;
          padding-bottom: 100px;
        }

        .verification-card {
          width: 100%;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 32px;
          margin-top: 20px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
          color: #02243a;
        }

        .card-title {
          font-size: 1.75rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 12px;
          color: #034066;
        }

        .card-subtitle {
          text-align: center;
          margin-bottom: 24px;
          color: rgba(2, 36, 58, 0.7);
          font-size: 0.95rem;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #034066;
          font-size: 1rem;
        }

        .upload-area {
          border: 2px dashed rgba(79, 123, 255, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(79, 123, 255, 0.03);
        }

        .upload-area:hover {
          border-color: rgba(79, 123, 255, 0.6);
          background: rgba(79, 123, 255, 0.06);
        }

        .upload-area.has-file {
          border-color: #4caf50;
          background: rgba(76, 175, 80, 0.05);
        }

        .file-input {
          display: none;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .upload-text {
          color: #034066;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .upload-hint {
          color: rgba(2, 36, 58, 0.6);
          font-size: 0.85rem;
        }

        .preview-image {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          margin-top: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(180deg, #4f7bff 0%, #3b5fe6 100%);
          color: #fff;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: transform 0.12s ease, opacity 0.2s;
          box-shadow: 0 8px 20px rgba(79, 123, 255, 0.3);
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          text-align: center;
          margin-top: 16px;
          padding: 12px;
          border-radius: 8px;
          font-weight: 500;
        }

        .message.success {
          background: rgba(76, 175, 80, 0.1);
          color: #2e7d32;
        }

        .message.error {
          background: rgba(244, 67, 54, 0.1);
          color: #c62828;
        }

        .message.info {
          background: rgba(33, 150, 243, 0.1);
          color: #1565c0;
        }

        .info-box {
          background: rgba(255, 193, 7, 0.1);
          border-left: 4px solid #ffc107;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .info-box-title {
          font-weight: 700;
          color: #f57c00;
          margin-bottom: 8px;
        }

        .info-box-text {
          color: rgba(2, 36, 58, 0.8);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 720px) {
          .verification-card {
            padding: 24px;
            max-width: 96%;
          }

          .card-title {
            font-size: 1.4rem;
          }

          .upload-area {
            padding: 20px;
          }
        }
      `}</style>

      <div className="background">
        <div className="verification-card">
          <h1 className="card-title">🎓 Delivery Partner Verification</h1>
          <p className="card-subtitle">
            Submit your documents for manual review by our admin team
          </p>

          <div className="info-box">
            <div className="info-box-title">⚠️ Important Information</div>
            <div className="info-box-text">
              Your verification will be manually reviewed by admins. This process may take 24-48 hours.
              You will receive a notification once your account is approved.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Student Card Photo</label>
              <div 
                className={`upload-area ${studentCardFile ? 'has-file' : ''}`}
                onClick={() => studentCardInputRef.current?.click()}
              >
                <div className="upload-icon">
                  {studentCardFile ? '✓' : '📇'}
                </div>
                <div className="upload-text">
                  {studentCardFile ? studentCardFile.name : 'Click to upload student card'}
                </div>
                <div className="upload-hint">
                  {studentCardFile ? 'Click to change' : 'JPG, PNG or HEIC (max 10MB)'}
                </div>
                {studentCardPreview && (
                  <Image 
                    src={studentCardPreview} 
                    alt="Student card preview" 
                    className="preview-image"
                    width={600}
                    height={200}
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </div>
              <input
                ref={studentCardInputRef}
                type="file"
                accept="image/*"
                className="file-input"
                onChange={handleStudentCardChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Self-Portrait (Selfie)</label>
              <div 
                className={`upload-area ${selfieFile ? 'has-file' : ''}`}
                onClick={() => selfieInputRef.current?.click()}
              >
                <div className="upload-icon">
                  {selfieFile ? '✓' : '🤳'}
                </div>
                <div className="upload-text">
                  {selfieFile ? selfieFile.name : 'Click to upload your selfie'}
                </div>
                <div className="upload-hint">
                  {selfieFile ? 'Click to change' : 'JPG, PNG or HEIC (max 10MB)'}
                </div>
                {selfiePreview && (
                  <Image 
                    src={selfiePreview} 
                    alt="Selfie preview" 
                    className="preview-image"
                    width={600}
                    height={200}
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </div>
              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                className="file-input"
                onChange={handleSelfieChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting || !studentCardFile || !selfieFile}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </button>

            {message && (
              <div className={`message ${error ? 'error' : isSubmitting ? 'info' : 'success'}`}>
                {error || message}
              </div>
            )}
          </form>
        </div>

        <BottomDock role="delivery" />
      </div>
    </>
  )
}
