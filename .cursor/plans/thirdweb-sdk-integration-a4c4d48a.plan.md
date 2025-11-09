<!-- a4c4d48a-bc94-4db7-b095-2a2161e95221 30f05b95-d9a2-4869-92b0-e942fde339cf -->
# Phase 3 Refinement: Minimal-Invasive Proposal Submission Form

## Context: What We've Built So Far

### Phase 1 ✅

- Supabase database with `proposals` table (minimal schema)
- API endpoint `POST /api/proposals` (basic version)
- API helpers for responses

### Phase 2 ✅

- Secure wallet authentication
- Session management
- ProtectedRoute component
- Auth hooks

### Phase 3 Goal

Build **complete proposal submission experience** for co-founders:

- Beautiful, user-friendly form
- Markdown editor for rich content
- Real-time validation
- Preview before submit
- Success/error handling
- Integration with existing API

## What Exists Already

From USERFLOW.md analysis, we found:

- ❌ No `/dashboard/propose` page exists yet
- ✅ Basic proposal flow mocked in UI
- ✅ Design system components available

## Minimal-Invasive Strategy

**Leverage what exists:**

- Use existing Tailwind design system
- Use existing Layout component
- Reuse form patterns from other pages
- Simple approach first, enhance later

**What we'll build:**

1. Form UI with 4 fields (title, description, deliverable, amount)
2. Markdown editor (library)
3. Client-side validation (Zod)
4. Preview component
5. Submit handler
6. Success/error states

**What we'll skip:**

- ❌ Draft saving (add later)
- ❌ File attachments (not in MVP)
- ❌ AI-assisted writing (post-MVP)
- ❌ Template system (post-MVP)

## Required Dependencies Analysis

Need to install:

- `react-hook-form` - Form state management
- `zod` - Schema validation
- `react-markdown` - Markdown rendering
- `react-simplemde-editor` - Markdown editor (lightweight)

Total bundle size: ~200kb (acceptable for MVP)

## Refined Actionable Tickets

### PHASE-3-TICKET-001: Install Form Dependencies

**Priority:** P0 | **Time:** 10 min

**Goal:** Install necessary packages for form handling and markdown

**What to Do:**

1. Install react-hook-form for form state
2. Install zod for validation
3. Install react-markdown for rendering
4. Install simplemde-markdown-editor + react-simplemde-editor

**Commands:**

```bash
npm install react-hook-form zod
npm install react-markdown remark-gfm
npm install simplemde-markdown-editor react-simplemde-editor
npm install --save-dev @types/react-simplemde-editor
```

**Definition of Done:**

- [ ] All packages installed in package.json
- [ ] No dependency conflicts
- [ ] TypeScript types available
- [ ] Can import packages without errors
- [ ] `npm run build` succeeds

---

### PHASE-3-TICKET-002: Create Proposal Schema & Types

**Priority:** P0 | **Time:** 20 min

**Goal:** Define TypeScript types and Zod validation schema for proposals

**What to Do:**

1. Create `src/types/proposal.ts`
2. Define Proposal interface
3. Create Zod schema matching API expectations
4. Export both for reuse

**Files to Create:**

- `src/types/proposal.ts`

**Definition of Done:**

- [ ] Proposal interface defined
- [ ] Zod schema matches interface
- [ ] Schema validates all 4 fields
- [ ] Min/max lengths enforced
- [ ] Amount must be positive number
- [ ] Types exported for use in components

**Code Pattern:**

```typescript
// src/types/proposal.ts
import { z } from 'zod'

export const proposalSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  
  deliverable: z.string()
    .min(20, 'Deliverable must be at least 20 characters')
    .max(2000, 'Deliverable must be less than 2000 characters'),
  
  requested_cstake_amount: z.number()
    .positive('Amount must be greater than 0')
    .max(1000000, 'Amount too large'),
})

export type ProposalFormData = z.infer<typeof proposalSchema>

export interface Proposal extends ProposalFormData {
  id: string
  creator_wallet_address: string
  created_at: string
}
```

---

### PHASE-3-TICKET-003: Create Markdown Editor Component

**Priority:** P0 | **Time:** 1 hour

**Goal:** Build reusable markdown editor component with preview

**What to Do:**

1. Create `src/components/forms/MarkdownEditor.tsx`
2. Wrap SimpleMDE with React component
3. Add toolbar configuration
4. Style to match design system
5. Add character counter
6. Make it controlled component (value + onChange)

**Files to Create:**

- `src/components/forms/MarkdownEditor.tsx`
- Import SimpleMDE CSS in component

