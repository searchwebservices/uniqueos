export interface EmailMessage {
  id: string
  threadId: string
  from: { name: string; email: string }
  to: { name: string; email: string }
  subject: string
  body: string
  date: string
  read: boolean
  starred: boolean
  folder: EmailFolder
  attachments?: { name: string; size: string }[]
  isDraft?: boolean
  draftStatus?: 'pending_review' | 'approved' | 'editing'
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'archive'
