import type { EmailMessage } from './types'

export const sampleEmails: EmailMessage[] = [
  {
    id: '1',
    from: { name: 'Sarah Mitchell', email: 'sarah.m@gmail.com' },
    to: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    subject: 'Wedding inquiry - December 2026',
    body: `Hi Luba,

My fiance and I are planning our wedding in Cabo San Lucas for December 2026, and we came across Unique Cabo Weddings. We love the look of your past events!

We're thinking of a ceremony at sunset on the beach, followed by a reception dinner for about 80 guests. We'd love to incorporate some local florals and a rustic-elegant theme.

Could you send us some information about your packages and availability for December 12th or 19th?

Thank you so much!
Sarah & James`,
    date: '2026-04-01T14:23:00',
    read: false,
    starred: true,
    folder: 'inbox',
  },
  {
    id: '2',
    from: { name: 'Carlos Mendoza', email: 'carlos@floresdelcabo.mx' },
    to: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    subject: 'Re: Arreglos florales - Boda Rodriguez',
    body: `Hola Luba,

Te confirmo la disponibilidad de las piezas centrales y los arreglos para la boda Rodriguez el 15 de mayo.

Incluimos:
- 12 centros de mesa con rosas blancas y eucalipto
- 1 arco floral para la ceremonia
- 2 arreglos para la mesa principal
- Bouquet de novia y 4 bouquets para damas

El presupuesto total seria $18,500 MXN. Favor de confirmar para apartar la fecha.

Saludos,
Carlos`,
    date: '2026-04-01T11:05:00',
    read: false,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '3',
    from: { name: 'Emily & David Chen', email: 'emily.chen@outlook.com' },
    to: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    subject: 'Thank you! Our wedding was perfect',
    body: `Dear Luba,

We just got back from our honeymoon and wanted to thank you from the bottom of our hearts. Our wedding day was absolutely magical.

The timeline ran perfectly, the venue looked stunning, and every single detail was taken care of. Our guests are still talking about how beautiful everything was.

The sunset ceremony was the highlight -- exactly what we had dreamed of. Thank you for making it all happen.

With love and gratitude,
Emily & David`,
    date: '2026-03-30T09:15:00',
    read: true,
    starred: true,
    folder: 'inbox',
  },
  {
    id: '4',
    from: { name: 'Resort Los Cabos', email: 'events@resortloscabos.com' },
    to: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    subject: 'Venue availability update - June/July 2026',
    body: `Good morning Luba,

Here is the updated availability for our beachfront terrace and garden pavilion:

June 2026:
- June 6 (Sat) - Available
- June 13 (Sat) - Booked
- June 20 (Sat) - Available
- June 27 (Sat) - Available

July 2026:
- July 4 (Sat) - Available
- July 11 (Sat) - Booked
- July 18 (Sat) - Available
- July 25 (Sat) - Booked

Please let us know if you'd like to hold any dates for your clients.

Best regards,
Events Team`,
    date: '2026-03-29T16:40:00',
    read: true,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '5',
    from: { name: 'Dani Olivetto', email: 'dani@uniquecaboweddings.com' },
    to: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    subject: 'Updated quote for Thompson wedding',
    body: `Hola Luba,

I updated the Thompson wedding quote based on our call yesterday. The changes are:

- Added the upgraded linen package (+$350 USD)
- Removed the second cocktail hour station (-$200 USD)
- Added the sparkler send-off package (+$150 USD)

New total: $8,450 USD

I saved the draft in Cotizaciones. Please review when you have a moment.

Dani`,
    date: '2026-03-28T13:22:00',
    read: true,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '6',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Sarah Mitchell', email: 'sarah.m@gmail.com' },
    subject: 'Re: Wedding inquiry - December 2026',
    body: `Dear Sarah,

Thank you so much for reaching out! We would love to help you create your dream wedding here in Cabo.

December is a beautiful time of year -- the weather is perfect and the sunsets are spectacular. Both December 12th and 19th are currently available.

I would love to schedule a call to discuss your vision in more detail. In the meantime, I am attaching our services guide and a sample lookbook from a similar beach ceremony we planned last year.

Please let me know your availability for a call this week.

Warm regards,
Luba Ponce
Unique Cabo Weddings`,
    date: '2026-04-01T16:45:00',
    read: true,
    starred: false,
    folder: 'sent',
    attachments: [
      { name: 'UCW-Services-2026.pdf', size: '2.4 MB' },
      { name: 'Beach-Ceremony-Lookbook.pdf', size: '8.1 MB' },
    ],
  },
  {
    id: '7',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Borja', email: 'borja@uniquecaboweddings.com' },
    subject: 'New lead - follow up needed',
    body: `Borja,

We received a new inquiry from a couple looking at February 2027. They found us through Instagram.

Can you please send the initial welcome email and schedule an intro call? Their details:

Name: Jessica & Mark Thompson
Email: jess.thompson@yahoo.com
Budget: $10-15k USD
Guest count: ~60
Preferred date: Feb 14, 2027

Gracias,
Luba`,
    date: '2026-03-27T10:30:00',
    read: true,
    starred: false,
    folder: 'sent',
  },
  {
    id: '8',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Amanda & Kyle Brooks', email: 'amanda.brooks@gmail.com' },
    subject: 'Draft: Your wedding day timeline',
    body: `Dear Amanda & Kyle,

Here is the draft timeline for your wedding day on April 26th. Please review and let me know if you'd like any changes:

2:00 PM - Hair & makeup begins
4:00 PM - First look photos
4:45 PM - Bridal party photos
5:30 PM - Guests arrive, welcome drinks
6:00 PM - Ceremony begins (sunset at 6:42 PM)
6:30 PM - Ceremony concludes
6:45 PM - Cocktail hour
7:45 PM - Reception dinner
9:00 PM - First dance & toasts
9:30 PM - Open dancing
11:00 PM - Sparkler send-off

[DRAFT - Review before sending]`,
    date: '2026-04-02T08:00:00',
    read: true,
    starred: false,
    folder: 'drafts',
  },
]
