import type { EmailMessage } from './types'

export const sampleEmails: EmailMessage[] = [
  // ===== THREAD: Sarah Mitchell wedding inquiry =====
  {
    id: '1',
    threadId: 'thread-sarah',
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
    id: '6',
    threadId: 'thread-sarah',
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
    id: '10',
    threadId: 'thread-sarah',
    from: { name: 'Sarah Mitchell', email: 'sarah.m@gmail.com' },
    to: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    subject: 'Re: Wedding inquiry - December 2026',
    body: `Hi Luba,

Thank you for the quick response! The lookbook is stunning. We're even more excited now.

We'd love to schedule a call. How about Thursday at 11 AM CST? We're flexible on either December date but leaning toward the 19th.

A couple of quick questions:
- Do you work with local florists or should we arrange that separately?
- Is there a minimum guest count for the beachfront ceremony?
- Can you recommend any hotels for our guests?

Looking forward to chatting!
Sarah`,
    date: '2026-04-02T09:15:00',
    read: false,
    starred: false,
    folder: 'inbox',
  },

  // ===== THREAD: Carlos florals =====
  {
    id: '2',
    threadId: 'thread-carlos',
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
    id: '11',
    threadId: 'thread-carlos',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Carlos Mendoza', email: 'carlos@floresdelcabo.mx' },
    subject: 'Re: Arreglos florales - Boda Rodriguez',
    body: `Hola Carlos,

Perfecto, confirmo todo. Favor de apartar la fecha.

Una pregunta adicional: la novia quiere agregar petalos de rosa para el pasillo de la ceremonia. Tienes disponibilidad para eso tambien? Serian petalos blancos y rosa claro.

Gracias,
Luba`,
    date: '2026-04-01T14:30:00',
    read: true,
    starred: false,
    folder: 'sent',
  },
  {
    id: '15',
    threadId: 'thread-carlos',
    from: { name: 'Carlos Mendoza', email: 'carlos@floresdelcabo.mx' },
    to: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    subject: 'Re: Arreglos florales - Boda Rodriguez',
    body: `Hola Luba,

Si, sin problema. Los petalos de rosa para el pasillo los agregamos al paquete por $2,500 MXN adicionales.

Nuevo total: $21,000 MXN

Quedo pendiente de tu confirmacion.

Saludos,
Carlos`,
    date: '2026-04-02T10:20:00',
    read: false,
    starred: false,
    folder: 'inbox',
  },

  // ===== THREAD: Emily thank you =====
  {
    id: '3',
    threadId: 'thread-emily',
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

  // ===== THREAD: Resort availability =====
  {
    id: '4',
    threadId: 'thread-resort',
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

  // ===== THREAD: Dani quote update =====
  {
    id: '5',
    threadId: 'thread-dani-thompson',
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
    id: '12',
    threadId: 'thread-dani-thompson',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Dani Olivetto', email: 'dani@uniquecaboweddings.com' },
    subject: 'Re: Updated quote for Thompson wedding',
    body: `Dani,

Looks good! Two small changes:

1. Add a note that the sparkler package includes 100 sparklers (enough for 50 guests x2)
2. Add the ceremony arch rental -- Jessica mentioned she wants the white wooden arch. That's $175 USD.

Updated total should be $8,625 USD.

Once you update, I'll review the final version before we send to the couple.

Luba`,
    date: '2026-03-28T15:10:00',
    read: true,
    starred: false,
    folder: 'sent',
  },

  // ===== THREAD: Borja lead =====
  {
    id: '7',
    threadId: 'thread-borja-lead',
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
    id: '13',
    threadId: 'thread-borja-lead',
    from: { name: 'Borja', email: 'borja@uniquecaboweddings.com' },
    to: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    subject: 'Re: New lead - follow up needed',
    body: `Luba,

Done! I sent the welcome email with our standard intro package. Call is scheduled for Monday April 6 at 2 PM CST.

They seem very excited -- Jessica replied within 10 minutes. She mentioned she's already looked at Corazon Cabo and Esperanza as potential venues.

I'll keep you posted after the call.

Borja`,
    date: '2026-03-27T16:45:00',
    read: true,
    starred: false,
    folder: 'inbox',
  },

  // ===== DRAFTS (pending review) =====
  {
    id: '8',
    threadId: 'thread-draft-amanda',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Amanda & Kyle Brooks', email: 'amanda.brooks@gmail.com' },
    subject: 'Your wedding day timeline',
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

We can adjust any of these times based on your preferences. The key anchor is the sunset at 6:42 PM for your ceremony.

Looking forward to hearing your thoughts!

Warm regards,
Luba`,
    date: '2026-04-02T08:00:00',
    read: true,
    starred: false,
    folder: 'drafts',
    isDraft: true,
    draftStatus: 'pending_review',
  },
  {
    id: '14',
    threadId: 'thread-draft-thompson-quote',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Jessica & Mark Thompson', email: 'jess.thompson@yahoo.com' },
    subject: 'Your UCW rental quotation',
    body: `Dear Jessica & Mark,

Thank you for choosing Unique Cabo Weddings! Below is your rental quotation for your February 14, 2027 celebration at Corazon Cabo.

Rental Items:
- 60x Gold Charger Plates - $360 USD
- 60x Gold Silverware Sets (5pc) - $300 USD
- 60x Champagne Flute Crystal - $330 USD
- 60x Blush Napkins - $240 USD
- 10x Ivory Table Runners - $80 USD
- 20x Cylinder Candle Holders - $70 USD
- 60x White Votive Candles - $90 USD
- 1x White Wooden Ceremony Arch - $175 USD
- 1x Sparkler Send-off Package (100 sparklers) - $150 USD
- Upgraded Linen Package - $350 USD

Subtotal: $2,145 USD
Delivery: COURTESY
IVA 16%: $343.20 USD
Total: $2,488.20 USD

This quotation is valid for 15 days. A 50% deposit is required to secure your date.

Please let us know if you have any questions or would like to make any changes.

Warm regards,
Luba Ponce
Unique Cabo Weddings`,
    date: '2026-04-02T10:30:00',
    read: true,
    starred: false,
    folder: 'drafts',
    isDraft: true,
    draftStatus: 'pending_review',
    attachments: [
      { name: 'UCW-Quote-Thompson-2027.pdf', size: '1.2 MB' },
    ],
  },
  {
    id: '16',
    threadId: 'thread-draft-sarah-followup',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Sarah Mitchell', email: 'sarah.m@gmail.com' },
    subject: 'Re: Wedding inquiry - December 2026',
    body: `Dear Sarah,

Great questions! Here are the answers:

1. Florists: We work closely with several local florists here in Cabo. Our primary partner is Flores del Cabo (Carlos Mendoza) -- he does incredible work. We handle all the coordination so you don't have to worry about the language barrier or logistics.

2. Guest count: There's no minimum for the beachfront ceremony! We've done intimate ceremonies with 20 guests and larger celebrations with 150+.

3. Hotels: I recommend Corazon Cabo (where we'd host your reception), Esperanza (luxury option), and Pueblo Bonito (great mid-range for guests). We can arrange group rates at any of these.

Thursday at 11 AM CST works perfectly. I'll send a calendar invite shortly.

Talk soon!
Luba`,
    date: '2026-04-02T11:00:00',
    read: true,
    starred: false,
    folder: 'drafts',
    isDraft: true,
    draftStatus: 'pending_review',
  },
  {
    id: '17',
    threadId: 'thread-draft-vendor-confirm',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Carlos Mendoza', email: 'carlos@floresdelcabo.mx' },
    subject: 'Re: Arreglos florales - Boda Rodriguez',
    body: `Hola Carlos,

Perfecto, aprobado. Confirmamos el paquete completo incluyendo los petalos:

- Arreglos florales originales: $18,500 MXN
- Petalos de rosa para pasillo: $2,500 MXN
- Total: $21,000 MXN

Favor de enviar la factura para procesar el anticipo del 50%.

Gracias por siempre cuidar cada detalle.

Saludos,
Luba`,
    date: '2026-04-02T11:30:00',
    read: true,
    starred: false,
    folder: 'drafts',
    isDraft: true,
    draftStatus: 'approved',
  },
  {
    id: '18',
    threadId: 'thread-draft-emily-reply',
    from: { name: 'Luba Ponce', email: 'luba@uniquecaboweddings.com' },
    to: { name: 'Emily & David Chen', email: 'emily.chen@outlook.com' },
    subject: 'Re: Thank you! Our wedding was perfect',
    body: `Dear Emily & David,

Thank you so much for your kind words! It was truly a pleasure working with you both. Your wedding was one of my favorites -- your energy and your love for each other made everything shine.

I would love to feature some photos from your celebration on our website and Instagram (with your permission of course). Would you be open to that?

Wishing you both a lifetime of happiness!

Con mucho carino,
Luba`,
    date: '2026-04-02T09:00:00',
    read: true,
    starred: false,
    folder: 'drafts',
    isDraft: true,
    draftStatus: 'editing',
  },
]
