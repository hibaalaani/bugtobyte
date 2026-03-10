import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

interface BookingEmailData {
  parentName:  string
  parentEmail: string
  date:        string
  time:        string
  courseName?: string
  zoomLink?:   string
  bookingId:   string
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const html = `<!DOCTYPE html>
<html>
<body style="font-family:'DM Sans',sans-serif;background:#050A12;padding:40px 24px;color:#F0EFE7">
  <div style="max-width:560px;margin:0 auto;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden">
    <div style="background:linear-gradient(135deg,rgba(0,255,135,.15),rgba(99,102,241,.1));padding:40px;text-align:center;border-bottom:1px solid rgba(255,255,255,.08)">
      <div style="font-family:Syne,sans-serif;font-weight:800;font-size:28px;margin-bottom:8px">Bug<span style="color:#00FF87">To</span>Byte</div>
      <h1 style="font-size:24px;margin:0;color:#F0EFE7">Your Demo is Confirmed! 🚀</h1>
    </div>
    <div style="padding:40px">
      <p style="color:rgba(240,239,231,.8);font-size:16px;line-height:1.7">Hi <strong>${data.parentName}</strong>,</p>
      <p style="color:rgba(240,239,231,.6);font-size:15px;line-height:1.7">Your free demo lesson is confirmed:</p>
      <div style="background:rgba(0,255,135,.06);border:1px solid rgba(0,255,135,.2);border-radius:10px;padding:24px;margin:24px 0">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#00FF87;font-weight:700;font-size:14px;width:80px">📅 Date</td><td style="color:#F0EFE7;font-size:15px">${data.date}</td></tr>
          <tr><td style="padding:8px 0;color:#00FF87;font-weight:700;font-size:14px">🕐 Time</td><td style="color:#F0EFE7;font-size:15px">${data.time}</td></tr>
          ${data.courseName ? `<tr><td style="padding:8px 0;color:#00FF87;font-weight:700;font-size:14px">📚 Course</td><td style="color:#F0EFE7;font-size:15px">${data.courseName}</td></tr>` : ''}
          ${data.zoomLink   ? `<tr><td style="padding:8px 0;color:#00FF87;font-weight:700;font-size:14px">🎥 Zoom</td><td><a href="${data.zoomLink}" style="color:#60A5FA">Join Meeting</a></td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#00FF87;font-weight:700;font-size:14px">🎫 ID</td><td style="color:rgba(240,239,231,.4);font-size:12px;font-family:monospace">${data.bookingId}</td></tr>
        </table>
      </div>
      ${data.zoomLink ? `<div style="text-align:center;margin:28px 0"><a href="${data.zoomLink}" style="background:linear-gradient(135deg,#00FF87,#00D4AA);color:#050A12;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">🎥 Join Zoom Meeting</a></div>` : ''}
      <p style="color:rgba(240,239,231,.5);font-size:14px;line-height:1.7">Can't make it? Simply reply to this email and we'll reschedule.</p>
    </div>
    <div style="padding:20px;text-align:center;border-top:1px solid rgba(255,255,255,.06)">
      <p style="color:rgba(240,239,231,.3);font-size:12px;margin:0">BugToByte Academy · Making tomorrow's innovators 🤖</p>
    </div>
  </div>
</body>
</html>`

  await Promise.all([
    transporter.sendMail({ from: process.env.FROM_EMAIL, to: data.parentEmail, subject: `✅ Demo Confirmed — ${data.date} at ${data.time}`, html }),
    transporter.sendMail({ from: process.env.FROM_EMAIL, to: process.env.ADMIN_EMAIL, subject: `[ADMIN] New Booking: ${data.parentName} — ${data.date}`, html: `<p>New booking from <strong>${data.parentName}</strong> (${data.parentEmail})</p><p>Date: ${data.date} at ${data.time}</p><p>ID: ${data.bookingId}</p>` }),
  ])
}
