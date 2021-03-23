import express, {
  urlencoded,
  json,
  Application,
  Request,
  Response,
} from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5000
const app: Application = express()

// Body Parser Middleware
app.use(urlencoded({ extended: false }))
app.use(json())

app.post('/contact', (req: Request, res: Response) => {
  const { name, email, message } = req.body

  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>  
    <li>Name: ${name}</li>
    <li>Email: ${email}</li>
  </ul>
  <h3>Message</h3>
  <p>${message}</p>
`
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: process.env.EMAIL_CIPHER,
      rejectUnauthorized: false,
    },
  })

  // setup email data with unicode symbols
  let mailOptions = {
    from: process.env.EMAIL, // sender address
    to: process.env.EMAIL, // list of receivers
    subject: 'Irish Trad Contact Form', // Subject line
    text: message, // plain text body
    html: output, // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      return res.status(400).json('Message Failed')
    }
    console.log('Message sent: %s', info.messageId)

    res.status(200).json('Message Sent')
  })
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
