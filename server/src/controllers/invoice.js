import pdf from "html-pdf";
import path from 'path';
import template from "../documents/index.js";

const __dirname = path.resolve();

/**
 *  @desc    CREATE a PDF
 *  @route   POST /api/revenue/invoice
 */
const createInvoicePDF = (req, res) => {
  const products = req.body; // received format: [{},{},{},{},{},{}]
  console.log("products", products);

  pdf.create(template(products), {}).toFile(`${__dirname}/invoice.pdf`, (err) => {
    if (err) {
      // res.status(500).send('Failed to create PDF');
      res.send(Promise.reject());
    }
    // res.status(200).send({ fileName: 'invoice.pdf' }); // Return the file name in the response
    res.send(Promise.resolve());
  });
}

/**
 *  @desc    GET the PDF
 *  @route   GET /api/revenue/invoice/:fileName
 */
const getInvoicePDF = (req, res) => {
  const { fileName } = req.params;
  res.sendFile(`${__dirname}/${fileName}`);
}

export { getInvoicePDF, createInvoicePDF };
