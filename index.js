const fs = require('fs');
const http = require('http');
const url = require('url');

// own module
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////
////////// File System Module //////////
///////////////////////////////////////

// // reading file blocking
// const text = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(text);

// // writing file blocking
// const textIn = `This is we know about the avocado: ${text}.\nCreate on ${Date.now()}`;
// fs.writeFileSync('./txt/enteredText.txt', textIn);

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => console.log(data));

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//   fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, text) => {
//     console.log(text);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, append) => {
//       console.log(append);

//       fs.writeFile('./txt/final.txt', `${text}\n${append}`, 'utf-8', err => {
//         console.log('Your file has been written 📝');
//       });
//     });
//   });
// });

// console.log('Some text after fs command');




/////////////////////////////////////////
///////////// HTTP Module //////////////
///////////////////////////////////////
// Functions
// const replaceTemplate = (temp, product) => {
//   let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//   output = output.replace(/{%IMAGE%}/g, product.image);
//   output = output.replace(/{%PRICE%}/g, product.price);
//   output = output.replace(/{%FROM%}/g, product.from);
//   output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//   output = output.replace(/{%QUANTITY%}/g, product.quantity);
//   output = output.replace(/{%DESCRIPTION%}/g, product.description);
//   output = output.replace(/{%ID%}/g, product.id);

//   if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

//   return output;
// };

// Get Templates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHTML = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHTML);

    res.end(output);

    // Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404);
    res.end('<h1>404 - Page not found</h1>');
  }
});

server.listen(2307, 'localhost', () => {
  console.log('listening on port 2307');
});