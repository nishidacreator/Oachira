const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const downloadsDir = path.join(__dirname, "../../downloads");
fs.mkdirSync(downloadsDir, { recursive: true });

router.use(express.json()); // Middleware to parse JSON requests

router.post("/", async (req, res) => {
  const po = req.body;

  // Check if userInput is defined
  if (po === undefined) {
    return res
      .status(400)
      .json({ error: "Data is missing in the request body" });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the page size to match the billing paper size (79mm width)
    await page.setViewport({ width: 79, height: 297 }); 

    const filename = `file-${po.poNumber}.pdf`;
    const filePath = path.join(downloadsDir, filename);

    const htmlContent = `
    <html>
    <head>
    <style>
    .container {
      border: 1px solid black;
            }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid black;
      }
      
      body {
        font-size: 8px; /* Adjust the font size as needed */
        margin: 5px; /* Adjust margins as needed */
      }
      .company {
        display: flex;
        align-items: center;
      }
      
      .logo img {
        max-width: 150px;
        height: auto;
      }
      
      .header-content {
        max-width:400px;
        flex: 1;
        padding-left: 20px;
      }
      
      .header-content h1 {
        font-size: 24px;
        margin-bottom: 5px;
      }
      
      .header-content p {
        font-size: 14px;
        margin: 2px 0;
      }
      
      .po-details {
        border-left:1px solid black;
        flex: 2; 
      }
      
      .po-details h2 {
        border-bottom:1px solid black;
        font-size: 18px;
        padding-left:10px;
        margin-bottom: 10px;
      }
      
      .po-details p {
        padding-left:10px;
        font-size: 14px;
        margin: 5px 0;
      }
      .purchaseDetails {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid black;
        }
      .fromDetails {
        border-left:1px solid black;
        flex: 2; 
      }
      
      .fromDetails h2 {
        font-size: 18px;
        padding-left:10px;
        margin-bottom: 10px;
      }
      
      .fromDetails p {
        padding-left:10px;
        font-size: 14px;
        margin: 5px 0;
      }

      .toDetails {
        border-left:1px solid black;
        flex: 2; 
      }
      
      .toDetails h2 {
        font-size: 18px;
        padding-left:10px;
        margin-bottom: 10px;
      }
      
      .toDetails p {
        padding-left:10px;
        font-size: 14px;
        margin: 5px 0;
      }
      
      .po-items {
        margin: 20px 0;
        padding: 20px;
      }
      
      .po-items h2 {
        font-size: 18px;
        margin-bottom: 10px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      
      th, td {
        padding: 8px;
        text-align: left;
      }
      
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .totals {
        margin-top: 10px;
        font-weight: bold;
        text-align: right;
      }
      
      .footer {
        background-color: #4968a4;
        color: white;
        padding: 10px;
        text-align: left;
        font-size: 12px;
      }    
      </style>
      </head>
      <body>
      <div>    
      <div class="po-items">
        <h2>Purchase Order Items</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Item</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${po
            .map(
            (item) => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.count}</td>
            </tr>
            `
            )
            .join("")}
          </tbody>
                </table>
      </div>    
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);
  await page.pdf({ path: filePath });

  await browser.close();

  // Set the response header to instruct the browser to open the downloaded file in a new tab
  res.setHeader("Content-Disposition", `inline; filename=${filename}`);
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: "An error occurred" });
}
});

router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(downloadsDir, filename);

  // Set the response header for file download
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  // Send the PDF file as a response for download
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Calculate the total tax amount for the purchase order
function calculateTotalTax(po) {
  let totalTax = 0;
  if (po && po.purchaseOrderDetails) {
    for (const item of po.purchaseOrderDetails) {
      const taxAmount = calculateTax(item);
      totalTax += taxAmount;
    }
  }
  return totalTax;
}

// Calculate the total amount for the purchase order
function calculateTotalAmount(po) {
  return (
    calculateTotalLineAmount(po) + calculateTotalTax(po) + (this.charges || 0)
  );
}

charges = 0;

function calculateLineAmount(po) {
  return item.quantity * item.unitPrice;
}

function calculateTotalLineAmount(po) {
  let total = 0;
  if (po && po.purchaseOrderDetails) {
    for (const item of po.purchaseOrderDetails) {
      total += calculateLineAmount(item);
    }
  }
  return total;
}

function calculateTax(item) {
  // Implement your tax calculation logic here
  return 0;
}
{/* <strong>
<h1>${company[0].companyLocationType}</h1>
<p>${company[0].address}</p>
<p>${company[0].phoneNumber}</p>
<p>${company[0].email}</p>
</strong> */}
module.exports = router;