**Definition of Done:**

- [ ] Component renders markdown editor
- [ ] Toolbar has basic formatting (bold, italic, lists, links)
- [ ] Preview tab works
- [ ] Character counter shows remaining chars
- [ ] Styled consistently with design
- [ ] Works as controlled component
- [ ] Mobile responsive

**Code Pattern:**

```typescript
// src/components/forms/MarkdownEditor.tsx
'use client'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'simplemde/dist/simplemde.min.css'

// Dynamic import to avoid SSR issues
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  maxLength,
}: MarkdownEditorProps) {
  const options = useMemo(() => ({
    spellChecker: false,
    placeholder: placeholder || 'Write here...',
    status: maxLength ? [
      {
        className: 'character-count',
        onUpdate: (el: HTMLElement) => {
          const remaining = maxLength - value.length
          el.innerHTML = `${remaining} characters remaining`
        },
      },
    ] : false,
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'preview', 'guide',
    ],
  }), [value.length, maxLength, placeholder])

  return (
    <div className="markdown-editor">
      <SimpleMDE
        value={value}
        onChange={onChange}
        options={options}
      />
    </div>
  )
}
```

---

### PHASE-3-TICKET-004: Create Proposal Form Page

**Priority:** P0 | **Time:** 1.5 hours

**Goal:** Build complete proposal submission form page

**What to Do:**

1. Create `src/app/dashboard/propose/page.tsx`
2. Setup react-hook-form with Zod validation
3. Add all 4 form fields:

   - Title (input)
   - Description (markdown editor)
   - Deliverable (markdown editor)
   - Amount (number input)

4. Wrap in ProtectedRoute
5. Add submit handler
6. Style with existing design system

**Files to Create:**

- `src/app/dashboard/propose/page.tsx`

**Definition of Done:**

- [ ] Page accessible at `/dashboard/propose`
- [ ] Protected by authentication
- [ ] Form has all 4 required fields
- [ ] Real-time validation on blur
- [ ] Error messages display inline
- [ ] Submit button disabled when invalid
- [ ] Loading state during submission
- [ ] Mobile responsive

**Code Pattern:**

```typescript
// src/app/dashboard/propose/page.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { proposalSchema, ProposalFormData } from '@/types/proposal'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { MarkdownEditor } from '@/components/forms/MarkdownEditor'
import { Layout } from '@/components/Layout'

export default function ProposePage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ProposalFormData) => {
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error('Failed to submit')
      
      // Handle success (next ticket)
    } catch (error) {
      // Handle error (next ticket)
    }
  }

  return (
    <Layout>
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-8">Submit a Proposal</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Proposal Title *
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="e.g., Logo & Brand Identity Design"
                className="w-full px-4 py-3 border rounded-lg"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Description * <span className="text-gray-500">(What will you do?)</span>
              </label>
              <MarkdownEditor
                value={watch('description') || ''}
                onChange={(value) => setValue('description', value)}
                placeholder="Describe your proposal in detail..."
                maxLength={5000}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Deliverable Field */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Deliverable * <span className="text-gray-500">(What's the result?)</span>
              </label>
              <MarkdownEditor
                value={watch('deliverable') || ''}
                onChange={(value) => setValue('deliverable', value)}
                placeholder="What will you deliver? Include links if applicable..."
                maxLength={2000}
              />
              {errors.deliverable && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.deliverable.message}
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Requested $CSTAKE Amount *
              </label>
              <input
                {...register('requested_cstake_amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="e.g., 1500"
                className="w-full px-4 py-3 border rounded-lg"
              />
              {errors.requested_cstake_amount && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.requested_cstake_amount.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </form>
        </div>
      </ProtectedRoute>
    </Layout>
  )
}
```

---

### PHASE-3-TICKET-005: Update API Endpoint for Validation

**Priority:** P1 | **Time:** 30 min

**Goal:** Add server-side validation to POST /api/proposals endpoint

**What to Do:**

1. Update `src/app/api/proposals/route.ts` from Phase 1
2. Import proposalSchema from types
3. Validate request body with Zod
4. Return 400 with validation errors if invalid
5. Maintain existing functionality

**Files to Edit:**

- `src/app/api/proposals/route.ts` (from PHASE-1-TICKET-007)

**Definition of Done:**

- [ ] Request body validated with Zod schema
- [ ] Returns 400 if validation fails
- [ ] Returns specific error messages
- [ ] Still saves to database on success
- [ ] Wallet address still extracted from auth
- [ ] Backward compatible with Phase 1 tests

**Code Pattern:**

