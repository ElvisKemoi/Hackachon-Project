/* const express = require("express");
const app = express();
const request = require("request");
const https = require("https")
const ussd = require("node-ussd"); */
/* definition of costs */
// const ussd = require('node-ussd');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


// Functions for option 1
 


/* middleware to pass ussd code */
app.use(bodyParser.json());

// Define ussd session
const sessions ={};

// Handling ussd requests

app.post('/', (req,res)=>{
    const sessionId = req.body.sessionId;
    const phoneNumber = req.body.phoneNumber;
    const text = req.body.text;

    let response;
    // check if the session exists
    if (!sessions[sessionId]){
        sessions[sessionId]= {step:1};
    }

    // implement ussd logic
    switch (sessions[sessionId].step){
        case 1:
            response = "Welcome to my weather app. Press 1 for option 1, 2 for option 2.";
            sessions[sessionId].step=2;
            break;
        case 2:
            if (text=== '1'){
                response= "You selected option 1."

            }else if (text === '2'){
                response = "You selected option 2.";

            }else{
                response = "Invalid option. Please Press 1 for option 1, 2 for option 2."

            }
            break;
        default:
            response = "Invalid input.";
            break;

        }
//send ussd response

res.json({
    sessionId: sessionId,
    message: response,
    menu:false //set to true if you want to display a menu
});
});

    


// app.get("/", (req, res)=>{
    // const credentials = {
        // apiKey: '47309b6928b9ff2323708d47e1bd58dbfb1f419f2022b28643382f0c42c8dbf5',         // use your sandbox app API key for development in the test environment
        // username: 'sandbox',      // use 'sandbox' for development in the test environment
    // };
    // const AfricasTalking = require('africastalking')(credentials);
    
    // Initialize a service e.g. SMS
    // const sms = AfricasTalking.SMS
    
    // Use the service
    // const options = {
    //     to: ['+254757823496'],
    //     message: "I'm a lumberjack and its ok, I work all night and sleep all day"
    // }
    
    // Send message and capture the response or error
//     sms.send(options)
//         .then( response => {
//             console.log(response);
//         })
//         .catch( error => {
//             console.log(error);
//         });



// })






app.listen(port, ()=>{
    console.log("Server is live at port " + port)
})