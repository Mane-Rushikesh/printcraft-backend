const nodemailer = require("nodemailer");

// ======================================
// GMAIL SMTP CONFIGURATION
// ======================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  // Gmail SMTP - STARTTLS
  port: 587,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  // Connection settings
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  // Prefer IPv4
  family: 4,
});

// ======================================
// SEND ORDER CONFIRMATION EMAIL
// ======================================

const sendOrderConfirmation = async ({
  to,
  customerName,
  orderId,
  items,
  totalAmount,
}) => {
  try {
    const itemsHtml = items
      .map(
        (item) => `
          <tr>
            <td style="
              padding:12px;
              border-bottom:1px solid #eeeeee;
            ">
              ${item.name}
            </td>

            <td style="
              padding:12px;
              border-bottom:1px solid #eeeeee;
              text-align:center;
            ">
              ${item.quantity}
            </td>

            <td style="
              padding:12px;
              border-bottom:1px solid #eeeeee;
              text-align:right;
            ">
              ₹${Number(item.price).toFixed(2)}
            </td>
          </tr>
        `
      )
      .join("");

    const mailOptions = {
      from: `"PrintCraft" <${process.env.EMAIL_USER}>`,

      to,

      subject: `PrintCraft - Order Confirmed #${orderId}`,

      html: `
<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8">

  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

  <title>PrintCraft Order Confirmation</title>

</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f4f4;
  font-family:Arial, Helvetica, sans-serif;
">

  <div style="
    max-width:650px;
    margin:30px auto;
    background:#ffffff;
    border-radius:14px;
    overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,0.08);
  ">

    <!-- HEADER -->

    <div style="
      background:#111111;
      color:#ffffff;
      padding:30px;
      text-align:center;
    ">

      <h1 style="
        margin:0;
        font-size:28px;
        letter-spacing:2px;
      ">
        PRINTCRAFT
      </h1>

      <p style="
        margin:8px 0 0;
        font-size:14px;
        color:#dddddd;
      ">
        Professional Printing Solutions
      </p>

    </div>


    <!-- CONTENT -->

    <div style="padding:30px;">

      <h2 style="
        margin-top:0;
        color:#222222;
      ">
        Order Confirmed! 🎉
      </h2>

      <p style="
        font-size:15px;
        line-height:1.6;
        color:#555555;
      ">
        Hello <strong>${customerName}</strong>,
      </p>

      <p style="
        font-size:15px;
        line-height:1.6;
        color:#555555;
      ">
        Thank you for shopping with PrintCraft.
        Your order has been successfully placed.
      </p>


      <!-- ORDER INFO -->

      <div style="
        background:#f7f7f7;
        padding:18px;
        border-radius:10px;
        margin:25px 0;
      ">

        <p style="margin:5px 0;">
          <strong>Order ID:</strong>
          #${orderId}
        </p>

        <p style="margin:5px 0;">
          <strong>Status:</strong>
          Pending
        </p>

      </div>


      <!-- PRODUCTS -->

      <h3 style="
        color:#222222;
        margin-bottom:10px;
      ">
        Order Items
      </h3>

      <table style="
        width:100%;
        border-collapse:collapse;
        font-size:14px;
      ">

        <thead>

          <tr style="
            background:#f5f5f5;
          ">

            <th style="
              padding:12px;
              text-align:left;
            ">
              Product
            </th>

            <th style="
              padding:12px;
              text-align:center;
            ">
              Quantity
            </th>

            <th style="
              padding:12px;
              text-align:right;
            ">
              Price
            </th>

          </tr>

        </thead>

        <tbody>

          ${itemsHtml}

        </tbody>

      </table>


      <!-- TOTAL -->

      <div style="
        margin-top:25px;
        padding-top:18px;
        border-top:2px solid #111111;
        text-align:right;
      ">

        <span style="
          font-size:16px;
          color:#555555;
        ">
          Total Amount
        </span>

        <br>

        <strong style="
          font-size:24px;
          color:#111111;
        ">
          ₹${Number(totalAmount).toFixed(2)}
        </strong>

      </div>


      <!-- MESSAGE -->

      <p style="
        margin-top:30px;
        font-size:15px;
        line-height:1.6;
        color:#555555;
      ">
        We will process your order and keep you updated
        about its status.
      </p>

      <p style="
        font-size:15px;
        color:#555555;
      ">
        Thank you for choosing
        <strong>PrintCraft</strong>.
      </p>

    </div>


    <!-- FOOTER -->

    <div style="
      background:#f5f5f5;
      padding:20px;
      text-align:center;
      color:#777777;
      font-size:13px;
    ">

      © PrintCraft — Professional Printing Solutions

    </div>

  </div>

</body>

</html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Order confirmation email sent to ${to}`
    );

    console.log(
      "Email Message ID:",
      info.messageId
    );

    return info;

  } catch (error) {

    console.error(
      "Order email error:",
      error
    );

    throw error;
  }
};


// ======================================
// EXPORT
// ======================================

module.exports = {
  transporter,
  sendOrderConfirmation,
};