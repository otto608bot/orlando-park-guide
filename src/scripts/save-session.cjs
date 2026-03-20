const fs = require('fs');
const path = require('path');

const COOKIE_FILE = path.join(__dirname, 'amazon-session.json');

const cookies = [
  { name: 'session-id', value: '137-8562656-5296620', domain: '.amazon.com', path: '/', expires: -1, httpOnly: false, secure: true, sameSite: 'Lax' },
  { name: 'session-id-time', value: '2082787201l', domain: '.amazon.com', path: '/', expires: -1, httpOnly: false, secure: true, sameSite: 'Lax' },
  { name: 'ubid-main', value: '132-1227882-2967501', domain: '.amazon.com', path: '/', expires: -1, httpOnly: false, secure: true, sameSite: 'Lax' },
  { name: 'at-main', value: 'Atza|gQA9ktAWAwEBAD0aNJtyJg8zpy1LaSGnBNF30JV0cZMpNFd8RaSYoHXkJVEYELGltCRydhrnR0mBJGqduhsLZwMQJxl00Zelnihw68FhGCJmCNqi6lf8nHIOUYUGTeJdjDLSqOvKN_m4RtcR6nbqj9KfqEFPi2ioPCcI1mxPnd9D3DQ3xoIQbwQsiIoKLo_D89WIrboVWjTb2FdT6Fq91DCh2zs_tMK3052El8c6bOc9_LbpIB8CRHITGaMvf7q_zXlSl-XUZR6ZPfOfLQBNxsnlsgFNcYszzEWZU14XQP8uzA0aBRaIuwv8b8fCmRkwNN5HoSJT6wSxd1IeT7wxbiZKPZIbmkhWCI-mmwk7xu1WUQuO-7LCq-_G8q6R-Ao', domain: '.amazon.com', path: '/', expires: -1, httpOnly: true, secure: true, sameSite: 'Lax' },
  { name: 'sess-at-main', value: 'Qe+l6b0HMTwWlzXpnQDdVmlGx0kFAwvy5Ezkm3kw89o=', domain: '.amazon.com', path: '/', expires: -1, httpOnly: true, secure: true, sameSite: 'Lax' }
];

const storage = {
  cookies: cookies,
  origins: []
};

fs.writeFileSync(COOKIE_FILE, JSON.stringify(storage, null, 2));
console.log('✓ Session saved to amazon-session.json');
console.log('You can now run searches with:');
console.log('  node scripts/amazon-affiliate.cjs --search "travel stroller"');
console.log('  node scripts/amazon-affiliate.cjs --batch');
