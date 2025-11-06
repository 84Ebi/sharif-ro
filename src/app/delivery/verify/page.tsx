'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { storage, databases, ID } from '../../../lib/appwrite'
import { useRouter } from 'next/navigation'
import BottomDock from '../../../components/BottomDock'
import Image from 'next/image'
import { Query } from 'appwrite'
import { useI18n } from '@/lib/i18n'

// Bucket ID for verification images
const VERIFICATION_BUCKET_ID = '6909fd2600093086c95b'

export default function VerifyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useI18n()
  
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [studentCardPreview, setStudentCardPreview] = useState<string>('')
  const [selfiePreview, setSelfiePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [hasExistingVerification, setHasExistingVerification] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<string>('')

  const studentCardInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  // Check for existing verification
  useEffect(() => {
    const checkExistingVerification = async () => {
      if (!user) return
      
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID!,
          [Query.equal('userId', user.$id)]
        )
        
        if (response.documents.length > 0) {
          const latestVerification = response.documents[0]
          setHasExistingVerification(true)
          setVerificationStatus(latestVerification.status || 'pending')
        }
      } catch (err) {
        console.error('Error checking verification status:', err)
      }
    }
    
    checkExistingVerification()
  }, [user])

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
      setError(t('verify.need_both'))
      return
    }

    if (!user) {
      setError(t('verify.must_login'))
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage(t('verify.uploading'))

    try {
      // Upload student card to Appwrite Storage with auto-generated ID
      const studentCardUpload = await storage.createFile(
        VERIFICATION_BUCKET_ID,
        ID.unique(), // Let Appwrite generate a valid unique ID
        studentCardFile
      )

      setMessage(t('verify.student_uploaded'))

      // Upload selfie to Appwrite Storage with auto-generated ID
      const selfieUpload = await storage.createFile(
        VERIFICATION_BUCKET_ID,
        ID.unique(), // Let Appwrite generate a valid unique ID
        selfieFile
      )

      setMessage(t('verify.creating_request'))

      // Create verification request document in database
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID!,
        ID.unique(),
        {
          userId: user.$id,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone || '',
          studentCardFileId: studentCardUpload.$id,
          selfieFileId: selfieUpload.$id,
          bucketId: VERIFICATION_BUCKET_ID,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
          reviewedBy: null,
          reviewNotes: null
        }
      )

      setMessage(t('verify.success'))
      setHasExistingVerification(true)
      setVerificationStatus('pending')
      
      setTimeout(() => {
        router.push('/delivery')
      }, 2000)

    } catch (err: unknown) {
      console.error('Verification submission error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`${t('verify.fail_prefix')}${errorMessage}`)
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(to right, #0d47a1, #bbdefb)'}}>
        <div className="text-white text-xl">{t('verify.please_login')}</div>
      </div>
    )
  }

  // Show status if verification already exists
  if (hasExistingVerification && verificationStatus !== 'rejected') {
    const statusColors = {
      pending: { bg: 'rgba(255, 193, 7, 0.1)', border: '#ffc107', text: '#f57c00' },
      approved: { bg: 'rgba(76, 175, 80, 0.1)', border: '#4caf50', text: '#2e7d32' },
      rejected: { bg: 'rgba(244, 67, 54, 0.1)', border: '#f44336', text: '#c62828' }
    }
    
    const colors = statusColors[verificationStatus as keyof typeof statusColors] || statusColors.pending

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

          .status-card {
            width: 100%;
            max-width: 600px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            padding: 32px;
            margin-top: 20px;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
            color: #02243a;
            text-align: center;
          }

          .status-icon {
            font-size: 4rem;
            margin-bottom: 16px;
          }

          .status-title {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 12px;
            color: #034066;
          }

          .status-message {
            font-size: 1rem;
            color: rgba(2, 36, 58, 0.7);
            margin-bottom: 24px;
            line-height: 1.6;
          }

          .btn-back {
            background: linear-gradient(180deg, #4f7bff 0%, #3b5fe6 100%);
            color: #fff;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: transform 0.12s ease;
            box-shadow: 0 8px 20px rgba(79, 123, 255, 0.3);
          }

          .btn-back:hover {
            transform: translateY(-2px);
          }
        `}</style>

        <div className="background">
          <div className="status-card">
            <div className="status-icon">
              {verificationStatus === 'pending' && '⏳'}
              {verificationStatus === 'approved' && '✅'}
            </div>
            <h1 className="status-title">
              {verificationStatus === 'pending' && t('verify.status.pending')}
              {verificationStatus === 'approved' && t('verify.status.approved')}
            </h1>
            <p className="status-message">
              {verificationStatus === 'pending' && t('verify.status.pending_msg')}
              {verificationStatus === 'approved' && t('verify.status.approved_msg')}
            </p>
            <button 
              className="btn-back"
              onClick={() => router.push('/delivery')}
            >
              {t('verify.back_to_dashboard')}
            </button>
          </div>

          <BottomDock role="delivery" />
        </div>
      </>
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
          <h1 className="card-title">{t('verify.title')}</h1>
          <p className="card-subtitle">
            {t('verify.subtitle')}
          </p>

          <div className="info-box">
            <div className="info-box-title">{t('verify.info_title')}</div>
            <div className="info-box-text">
              {t('verify.info_text')}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('verify.student_card')}</label>
              <div 
                className={`upload-area ${studentCardFile ? 'has-file' : ''}`}
                onClick={() => studentCardInputRef.current?.click()}
              >
                <div className="upload-icon">
                  {studentCardFile ? '✓' : '📇'}
                </div>
                <div className="upload-text">
                  {studentCardFile ? studentCardFile.name : t('verify.click_to_upload_student_card')}
                </div>
                <div className="upload-hint">
                  {studentCardFile ? t('verify.click_to_change') : t('verify.hint')}
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
              <label className="form-label">{t('verify.selfie')}</label>
              <div 
                className={`upload-area ${selfieFile ? 'has-file' : ''}`}
                onClick={() => selfieInputRef.current?.click()}
              >
                <div className="upload-icon">
                  {selfieFile ? '✓' : '🤳'}
                </div>
                <div className="upload-text">
                  {selfieFile ? selfieFile.name : t('verify.click_to_upload_selfie')}
                </div>
                <div className="upload-hint">
                  {selfieFile ? t('verify.click_to_change') : t('verify.hint')}
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
              {isSubmitting ? t('verify.submitting') : t('verify.submit')}
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
