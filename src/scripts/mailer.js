const nodemailer = require('nodemailer')
// Create Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'smtp.your-email.com'
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password', // Use App Password if 2FA is enabled
  },
})

// Email Options
const mailOptions = {
  from: 'your-email@gmail.com',
  to: 'recipient@example.com',
  subject: 'Test Email with Attachment',
  text: 'Please find the attached file.',
  attachments: [
    {
      filename: 'example.txt',
      path: './example.txt', // File path
    },
    {
      filename: 'image.png',
      path: './image.png',
      contentType: 'image/png',
    },
  ],
}

// Send Email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error:', error)
  } else {
    console.log('Email sent:', info.response)
  }
})
