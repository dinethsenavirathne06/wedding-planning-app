import emailjs from '@emailjs/browser'

type BookingEmailParams = {
  customerName: string
  customerEmail: string
  vendorName: string
  bookingDate: string
  notes?: string
}

export async function sendBookingConfirmation(params: BookingEmailParams) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('Missing EmailJS environment variables')
  }

  return emailjs.send(
    serviceId,
    templateId,
    {
      customer_name: params.customerName,
      email: params.customerEmail,
      vendor_name: params.vendorName,
      booking_date: params.bookingDate,
      notes: params.notes || 'No notes provided',
    },
    {
      publicKey,
    }
  )
}