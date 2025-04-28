import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, 'otps.json');
// Read OTP data from file
function readOtpFile() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save OTP data to file
function writeOtpFile(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Save new OTP
function saveOtp(email, otp) {
  const otps = readOtpFile();
  // Remove old OTPs for this email
  const updatedOtps = otps.filter(entry => entry.email !== email);

  updatedOtps.push({
    email,
    otp,
    expiry: Date.now() + 5 * 60 * 1000 // expires in 5 minutes
  });

  writeOtpFile(updatedOtps);
}

// Verify OTP
function verifyOtp(email, otp) {
  const otps = readOtpFile();
  const record = otps.find(entry => entry.email === email);

  if (!record) return false;
  if (record.otp !== otp) return false;
  if (Date.now() > record.expiry) return false;

  // If verified, remove the OTP
  const updatedOtps = otps.filter(entry => entry.email !== email);
  writeOtpFile(updatedOtps);

  return true;
}

export{ 
    saveOtp,
    verifyOtp 
    };
