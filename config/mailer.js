const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOrderConfirmation = async ({
  to,
  customerName,
  orderId,
  items,
  totalAmount,
}) => {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;">
            ${item.name}
          </td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
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
      <body style="
        margin:0;
        padding:0;
        background:#f5f5f5;
        font-family:Arial,sans-serif;
      ">

        <div style="
          max-width:650px;
          margin:30px auto;
          background:white;
          border-radius:12px;
          overflow:hidden;
          box-shadow:0 3px 15px rgba(0,0,0,0.08);
        ">

          <div style="
            background:#111;
            color:white;
            padding:25px;
            text-align:center;
          ">
            <h1 style="margin:0;">PRINTCRAFT</h1>
            <p style="margin:8px 0 0;">
              Order Confirmation
            </p>
          </div>

          <div style="padding:30px;">

            <h2>Hello ${customerName},</h2>

            <p>
              Thank you for shopping with PrintCraft.
              Your order has been successfully placed.
            </p>

            <div style="
              background:#f7f7f7;
              padding:15px;
              border-radius:8px;
              margin:20px 0;
            ">
              <strong>Order ID:</strong> #${orderId}<br>
              <strong>Status:</strong> Pending
            </div>

            <h3>Order Items</h3>

            <table style="
              width:100%;
              border-collapse:collapse;
              margin-top:10px;
            ">

              <thead>
                <tr style="background:#f5f5f5;">
                  <th style="padding:10px;text-align:left;">
                    Product
                  </th>

                  <th style="padding:10px;text-align:center;">
                    Quantity
                  </th>

                  <th style="padding:10px;text-align:right;">
                    Price
                  </th>
                </tr>
              </thead>

              <tbody>
                ${itemsHtml}
              </tbody>

            </table>

            <div style="
              margin-top:25px;
              padding-top:15px;
              border-top:2px solid #111;
              text-align:right;
              font-size:20px;
            ">
              <strong>Total: ₹${Number(totalAmount).toFixed(2)}</strong>
            </div>

            <p style="margin-top:30px;">
              We will process your order and keep you updated
              about its status.
            </p>

            <p>
              Thank you for choosing <strong>PrintCraft</strong>.
            </p>

          </div>

          <div style="
            background:#f5f5f5;
            padding:20px;
            text-align:center;
            color:#666;
            font-size:13px;
          ">
            © PrintCraft — Professional Printing Solutions
          </div>

        </div>

      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendOrderConfirmation,
};