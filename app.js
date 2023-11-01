const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");

const app = express()
app.use(express.json())
app.disable('x-powered-by')

/* // CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}); */

app.post('/sendMail', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  const { to, subject, html } = req.body

  const CLIENT_ID = '389196242479-01fnjob369jc4c3tiqtbqngbkl57io2t.apps.googleusercontent.com'
  const CLIENT_SECRET = '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'
  const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
  const REFRESH_TOKEN = '1//04mmG8sMEp0FWCgYIARAAGAQSNwF-L9IrDzWyjEPMjy0Zlu8ULNPDJDjhgHyhXvINHHaDh35GeYsRBlFVnqBClbH5IBDHDV8yr9U'

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

  try {
    const accessToken = await oAuth2Client.getAccessToken();

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
      to: to,
      subject: subject,
      text: 'Hello from gmail email using API',
      html: html,
    };

    const result = await transport.sendMail(mailOptions);

    res.status(200).json({ response: result })
  } catch (error) {
    return error;
  }
})

const PORT = process.env.PORT ?? 1234

app.options('/sendMail', (res, req) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
