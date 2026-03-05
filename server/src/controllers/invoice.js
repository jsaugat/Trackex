import pdf from "html-pdf";
import path from "path";
import template from "../documents/index.js";

const __dirname = path.resolve();

/**
 *  @desc    CREATE a PDF
 *  @route   POST /api/revenue/invoice
 */
const createInvoicePDF = (req, res) => {
  const products = req.body; // received format: [{},{},{},{},{},{}]

  pdf
    .create(template(products), {})
    .toFile(`${__dirname}/invoice.pdf`, (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to create PDF" });
      }
      return res.status(200).json({ fileName: "invoice.pdf" });
    });
};

/**
 *  @desc    GET the PDF
 *  @route   GET /api/revenue/invoice/:fileName
 */
const getInvoicePDF = (req, res) => {
  const { fileName } = req.params;
  res.sendFile(`${__dirname}/${fileName}`);
};

export { getInvoicePDF, createInvoicePDF };