```typescript
// src/app/api/proposals/route.ts (UPDATE)
import { proposalSchema } from '@/types/proposal'

export async function POST(request: NextRequest) {
  try {
    const wallet = requireAuth(request)
    const body = await request.json()
    
    // Validate with Zod
    const validation = proposalSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(
        validation.error.errors[0].message,
        400
      )
    }
    
    const data = validation.data
    
    // Save to database
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        creator_wallet_address: wallet,
        title: data.title,
        description: data.description,
        deliverable: data.deliverable,
        requested_cstake_amount: data.requested_cstake_amount,
      })
      .select()
      .single()
    
    if (error) throw error
    
    return jsonResponse({ success: true, proposal }, 201)
  } catch (error) {
    return errorResponse(error.message, 500)
  }
}
```

---

### PHASE-3-TICKET-006: Success/Error Handling UI

**Priority:** P1 | **Time:** 45 min

**Goal:** Add user feedback for successful submission and errors

**What to Do:**

1. Create success modal/page component
2. Create error toast/notification component
3. Update form to show success state
4. Update form to show error state
5. Redirect to dashboard on success

**Files to Create:**

- `src/components/SuccessModal.tsx` (or use existing if available)
- `src/components/ErrorToast.tsx` (or use library like react-hot-toast)

**Definition of Done:**

- [ ] Success state shows celebratory message
- [ ] Success explains next steps
- [ ] Success provides link to dashboard
- [ ] Error state shows specific error message
- [ ] Error provides retry button
- [ ] Network errors handled gracefully
- [ ] Form can be resubmitted after error

**Code Pattern:**

```typescript
// Add to ProposePage component
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const router = useRouter()
const [submitError, setSubmitError] = useState<string | null>(null)
const [submitSuccess, setSubmitSuccess] = useState(false)

const onSubmit = async (data: ProposalFormData) => {
  try {
    setSubmitError(null)
    
    const response = await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Submission failed')
    }
    
    setSubmitSuccess(true)
    // Redirect after 2 seconds
    setTimeout(() => router.push('/cofounder-dashboard'), 2000)
  } catch (error) {
    setSubmitError(error.message)
  }
}

// Success Modal
{submitSuccess && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-8 max-w-md">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Proposal Submitted!</h2>
        <p className="text-gray-600 mb-4">
          Your proposal is now pending review. We'll notify you when there's an update.
        </p>
        <button
          onClick={() => router.push('/cofounder-dashboard')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
)}

// Error Display
{submitError && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <p className="text-red-800">{submitError}</p>
  </div>
)}
```

---

### PHASE-3-TICKET-007: Add Preview Tab/Modal

**Priority:** P2 | **Time:** 1 hour

**Goal:** Allow users to preview formatted proposal before submitting

**What to Do:**

1. Create `src/components/ProposalPreview.tsx`
2. Use react-markdown to render description and deliverable
3. Add "Preview" button to form
4. Show modal with formatted proposal
5. Include all field values in preview

**Files to Create:**

- `src/components/ProposalPreview.tsx`

**Definition of Done:**

- [ ] Preview button appears above submit
- [ ] Preview shows all fields formatted
- [ ] Markdown renders correctly
- [ ] Preview modal is readable and styled
- [ ] Can close preview and edit
- [ ] Preview updates when form changes
- [ ] Mobile responsive

**Code Pattern:**

```typescript
// src/components/ProposalPreview.tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ProposalFormData } from '@/types/proposal'

interface ProposalPreviewProps {
  data: ProposalFormData
  isOpen: boolean
  onClose: () => void
}

export function ProposalPreview({ data, isOpen, onClose }: ProposalPreviewProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl max-h-[90vh] overflow-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Preview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {data.title}
            </h3>
            <p className="text-sm text-gray-500">
              Requesting {data.requested_cstake_amount} $CSTAKE
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.description}
              </ReactMarkdown>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Deliverable</h4>
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.deliverable}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-900 text-white py-3 rounded-lg"
        >
          Close Preview
        </button>
      </div>
    </div>
  )
}
```

---

### PHASE-3-TICKET-008: Add Help Text & Guidelines

**Priority:** P2 | **Time:** 30 min

**Goal:** Add helpful guidance for users filling out the form

**What to Do:**

1. Add info tooltips next to field labels
2. Add "Tips" section to page
3. Include examples of good proposals
4. Add character counters
5. Add formatting guide for markdown

**Files to Edit:**

- `src/app/dashboard/propose/page.tsx`

**Definition of Done:**

