export function verificationTemplate({ trackingCode, name }) {
  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>اعلان ارسال سفارش</title>

<style>
  body {
    background: #eef2f7;
    font-family: 'IRANSans', Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  .container {
    max-width: 620px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #e3e6ea;
    box-shadow: 0 10px 35px rgba(0,0,0,0.08);
  }

  .header {
    background: linear-gradient(135deg, #005afe, #00a2ff);
    padding: 30px 20px;
    text-align: center;
    color: white;
  }

  .header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
  }

  .content {
    padding: 35px 28px;
    color: #333;
    line-height: 1.9;
    font-size: 15px;
  }

  .hello {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #111827;
  }

  .track-box {
    background: #f1f7ff;
    border: 2px dashed #3b82f6;
    padding: 22px;
    border-radius: 14px;
    text-align: center;
    margin: 30px 0 25px 0;
  }

  .track-label {
    font-size: 15px;
    color: #1e40af;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .track-code {
    font-size: 30px;
    font-weight: 900;
    color: #1d4ed8;
    letter-spacing: 1px;
  }

  .button {
    display: inline-block;
    background: #2563eb;
    color: white !important;
    padding: 16px 26px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    margin-top: 20px;
    transition: 0.3s;
  }

  .button:hover {
    background: #1e3a8a;
  }

  .info-box {
    background: #f9fafb;
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 25px;
    border: 1px solid #e5e7eb;
    color: #374151;
  }

  .footer {
    text-align: center;
    font-size: 13px;
    color: #6b7280;
    padding: 22px;
    background: #f9fafb;
  }
</style>
</head>

<body>

<div class="container">

  <div class="header">
    <h1>ارسال سفارش شما</h1>
  </div>

  <div class="content">

    <p class="hello">عزیز 🌿 ${name} سلام</p>

    <p>
      سفارش شما با موفقیت <strong>ارسال شد</strong> ✨  
      جهت پیگیری وضعیت بسته خود، می‌توانید از کد رهگیری زیر استفاده کنید.
    </p>

    <div class="track-box">
      <div class="track-label">کد رهگیری پستی شما:</div>
      <div class="track-code">${trackingCode}</div>
    </div>

    <div style="text-align:center;">
      <a href="https://www.post.ir/" class="button" target="_blank">
        پیگیری آنلاین مرسوله
      </a>
    </div>

    <div class="info-box">
      در صورت نیاز به راهنمایی بیشتر، تیم پشتیبانی ما همیشه در کنار شماست.
      <br />
      از اینکه به ما اعتماد کردید، سپاسگزاریم 💙
    </div>

  </div>

  <div class="footer">
    این پیام به صورت خودکار ارسال شده است — لطفاً به آن پاسخ ندهید.
  </div>

</div>

</body>
</html>
  `;
}

