# 🎯 Admin Verification Dashboard - User Guide

## 📍 Access the Dashboard

**Production URL:** https://sharif-ro.vercel.app/admin/verifications

**Local Development:** http://localhost:3000/admin/verifications

---

## 🔐 Requirements

1. **Must be logged in** - Admin must have an authenticated account
2. **Database collection exists** - The `verifications` collection must be created in Appwrite
3. **Bucket exists** - The `verifyimg` bucket must exist with proper permissions

---

## 🎨 Dashboard Features

### 1. **Verification List View**

When you first access the dashboard, you'll see:

```
┌─────────────────────────────────────────┐
│  🔍 Verification Management             │
│  [Pending] [Approved] [Rejected] [All] │
├─────────────────────────────────────────┤
│  ┌───────────────────────┐              │
│  │ 👤 John Doe [Pending] │              │
│  │ 📧 john@example.com   │              │
│  │ 📱 +1234567890        │              │
│  │ 📅 Nov 4, 2025        │              │
│  └───────────────────────┘              │
│                                         │
│  ┌───────────────────────┐              │
│  │ 👤 Jane Smith [Pending│              │
│  │ 📧 jane@example.com   │              │
│  │ 📅 Nov 4, 2025        │              │
│  └───────────────────────┘              │
└─────────────────────────────────────────┘
```

#### Filter Buttons:
- **Pending** - Shows only verifications awaiting review (default)
- **Approved** - Shows verified users
- **Rejected** - Shows rejected verifications
- **All** - Shows all verifications

#### Card Information:
- **User Name** - Full name of the applicant
- **Status Badge** - Current status with color coding:
  - 🟡 Yellow = Pending
  - 🟢 Green = Approved
  - 🔴 Red = Rejected
- **Email** - User's email address
- **Phone** - User's phone number (if provided)
- **Date** - Submission date

---

### 2. **Review Modal**

Click on any verification card to open the detailed review modal:

```
╔════════════════════════════════════════════╗
║  Review Verification                    ✕  ║
╠════════════════════════════════════════════╣
║  Name:      John Doe                       ║
║  Email:     john@example.com               ║
║  Phone:     +1234567890                    ║
║  Submitted: Nov 4, 2025 10:30 AM           ║
║  Status:    [Pending]                      ║
╠════════════════════════════════════════════╣
║  ┌──────────────┐  ┌──────────────┐       ║
║  │  Student     │  │   Selfie     │       ║
║  │   Card       │  │    Image     │       ║
║  │   Image      │  │              │       ║
║  └──────────────┘  └──────────────┘       ║
╠════════════════════════════════════════════╣
║  Review Notes (Optional):                  ║
║  [________________________]                ║
║  [________________________]                ║
║                                            ║
║           [✓ Approve]  [✗ Reject]         ║
╚════════════════════════════════════════════╝
```

#### Modal Features:

**User Information Section:**
- Complete user details
- Submission timestamp
- Current status

**Image Section:**
- **Student Card** - Left side
- **Selfie** - Right side
- Both images are zoomable (click to enlarge)
- High-quality display

**Review Notes:**
- Optional text area for admin notes
- Useful for explaining rejection reasons
- Saved with the verification record

**Action Buttons:**
- **✓ Approve** - Green button, approves the verification
- **✗ Reject** - Red button, rejects the verification

---

## ✅ How to Approve a Verification

### Step-by-Step:

1. **Navigate to dashboard:**
   ```
   Go to: /admin/verifications
   ```

2. **Filter for pending:**
   ```
   Click "Pending" button (should be active by default)
   ```

3. **Select verification:**
   ```
   Click on the verification card you want to review
   ```

4. **Review images:**
   ```
   - Check student card is clear and valid
   - Verify selfie matches student card
   - Confirm it's a Sharif University student
   ```

5. **Add notes (optional):**
   ```
   Type any relevant notes in the text area
   Example: "Student ID verified. Clear photo."
   ```

6. **Click "Approve":**
   ```
   Click the green "✓ Approve" button
   ```

7. **Confirmation:**
   ```
   Alert: "Verification approved successfully!"
   Modal closes automatically
   List refreshes
   ```

### What Happens on Approval:

```
Database Updates:
├─ verification.status → "approved"
├─ verification.reviewedAt → current timestamp
├─ verification.reviewedBy → your user ID
├─ verification.reviewNotes → your notes
└─ user.emailVerification → true ✅

User Can Now:
├─ Access /delivery dashboard
├─ View available delivery orders
├─ Accept delivery orders
└─ Start delivering!
```

---

## ❌ How to Reject a Verification

### Step-by-Step:

1. **Navigate and select** (same as approve)

2. **Review images** and identify the issue:
   - Blurry photo
   - Invalid student card
   - Selfie doesn't match
   - Not a student
   - etc.

3. **Add rejection notes (RECOMMENDED):**
   ```
   Example notes:
   "Student card photo is too blurry. Please resubmit with clearer image."
   "Selfie does not match student card photo."
   "Student ID appears expired."
   ```

4. **Click "Reject":**
   ```
   Click the red "✗ Reject" button
   ```