- [ ] Help text for each field
- [ ] Examples of good content
- [ ] Markdown formatting guide
- [ ] Character counters visible
- [ ] Tips section above or beside form
- [ ] Not overwhelming or cluttered

**Code Pattern:**

```typescript
// Add to ProposePage
<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
  <h3 className="font-bold text-lg mb-3">💡 Tips for a Great Proposal</h3>
  <ul className="space-y-2 text-sm">
    <li>✅ Be specific about what you'll deliver</li>
    <li>✅ Include examples or portfolio links</li>
    <li>✅ Explain why you're the right person for this</li>
    <li>✅ Set a fair token amount based on complexity</li>
    <li>❌ Don't be vague or overpromise</li>
  </ul>
</div>

// Add markdown formatting guide
<details className="mb-4">
  <summary className="cursor-pointer text-sm text-gray-600">
    Markdown Formatting Guide
  </summary>
  <div className="mt-2 text-sm text-gray-600 space-y-1">
    <p><code>**bold**</code> → <strong>bold</strong></p>
    <p><code>*italic*</code> → <em>italic</em></p>
    <p><code>[link](url)</code> → <a href="#">link</a></p>
    <p><code>- item</code> → • item</p>
  </div>
</details>
```

---

### PHASE-3-TICKET-009: Update Navigation CTA

**Priority:** P1 | **Time:** 15 min

**Goal:** Connect homepage "Make a Proposal" button to new form page

**What to Do:**

1. Find all "Make a Proposal" CTAs in codebase
2. Update hrefs to `/dashboard/propose`
3. Verify links work from all pages
4. Test navigation flow

**Files to Edit:**

- `src/components/NewHeroSection.tsx`
- `src/components/FinalCTASection.tsx`
- Any other CTA locations

**Definition of Done:**

- [ ] All "Make a Proposal" buttons link to `/dashboard/propose`
- [ ] Navigation works from homepage
- [ ] Navigation works from other pages
- [ ] Auth flow works (connect -> sign -> see form)
- [ ] No broken links

---

### PHASE-3-TICKET-010: Create GET /api/proposals/me Endpoint

**Priority:** P1 | **Time:** 30 min

**Goal:** Allow users to fetch their own proposals

**What to Do:**

1. Create `src/app/api/proposals/me/route.ts`
2. Implement GET handler
3. Get wallet from auth
4. Query proposals by creator_wallet_address
5. Return sorted by created_at DESC

**Files to Create:**

- `src/app/api/proposals/me/route.ts`

**Definition of Done:**

- [ ] GET `/api/proposals/me` endpoint works
- [ ] Requires authentication
- [ ] Returns only user's own proposals
- [ ] Sorted newest first
- [ ] Returns empty array if no proposals
- [ ] Proper error handling

**Code Pattern:**

```typescript
// src/app/api/proposals/me/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const wallet = requireAuth(request)
    
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('creator_wallet_address', wallet)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return jsonResponse({ success: true, proposals: data })
  } catch (error) {
    return errorResponse(error.message, 500)
  }
}
```

---

### PHASE-3-TICKET-011: Integration Test - Complete Flow

**Priority:** P0 | **Time:** 30 min

**Goal:** Test entire proposal submission flow end-to-end

**What to Do:**

1. Open app in browser
2. Connect wallet and authenticate
3. Navigate to "Make a Proposal"
4. Fill out form with valid data
5. Preview proposal
6. Submit proposal
7. Verify success message
8. Check proposal in Supabase
9. Verify proposal appears in `/api/proposals/me`

**Definition of Done:**

- [ ] Can access form when authenticated
- [ ] Cannot access form without auth
- [ ] All validations work correctly
- [ ] Markdown editor works
- [ ] Preview shows formatted content
- [ ] Submission succeeds
- [ ] Success message appears
- [ ] Proposal saved in database with correct wallet
- [ ] Can fetch proposal via API
- [ ] Form clears/redirects after success
- [ ] Mobile responsive at all steps

**Test Checklist:**

```
✓ Navigate to homepage
✓ Click "Make a Proposal"
✓ Redirected to auth if not connected
✓ Connect wallet via MetaMask
✓ Sign authentication message
✓ See proposal form
✓ Enter title (test validation: too short, too long, valid)
✓ Enter description with markdown (bold, lists, links)
✓ Enter deliverable
✓ Enter amount (test: negative, zero, valid)
✓ See validation errors inline
✓ Fix all errors
✓ Click "Preview"
✓ Verify markdown renders correctly
✓ Close preview
✓ Click "Submit"
✓ See loading state
✓ See success message
✓ Redirected to dashboard
✓ Open Supabase dashboard
✓ Verify proposal exists with correct data
✓ Test on mobile device
```

