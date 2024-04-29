/* 
You will need to verify the URL parameter :state for most endpoints. 
It is best to just write the code for this once and include the middleware where needed. 
Permit lowercase, uppercase, and mixed versions of the state abbreviations to be accepted for the :state parameter. 
To create an array that only contains the 50 state abbreviation codes from the state.json data, you may find the array map method useful. 
You may also discover the array find method is useful afterwards.
Respond appropriately to an invalid state abbreviation code (see example project)
If the state code is valid, attach the value to the request object before calling next() because you will need to refer to it in the controller functions, too.

I have a middleware folder and in it, I have a verifyState.js file. 

This file is for a function called verifyState. Middleware is a function that you stick in the middle of your routing. It is typically called into action before you reach the methods in your controller(s). This project just has one controller statesController.js. 

This verifyState function will be used to verify that a valid state is requested.

We are using Node.js with the Express framework.  The docs have a lot of info with example on using middleware: https://expressjs.com/en/guide/using-middleware.html

That said, verifyState is not a complex function and uses the typical Express set up for middleware as it receives req, res, and next as parameters.

I'll outline the logic of the function below without providing the actual code. 

You will need to import your statesData.json file in this middleware file to refer to the data.

There should be a parameter sent with the request that is the state abbreviation. You will need to get this parameter value (refer to Express tutorials or docs for how to get it). After getting the value, I also set it to uppercase so it will match the states data.

You can use map() to map over the JSON data and create an array of only the state abbreviations.

You can use find() to then find out if the state abbreviation you received as a parameter is in the array of state codes.

If it isn't in the array, you want to return a bad request status with the required message.

If it is in the array, you will want to set the value on the request req.code = value for example - so it carries on to the controller.

Call next() to move from the middleware to what is next.
*/

const fsPromises = require('fs').promises;

const verifyState = async (req, res, next) => {
    const stateUpper = req.params.state.toUpperCase();
    data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const statesData = JSON.parse(data);
    const stateCodes = statesData.map((state) => state.code);
    if (!stateCodes.find((element) => element === stateUpper)) {
        return res.status(400).json({'message': 'Invalid state abbreviation parameter'});
    } else {
        req.params.state = stateUpper;
        next();
    }
}

module.exports = verifyState;