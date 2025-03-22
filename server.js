import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4Y_7Ip-VsVCRtNyssIcQ3bWZt9J1m6sCYiKhKYYF9DwqTIUhye_ZqPdk0q698l9IR/exec";

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await axios.get(GOOGLE_SCRIPT_URL);
    const rows = response.data; // Expecting an array

  

    if (!Array.isArray(rows)) {
      throw new Error("Invalid data format received from Google Sheets");
    }

    const user = rows.find(row => Array.isArray(row) && row.length >= 2 &&
      row[0]?.trim() === email.trim() && row[1]?.trim() === password.trim());

    if (user) {
      console.log("✅ Login successful for:", email);
      res.json({ success: true, message: "Login successful" });
    } else {
      console.log("❌ Invalid credentials for:", email);
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("❌ Error fetching Google Sheets data:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
