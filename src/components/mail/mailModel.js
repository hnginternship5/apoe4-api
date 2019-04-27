import nodeMailer from 'nodemailer';
import mustache from 'mustache';
import fs from 'fs';
const path = require("path");

module.exports = class MailModel {
    constructor(request) {
        this.name = request.name;
        this.email = request.email;
        this.message = request.message;
    }

    sendEmail(to, subject, template) {
        template = `/mailTemplates/${template}.mst`

        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'geneapoe@gmail.com',
                pass: 'apoe4gene'
            }
        });

        let mailOptions = {
            to: to,
            subject: subject,
            html: mustache.render(
                fs.readFileSync(path.resolve(__dirname)+template).toString(), this),
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw error;
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

    static validate(request) {
        if (this.isNotEmpty(request.name) &&
            this.isNotEmpty(request.email) &&
            this.isNotEmpty(request.message)) {
            return true;
        } else {
            throw "Missing Email Properties";
        }
    }

    static isNotEmpty(property) {
        if (property === null || property === "" || property === undefined) {
            return false;
        } else {
            return true;
        }
    }
}