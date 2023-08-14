const router = require("express").Router();
require("dotenv").config();
const stripe = require('stripe')("sk_test_51LOmW7EudbBbgrFH8w0cTrdJo1TSKyWNAK8B3IYz76u6S3cvT50tSvgKgOCCPkeFmPLCs94aMmxUTQD88WZwIeMV00SdSWu3pR");
const FRONTEND_URL =  process.env.ORIGIN || "http://localhost:3000";
const endpointSecret = process.env.SIGNATURE_KEY;


router.get("/", (req, res, next) => {
  res.json("All good in here");
});



router.post('/create-checkout-session', async (req, res, next) => {
    const { priceId } = req.body;  

    console.log(priceId);
    try{
    
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${FRONTEND_URL}/success`,
        cancel_url: `${FRONTEND_URL}/shop`,
        automatic_tax: {enabled: true},
      });
      console.log(session);
        res.json({ id: session.id });
      } catch (e) {
        return res.status(400).send({
          error:{
            message: e.message,
          },
        });
      }
  
    });




  router.post('/webhook',  (req, res, next) => {
 
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return   res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type ===  'checkout.session.async_payment_succeeded'){

    const sessionId = event.data.object.id;
    const customerEmail = event.data.object.customer_email;
    const lineItems = event.data.object.display_items;

    console.log(lineItems);
    console.log(customerEmail);

    const productInfo = lineItems.find(item => {
      
      return item.custom.name === "Your Product Name";
    });

    if(productInfo){

      let emailSubject = '';
      let emailText = '';  

      if(productInfo.custom.name === "Lapicide - Web (Socials + Apps) / S License ( 2-5 Employees)"){
        emailSubject = 'Confirmation de paiement pour Lapicide par Emilie Vizcano';
        emailText = `Thanks for purchasing Lapicide ! You should received your type soon by email. Don’t forget to credite me and don’t hesitate to share with me your artworks so I can share it! :)`;
      } else {
        emailSubject="no"
        emailText= "no"
      }


      try{
        const transporter = nodemailer.createTransport({
          service: 'your-email-service',
          auth: {
            user: 'your-email@example.com',
            pass: 'your-email-password',
          },
        });

        const mailOptions = {
          from: "em.vizcano@gmail.com",
          to: customerEmail,
          subject: emailSubject,
          text: emailText,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error){
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.res);
          }
        });
      
      } catch (error){
      console.error("Error sending Email:", error);
      }  
    }
    }  
  });

module.exports = router;
