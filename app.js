const express = require('express');
const { engine } = require('express-handlebars');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');



const app = express();
const port = 3000;

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json())


app.get('/cv',  async (req , res) => {
    const source = `
    
        <div> <h1> {{name}} </h1> </div>
    `
    ///compile  the above handlebars templates
    const template = handlebars.compile(source)

    //DEfine the data to be used in the template
    const data  = {
        name : "HAri PRasad"
    }

    //render the html from the template and data 
    const html = template(data)

    //Generate the PDF using Puppeteer
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 60000 // Increase launch timeout to 60 seconds
    });
    const page = await  browser.newPage()
    //page.setDefaultNavigationTimeout(10 * 60 * 1000)
    await page.setContent(html)
    const pdf = await page.pdf({
        format: 'A4',
        margin : {top: '30px',bottom: '30px',left: '10px',right:'10px'}
    })
    await browser.close()

    res.send('Content-Type', "application/pdf")

    res.send(pdf)

})



// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});