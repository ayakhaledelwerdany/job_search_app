import nodemailer from 'nodemailer'

export const sendEmail = async ({to = '', subject = '', html= '', text = ''})=>{
    const transporter =  nodemailer.createTransport({
        service:'gmail',
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "ayaelwerdany44@gmail.com",
          pass: "nxvdmysotgdiseqi",
          //slmb oawo eqnx ymkj
        },
        tls: {
            rejectUnauthorized: false
          }
      });
      const info = await transporter.sendMail({
        from: '"Aya Khaled e-commerce👻" <ayaelwerdany44@gmail.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        html, // html body
        text,
      });

      console.log("Message sent: %s", info.messageId);
}