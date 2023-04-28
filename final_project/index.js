const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const token = req.session.token;
console.log(token);
if (!token) {
  res.status(401).json({ message: "Unauthorized" });
} else {
  try {
    const decoded = jwt.verify(token, "123");
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
});
 
const PORT =5500;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

