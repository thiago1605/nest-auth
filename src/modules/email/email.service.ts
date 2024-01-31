// // email.service.ts
// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailService {
//   private transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         // user: 'luz9983@gmail.com',
//         user: 'iemojis.io@gmail.com',
//         // pass: 'DBolinhas2004',
//         pass: 'hqme eaxe vtoh dbre',
//       },

//       tls: {
//         rejectUnauthorized: false,
//       },
//     });
//   }

//   async sendVerificationEmail(
//     email: string,
//     verificationToken: string,
//   ): Promise<void> {
//     const mailOptions = {
//       from: 'iemojis.io@gmail.com',
//       to: [email],
//       subject: 'iEmoji.io 🌠 - Verificação de Email',
//       html: `
//               <div style="background-color: #2c3e50; color: #ecf0f1; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif; text-align: center;">
//   <h2 style="color: #3498db;">iEmoji.io 🌠</h2>
//   <p>Olá,</p>
//   <p>Seu token de verificação: <strong>${verificationToken}</strong></p>
//   <p>Por favor, clique no botão abaixo para verificar seu e-mail:</p>
//   <a href="http://seuapp.com/verificar-email?token=${verificationToken}" style="background-color: #3498db; color: #fff; padding: 10px 15px; text-decoration: none; display: inline-block; border-radius: 5px; margin-top: 15px;">Verificar e-mail</a>
//   <div style="background-color: #1f2a38; padding: 20px; border-radius: 5px; margin-top: 30px; margin-bottom: 10px; color: #ccc">
//     <small style="display: block;">Caso não tenha solicitado esta verificação, por favor, ignore este e-mail.</small>
//     <small style="display: block; margin-top: 5px;">Atenciosamente,<br/>Equipe iEmoji.io</small>
//   </div>
// </div>
//       `,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//     } catch (error) {
//       console.error(
//         `Erro ao enviar e-mail de verificação para ${email}: ${error.message}`,
//       );
//     }
//   }
// }

// email.service.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private async sendMail(
    mailOptions: nodemailer.SendMailOptions,
  ): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao enviar e-mail de verificação.',
        { cause: error },
      );
    }
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const verificationToken = randomUUID();

    const mailOptions = {
      from: 'iemojis.io@gmail.com',
      to: [email],
      subject: 'iEmoji.io 🌠 - Verificação de Email',
      html: `
        <div style="background-color: #2c3e50; color: #ecf0f1; padding: 20px; border-radius: 10px; font-family: 'Arial', sans-serif; text-align: center;">
          <h2 style="color: #3498db;">iEmoji.io 🌠</h2>
          <p>Olá,</p>
          <p>Por favor, copie seu código de verificação abaixo:</p>
          <div style="background-color: #3498db; color: #fff; padding: 10px 15px; text-decoration: none; display: inline-block; border-radius: 5px; margin-top: 15px;"><strong>${verificationToken}</strong></div>
          <div style="background-color: #1f2a38; padding: 20px; border-radius: 5px; margin-top: 30px; margin-bottom: 10px; color: #ccc">
            <small style="display: block;">Caso não tenha solicitado esta verificação, por favor, ignore este e-mail.</small>
            <small style="display: block; margin-top: 5px;">Atenciosamente,<br/>Equipe iEmoji.io</small>
          </div>
        </div>
      `,
    };

    await this.sendMail(mailOptions);
    await this.cacheManager.set(verificationToken, email, 300);
    console.log(verificationToken);

    const token = await this.verifyEmailAndProceed(verificationToken);
    console.log(token);
  }

  async verifyEmailAndProceed(token: string): Promise<boolean> {
    let isEmailVerified = false;

    const email = await this.cacheManager.get(token);
    isEmailVerified = !!email;

    // if (email) await this.cacheManager.del(token);
    return isEmailVerified;
  }
}
