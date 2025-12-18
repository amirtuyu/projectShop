export function verificationTemplate(code) {
  return `
<!DOCTYPE html>
<html lang="fa">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Code</title>
  <style>
    * {
      font-family: "Segoe UI", Tahoma, sans-serif;
    }
  </style>
</head>
<body style="background-color: #f5f6fa; padding: 0; margin: 0;">
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="480" cellspacing="0" cellpadding="0" style="background: #ffffff; border-radius: 10px; padding: 40px; text-align: center;">

          <tr>
            <td>
              <h2 style="color: #2b2d42; margin-bottom: 10px;">کد تایید حساب</h2>
              <p style="color: #555; font-size: 15px; line-height: 1.7;">
                برای وارد شدن به حساب کاربری، کد زیر را وارد کنید.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 0;">
              <div style="
                display: inline-block;
                background: #2b2d42;
                color: white;
                padding: 14px 25px;
                font-size: 28px;
                letter-spacing: 6px;
                border-radius: 8px;
                font-weight: bold;
              ">
                ${code}
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
