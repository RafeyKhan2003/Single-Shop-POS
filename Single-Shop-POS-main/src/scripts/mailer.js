import fs from 'node:fs'
import path from 'node:path'
import Shop from '../db/Shop'
import { suffix } from '../db/db'
import nodemailer from 'nodemailer'

export function SendReports(date) {
  return new Promise((resolve) => {
    const directory1 = './reports' // Replace with your first directory path
    const directory2 = './databases'

    const filesInDirectory1 = fs.readdirSync(directory1)
    const filesInDirectory2 = fs.readdirSync(directory2)

    const filteredFilesInDirectory2 = filesInDirectory2.filter((file) => file.includes(suffix))

    const allFiles = [...filesInDirectory1, ...filteredFilesInDirectory2]
    const attachments = allFiles.map((file) => {
      const filePath = path.join(file.includes(suffix) ? directory2 : directory1, file)
      return {
        filename: file,
        path: filePath,
        contentType: file.endsWith('.png') ? 'image/png' : 'application/octet-stream',
      }
    })

    const shop = Shop.getShop()

    if (shop.mail.company_emails) {
      console.log('📧 Mail process started')
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: 'pixxtechaminpark@gmail.com',
          pass: 'amok slqz evuv ehoq', // Use App Password if needed
        },
        // logger: true,
        // debug: true,
      })

      const mailOptions = {
        from: 'pixxtechaminpark@gmail.com',
        to: shop.mail.company_emails,
        subject: `Reports - ${shop.name} - ${date}`,
        text: `Dear Team,

        Please find the attached reports for ${shop.name} as of ${date}. These files contain the latest data and insights for your review.

        If you have any questions or require further assistance, feel free to reach out.

        Best regards,
        PixxTech Team`,
        attachments: attachments,
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('❌ Error sending email:', error)
        } else {
          resolve(error)
          console.log('✅ Email sent successfully:', info.response)
          resolve(info.response)
        }
      })
    } else {
      resolve('Missing email configuration')
      console.log('⚠️ Missing email configuration!')
    }
  })
}
