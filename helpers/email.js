import nodemailer from 'nodemailer';

const emailRegistro = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
            auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD
            }
      });

      const { nombre, email, token} = datos;
      await transport.sendMail({
        from: 'PruebasNodeJS.com',
        to: email,
        subject: 'Confirma tu cuenta en NodeJS',
        text: 'Confirma tu cuenta en NodeJS',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en NodeJS.com</p>
            <p>Tu cuenta ya esta lista, solo debe configurarla en el siguiente enlace: 
            <a href="${process.env.BACKENDURL}:${process.env.PORT ?? 3000}/bienes-raices/auth/confirmar/${token}">
            Confirmar cuenta</a></p>

            <p>Si tu no creaste esta cuenta puedes ingorarla</p>
        `
      });
}

const emailNuevoPassword = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
            auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD
            }
      });

      const { nombre, email, token} = datos;
      await transport.sendMail({
        from: 'PruebasNodeJS.com',
        to: email,
        subject: 'Restablecer tu password en Node.js',
        text: 'Restablecer tu password en Node.js',
        html: `
            <p>Hola ${nombre}, has solicitado restablecer tu password en NodeJS.com</p>
            <p>Sigue el siguiente enlace para generar un password nuevo:
            <a href="${process.env.BACKENDURL}:${process.env.PORT ?? 3000}/bienes-raices/auth/restaurar-password/${token}">
            Restablecer password</a></p>

            <p>Si tu no solicitaste este cambio puedes ingorar este correo.</p>
        `
      });
}

export {
    emailRegistro,
    emailNuevoPassword
}