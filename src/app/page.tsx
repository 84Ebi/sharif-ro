'use client'

// This page is now primarily for handling redirects from the middleware.
// It can be simplified to a basic loading indicator.
export default function Home() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '1.2rem',
      fontFamily: 'Rubik, Arial, sans-serif',
      backgroundColor: '#0d47a1',
      color: 'white'
    }}>
      Loading...
    </div>
  )
}