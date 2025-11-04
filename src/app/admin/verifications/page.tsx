'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { storage } from '@/lib/appwrite'

type Verification = {
  $id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  studentCardFileId: string
  selfieFileId: string
  bucketId: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt: string | null
  reviewedBy: string | null
  reviewNotes: string | null
}

const VERIFICATION_BUCKET_ID = '6909fd2600093086c95b'

export default function AdminVerificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch verifications
  useEffect(() => {
    loadVerifications()
  }, [filter])

  const loadVerifications = async () => {
    try {
      setLoading(true)
      const queryParam = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/verifications${queryParam}`)
      const data = await response.json()
      
      if (data.success) {
        setVerifications(data.data)
      }
    } catch (error) {
      console.error('Error loading verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (fileId: string) => {
    try {
      return storage.getFileView(VERIFICATION_BUCKET_ID, fileId).toString()
    } catch (error) {
      console.error('Error getting image URL:', error)
      return ''
    }
  }

  const handleReview = async (verificationId: string, status: 'approved' | 'rejected') => {
    if (!user) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/admin/verifications/${verificationId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          reviewNotes,
          reviewerId: user.$id,
          reviewerName: user.name
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Verification ${status} successfully!`)
        setSelectedVerification(null)
        setReviewNotes('')
        loadVerifications()
      } else {
        alert(`Failed to ${status} verification: ${data.error}`)
      }
    } catch (error) {
      console.error('Error reviewing verification:', error)
      alert('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  // Check if user is admin (you might want to implement proper admin role checking)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">Please log in to access admin panel.</div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .background {
          min-height: 100vh;
          background: linear-gradient(to right, #0d47a1, #bbdefb);
          padding: 20px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: #034066;
          margin-bottom: 16px;
        }

        .filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: 2px solid #ddd;
          background: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: linear-gradient(180deg, #4f7bff 0%, #3b5fe6 100%);
          color: white;
          border-color: #4f7bff;
        }

        .filter-btn:hover {
          transform: translateY(-2px);
        }

        .verifications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .verification-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .verification-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .user-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #034066;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-approved {
          background: #d4edda;
          color: #155724;
        }

        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .card-info {
          color: rgba(2, 36, 58, 0.7);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }

        .modal {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #034066;
        }

        .close-btn {
          font-size: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
        }

        .images-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .image-container {
          text-align: center;
        }

        .image-label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #034066;
        }

        .verification-image {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .info-section {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 600;
          color: #555;
        }

        .info-value {
          color: #333;
        }

        .notes-section {
          margin-bottom: 20px;
        }

        .notes-label {
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
          color: #034066;
        }

        .notes-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          resize: vertical;
          min-height: 100px;
        }

        .notes-textarea:focus {
          outline: none;
          border-color: #4f7bff;
        }

        .actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-approve {
          background: linear-gradient(180deg, #4caf50 0%, #388e3c 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .btn-approve:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-reject {
          background: linear-gradient(180deg, #f44336 0%, #d32f2f 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        }

        .btn-reject:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .loading {
          text-align: center;
          color: white;
          font-size: 1.2rem;
          padding: 40px;
        }

        .no-results {
          text-align: center;
          color: white;
          font-size: 1.1rem;
          padding: 40px;
        }

        @media (max-width: 768px) {
          .images-section {
            grid-template-columns: 1fr;
          }

          .verifications-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="background">
        <div className="container">
          {/* Header */}
          <div className="header">
            <h1 className="title">🔍 Verification Management</h1>
            <div className="filters">
              <button
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                onClick={() => setFilter('approved')}
              >
                Approved
              </button>
              <button
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </button>
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
            </div>
          </div>

          {/* Verifications List */}
          {loading ? (
            <div className="loading">Loading verifications...</div>
          ) : verifications.length === 0 ? (
            <div className="no-results">No verifications found.</div>
          ) : (
            <div className="verifications-grid">
              {verifications.map((verification) => (
                <div
                  key={verification.$id}
                  className="verification-card"
                  onClick={() => setSelectedVerification(verification)}
                >
                  <div className="card-header">
                    <div className="user-name">{verification.userName}</div>
                    <span className={`status-badge status-${verification.status}`}>
                      {verification.status}
                    </span>
                  </div>
                  <div className="card-info">
                    <div>📧 {verification.userEmail}</div>
                    {verification.userPhone && <div>📱 {verification.userPhone}</div>}
                    <div>📅 {new Date(verification.submittedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Modal */}
          {selectedVerification && (
            <div className="modal-overlay" onClick={() => setSelectedVerification(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Review Verification</h2>
                  <button className="close-btn" onClick={() => setSelectedVerification(null)}>
                    ✕
                  </button>
                </div>

                {/* User Info */}
                <div className="info-section">
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{selectedVerification.userName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{selectedVerification.userEmail}</span>
                  </div>
                  {selectedVerification.userPhone && (
                    <div className="info-row">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">{selectedVerification.userPhone}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-label">Submitted:</span>
                    <span className="info-value">
                      {new Date(selectedVerification.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className={`status-badge status-${selectedVerification.status}`}>
                      {selectedVerification.status}
                    </span>
                  </div>
                </div>

                {/* Images */}
                <div className="images-section">
                  <div className="image-container">
                    <div className="image-label">Student Card</div>
                    <Image
                      src={getImageUrl(selectedVerification.studentCardFileId)}
                      alt="Student Card"
                      width={400}
                      height={300}
                      className="verification-image"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="image-container">
                    <div className="image-label">Selfie</div>
                    <Image
                      src={getImageUrl(selectedVerification.selfieFileId)}
                      alt="Selfie"
                      width={400}
                      height={300}
                      className="verification-image"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>

                {/* Review Notes */}
                {selectedVerification.status === 'pending' && (
                  <>
                    <div className="notes-section">
                      <label className="notes-label">Review Notes (Optional)</label>
                      <textarea
                        className="notes-textarea"
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add any notes about this verification..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="actions">
                      <button
                        className="btn btn-approve"
                        onClick={() => handleReview(selectedVerification.$id, 'approved')}
                        disabled={submitting}
                      >
                        {submitting ? 'Processing...' : '✓ Approve'}
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => handleReview(selectedVerification.$id, 'rejected')}
                        disabled={submitting}
                      >
                        {submitting ? 'Processing...' : '✗ Reject'}
                      </button>
                    </div>
                  </>
                )}

                {/* Show review info if already reviewed */}
                {selectedVerification.status !== 'pending' && (
                  <div className="info-section">
                    <div className="info-row">
                      <span className="info-label">Reviewed At:</span>
                      <span className="info-value">
                        {selectedVerification.reviewedAt 
                          ? new Date(selectedVerification.reviewedAt).toLocaleString()
                          : 'N/A'}
                      </span>
                    </div>
                    {selectedVerification.reviewNotes && (
                      <div className="info-row">
                        <span className="info-label">Notes:</span>
                        <span className="info-value">{selectedVerification.reviewNotes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

