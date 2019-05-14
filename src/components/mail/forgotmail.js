import  hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.EMAIL,
      pass = process.env.PASSWORD;

const smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: './mailTemplates',
    layoutsDir: './mailTemplates',
  },
  viewPath: path.resolve('./src/components/mail/mailTemplates'),
  extName: '.html',
};

smtpTransport.use('compile', hbs(handlebarOptions));

export default smtpTransport;
