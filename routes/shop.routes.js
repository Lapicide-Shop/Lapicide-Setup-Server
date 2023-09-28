const express = require("express")
const router = require("express").Router();

require("dotenv").config();
const stripe = require('stripe')(process.env.PRIVATE_KEY_STRIPE);
const FRONTEND_URL =  process.env.ORIGIN || "http://localhost:3000";
const endpointSecret = process.env.SIGNATURE_KEY;
const nodemailer = require("nodemailer");

console.log(process.env.PRIVATE_KEY_STRIPE);
router.get("/", (req, res, next) => {
  res.json("All good in here");
});



router.post('/create-checkout-session', async (req, res, next) => {
    const { priceId } = req.body;
    console.log(process.env.PRIVATE_KEY_STRIPE);
 
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
        success_url: `${FRONTEND_URL}`,
        cancel_url: `${FRONTEND_URL}/shop`,
        automatic_tax: {enabled: true},
      });
        res.json({ id: session.id });
      } catch (e) {
        return res.status(400).send({
          error:{
            message: e.message,
          },
        });
      }
  
    });




 router.post('/webhook', express.raw({type: 'application/json'}),  (req, res, next) => {
   let event= req.body;
   console.log(event);
  const sig = request.headers['stripe-signature'];



  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return response.sendStatus(400)
  }
  

  if (event.type ===  'checkout.session.completed'){

    const sessionId = event.data.object.id;
    const customerEmail = event.data.object.customer_email;
    const productId = event.data.object.display_items[0].custom.product_id;

    console.log(productId);
    console.log(customerEmail);


    if(productId){

      let attachmentPath = '';
      let emailSubject = '';
      let emailText = '';  

      if (productId === "price_1NdFFZEudbBbgrFHFIaBR6UN" || "price_1NdFHKEudbBbgrFHthrawpKL" || "price_1NdFHzEudbBbgrFHvmphRtaw" || "price_1NdFIREudbBbgrFHhBdC4l46"){
        emailSubject = 'Confirmation de paiement pour Lapicide par Emilie Vizcano';
        emailText = `Thanks for purchasing Lapicide ! You should received your type soon by email. Don’t forget to credite me and don’t hesitate to share with me your artworks so I can share it! :)`;
        attachmentPath = ""
      } else if (productId === "price_1NdFJUEudbBbgrFHqCASyZWM" || "price_1NdFKEEudbBbgrFHDqaaHqMR" || "price_1NdFKgEudbBbgrFHhcyK4Sxo" || "price_1NdFL2EudbBbgrFHWoWm5zJB" || "price_1Nf5XgEudbBbgrFHjGRhUT2s"){
        emailSubject = 'Confirmation de paiement pour Lapicide par Emilie Vizcano';
        emailText = `Thanks for purchasing Lapicide ! You should received your type soon by email. Don’t forget to credite me and don’t hesitate to share with me your artworks so I can share it! :)`;
        attachmentPath = ""
      } else if (productId === "price_1NdFMdEudbBbgrFHNupiNdhO" || "price_1NdFNCEudbBbgrFHEJPu5gAP" || "price_1NdFQzEudbBbgrFH8HyY2qOF" || "price_1NdFTpEudbBbgrFHGmULRTav"){
        emailSubject = 'Confirmation de paiement pour Lapicide par Emilie Vizcano';
        emailText = `Thanks for purchasing Lapicide ! You should received your type soon by email. Don’t forget to credite me and don’t hesitate to share with me your artworks so I can share it! :)`;
        attachmentPath = ""
      };


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

    res.send();
  });  

module.exports = router;
