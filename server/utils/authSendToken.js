const sgMail = require('@sendgrid/mail');


const ActiveAccount = async(user) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: `${user.email}`,
        from: 'wotson2011lindo@hotmail.com',
        subject: 'Autenticação de conta',
        html: 
        `  Olá, ${user.username}!
        <br />
        <br />
       Acesse o Link abaixo para ativar sua conta
        <br />
        <p>
          http://localhost:3015/users/activeAccount/${user.id}
        </p>`,
      };
        try {
          await sgMail.send(msg);
          console.log("Mail sent!");
        } catch (error) {
          console.error(error);
      
          if (error.response) {
            console.error(error.response.body)
          }
        }
}
module.exports = ActiveAccount;