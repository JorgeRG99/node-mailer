const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");

const app = express()
app.use(express.json())
app.disable('x-powered-by')

app.get('/sendMail/:email', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { email } = req.params

  const CLIENT_ID = '389196242479-01fnjob369jc4c3tiqtbqngbkl57io2t.apps.googleusercontent.com'
  const CLIENT_SECRET = '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'
  const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
  const REFRESH_TOKEN = '1//04BapPyTXi75qCgYIARAAGAQSNwF-L9Ir4muSGclUQC6M85d7ckeND3rEmeH-AEGaxnoA5-KT7hKeJg7auj4ECxwEmdx0rBH3I_0'

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

  try {
    const accessToken = oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'buyjorgito@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'buyjorgito@gmail.com',
      to: email,
      subject: 'Booking',
      text: 'Booking done successfully',
      html: 'Booking done successfully!',
    };

    const result = transport.sendMail(mailOptions);

    res.status(200).json({ response: result })
  } catch (error) {
    return error;
  }
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
