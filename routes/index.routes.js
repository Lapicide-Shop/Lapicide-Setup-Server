const router = require("express").Router();
const stripe = require('stripe')(process.env.PRIVATE_KEY_STRIPE);
const FRONTEND_URL =  process.env.ORIGIN || "http://localhost:3000";

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

module.exports = router;