---

## Implementation Order

**Do these tickets in exact order:**

1. **PHASE-3-TICKET-001** - Install dependencies (10 min)
2. **PHASE-3-TICKET-002** - Create schema & types (20 min)
3. **PHASE-3-TICKET-003** - Markdown editor component (1 hour)
4. **PHASE-3-TICKET-004** - Proposal form page (1.5 hours)
5. **PHASE-3-TICKET-005** - Update API validation (30 min)
6. **PHASE-3-TICKET-006** - Success/error handling (45 min)
7. **PHASE-3-TICKET-007** - Preview modal (1 hour)
8. **PHASE-3-TICKET-008** - Help text & guidelines (30 min)
9. **PHASE-3-TICKET-009** - Update navigation CTAs (15 min)
10. **PHASE-3-TICKET-010** - GET /api/proposals/me (30 min)
11. **PHASE-3-TICKET-011** - Integration test (30 min)

**Total Estimated Time: 7 hours**

## Dependencies Check

```json
{
  "dependencies": {
    "react-hook-form": "^7.53.2",
    "zod": "^3.23.8",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "simplemde-markdown-editor": "^1.11.2",
    "react-simplemde-editor": "^5.2.0"
  },
  "devDependencies": {
    "@types/react-simplemde-editor": "^5.0.0",
    "@hookform/resolvers": "^3.9.1"
  }
}
```

**Bundle size impact:** ~200kb (reasonable for rich editor)

## What We're Not Doing (Deferred)

From original TICKETS.md, these are deferred:

- ❌ TICKET-026: Advanced markdown editor (using simple one)
- ❌ Draft saving to database
- ❌ Image upload for proposals
- ❌ AI-assisted proposal writing
- ❌ Proposal templates
- ❌ Multi-step wizard
- ❌ Collaborative editing

These can be added post-MVP based on user feedback.

## Success Criteria

After Phase 3 is complete:

✅ Co-founders can submit proposals

✅ Beautiful, user-friendly form

✅ Markdown support for rich content

✅ Real-time validation

✅ Preview before submit

✅ Success/error feedback

✅ Proposals saved to database

✅ Ready for Phase 4 (Admin Review)

## User Experience Flow

```
Homepage
  ↓ "Make a Proposal" CTA
Auth Check
  ↓ Connect Wallet → Sign Message
Proposal Form
  ↓ Fill out 4 fields
  ↓ Use markdown for rich content
  ↓ See validation feedback
  ↓ Preview formatted proposal
  ↓ Submit
Success Message
  ↓ Redirect to Dashboard
View Proposals List
```

## Next Steps After Phase 3

Once proposal submission works:

- Phase 4: Admin panel to review proposals
- Phase 5: Status state machine (pending, approved, rejected)
- Phase 6: Negotiation flow (counter-offers)
- Phase 7: Smart contracts for escrow

Proposals are now entering the system, ready for admin review in Phase 4.

### To-dos

- [ ] CS-001: Install ThirdWeb packages
- [ ] CS-002: Setup .env files
- [ ] CS-003: Create ThirdWeb config file
- [ ] CS-004: Wrap app in ThirdWebProvider
- [ ] CS-005: Add ConnectWallet button to Navigation
- [ ] CS-006: Create useWalletAuth hook (client-only)
- [ ] CS-007: Create Supabase project
- [ ] CS-008: Setup Supabase client
- [ ] CS-009: Create users table schema
- [ ] CS-010: Create proposals table schema
- [ ] CS-011: POST /api/proposals endpoint
- [ ] CS-012: GET /api/proposals/me endpoint
- [ ] CS-013: GET /api/proposals/:id endpoint
- [ ] CS-014: PUT /api/proposals/:id/respond endpoint
- [ ] CS-015: Create ProposalForm component
- [ ] CS-016: Create submit-proposal page
- [ ] CS-017: Add Submit Proposal CTAs (closes Gap #1)
- [ ] CS-018: Connect proposal-review page to API (closes Gap #4)
- [ ] CS-019: Connect MyContributionsTab to API
- [ ] CS-020: Create MCP client wrapper
- [ ] CS-021: Create /api/wallet/tokens endpoint
- [ ] CS-022: Create TokenBalance component
- [ ] CS-023: Add balance to cofounder dashboard
- [ ] CS-024: Integrate real data in Proposals tab (closes Gap #8)
- [ ] CS-025: Add back link to liquidity success (closes Gap #9)