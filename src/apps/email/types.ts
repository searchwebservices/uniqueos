export interface EmailMessage {
  id: string
  from: { name: string; email: string }
  to: { name: string; email: string }
  subject: string
  body: string
  date: string
  read: boolean
  starred: boolean
  folder: EmailFolder
  attachments?: { name: string; size: string }[]
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'archive'