5. **Confirmation:**
   ```
   Alert: "Verification rejected successfully!"
   Modal closes
   List refreshes
   ```

### What Happens on Rejection:

```
Database Updates:
├─ verification.status → "rejected"
├─ verification.reviewedAt → current timestamp
├─ verification.reviewedBy → your user ID
└─ verification.reviewNotes → your rejection reason

User Status:
├─ user.emailVerification → remains false
├─ User sees "Verification Rejected" message
├─ User can resubmit verification
└─ User cannot access delivery dashboard
```

---

## 🔄 Review Workflow

```
┌─────────────────────────────────────────────────────┐
│                   User submits                      │
│         (student card + selfie uploaded)            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│        Status: PENDING (yellow badge)               │
│        Shows in "Pending" filter                    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Admin reviews                          │
│     (views images, checks credentials)              │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────┐
│   APPROVED    │    │    REJECTED    │
│ (green badge) │    │  (red badge)   │
└───────┬───────┘    └────────┬───────┘
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────┐
│ User can      │    │ User notified  │
│ deliver! ✅   │    │ Can resubmit ❌│
└───────────────┘    └────────────────┘
```

---

## 📊 Review Statistics

The dashboard automatically shows:

- **Total verifications** by status
- **Pending count** - Verifications awaiting review
- **Approved count** - Successfully verified users
- **Rejected count** - Rejected verifications

---

## 🛡️ Best Practices

### When Reviewing:

1. **Verify Student Card:**
   - Check if it's a valid Sharif University student card
   - Verify the card isn't expired
   - Ensure photo is clear and readable
   - Confirm student ID number is visible

2. **Verify Selfie:**
   - Ensure face is clearly visible
   - Check if selfie matches student card photo
   - Verify it's a recent photo
   - Confirm it's the actual person (not a photo of a photo)

3. **Always Add Notes for Rejections:**
   - Helps user understand what to fix
   - Provides clear guidance for resubmission
   - Creates an audit trail

4. **Process Promptly:**
   - Review pending verifications within 24-48 hours
   - Users are waiting to start delivering
   - Quick turnaround improves user experience

---

## 🔍 Viewing Already Reviewed Verifications

When you click on an **approved** or **rejected** verification:

```
╔════════════════════════════════════════════╗
║  Review Verification                    ✕  ║
╠════════════════════════════════════════════╣
║  Name:      John Doe                       ║
║  Email:     john@example.com               ║
║  Status:    [Approved]                     ║
╠════════════════════════════════════════════╣
║  [Images displayed]                        ║
╠════════════════════════════════════════════╣
║  Reviewed At: Nov 4, 2025 11:00 AM         ║
║  Notes: Student ID verified. Clear photo.  ║
╚════════════════════════════════════════════╝
```

**Note:** Approve/Reject buttons are hidden for already-reviewed verifications.

---

## 🆘 Troubleshooting

### "No verifications found"
**Cause:** No users have submitted verifications yet  
**Solution:** Wait for users to submit, or test with a user account

### "Please log in to access admin panel"
**Cause:** Not authenticated  
**Solution:** Log in to your admin account first

### Images not loading
**Cause:** Bucket permissions or file IDs incorrect  
**Solution:** 
- Check bucket permissions allow `any` to read
- Verify file IDs in database match storage

### API errors when approving/rejecting
**Cause:** Missing permissions or environment variables  
**Solution:**
- Check API key has correct permissions
- Verify collection permissions allow update
- Check environment variables are set

---

## 🔐 Security Considerations

1. **Admin Access Control:**
   - Currently, any logged-in user can access the admin panel
   - **TODO:** Implement role-based access control
   - **Recommendation:** Add admin role checking

2. **Audit Trail:**
   - Every review is logged with:
     - Reviewer ID
     - Reviewer name
     - Review timestamp
     - Review notes

3. **User Privacy:**
   - Handle user images responsibly
   - Don't share verification documents
   - Follow data protection guidelines

---

## 🎯 Quick Reference

| Action | Button | Result |
|--------|--------|--------|
| View pending | Click "Pending" | Shows unreviewed verifications |
| Open review | Click card | Opens modal with images |
| Approve | Green ✓ button | User can deliver |
| Reject | Red ✗ button | User must resubmit |
| Add notes | Text area | Saves with review |
| Filter | Top buttons | Shows specific status |

---

## 📱 Mobile Responsive

The admin dashboard works on all devices:
- Desktop (full grid layout)
- Tablet (2-column grid)
- Mobile (single column)

Images scale appropriately for each screen size.

---

## 🚀 Next Steps

After setting up the admin dashboard:

1. ✅ Test with a sample verification
2. ✅ Review pending users
3. ✅ Approve legitimate delivery partners
4. ✅ Monitor verification quality
5. ⏳ Consider adding admin role checking
6. ⏳ Add email notifications on approval/rejection

---

**That's it! You're ready to start verifying delivery partners!** 🎉

For technical details, see:
- `VERIFICATION_IMPLEMENTATION.md` - Technical architecture
- `VERIFICATION_FLOW.md` - Complete system flow
- `README_VERIFICATION.md` - System overview


