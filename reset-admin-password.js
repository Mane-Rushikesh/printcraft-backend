const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function resetAdminPassword() {
  try {
    const newPassword = process.argv[2];

    if (!newPassword) {
      console.log("Please provide a new password.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, "manerushikesh423@gmail.com"]
    );

    if (result.affectedRows === 0) {
      console.log("Admin user not found.");
    } else {
      console.log("Admin password updated successfully.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Password reset error:", error);
    process.exit(1);
  }
}

resetAdminPassword();
