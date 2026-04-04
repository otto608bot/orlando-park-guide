// Netlify function: receives Web3Forms webhook → appends row to Google Sheet
// Env vars needed in Netlify UI:
//   SHEETS_SPREADSHEET_ID  - the sheet ID
//   SHEETS_SERVICE_ACCOUNT - JSON stringified service account key (base64 encoded)

const { createSign } = require('crypto');

async function getAccessToken(serviceAccountB64) {
  const sa = JSON.parse(Buffer.from(serviceAccountB64, 'base64').toString('utf8'));
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedClaims = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signingInput = `${encodedHeader}.${encodedClaims}`;

  // Sign with RSA-SHA256 using the private key
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(sa.private_key, 'base64url');

  const jwt = `${signingInput}.${signature}`;

  // Exchange JWT for access token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Token error: ' + JSON.stringify(data));
  return data.access_token;
}

async function appendToSheet(accessToken, spreadsheetId, values) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:G:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [values] }),
    }
  );
  return res.json();
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const sheetId = process.env.SHEETS_SPREADSHEET_ID;
    const serviceAccountB64 = process.env.SHEETS_SERVICE_ACCOUNT;
    if (!sheetId || !serviceAccountB64) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) };
    }

    const params = new URLSearchParams(event.body || '');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const formType = params.get('form_type') || params.get('type') || 'Unknown';
    const name = params.get('name') || params.get('Name') || '';
    const email = params.get('email') || params.get('Email') || '';
    const message = params.get('message') || params.get('Message') || params.get('question') || '';
    const pageUrl = params.get('page_url') || params.get('pageUrl') || '';

    // Map to sheet columns: Timestamp | Type | Description | Status | Submitted By | Page/URL | Email
    const values = [timestamp, formType, message, 'Open', name, pageUrl, email];

    const accessToken = await getAccessToken(serviceAccountB64);
    const result = await appendToSheet(accessToken, sheetId, values);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, result }),
    };
  } catch (err) {
    console.error('Webhook error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
