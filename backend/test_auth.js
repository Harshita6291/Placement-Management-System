(async () => {
  try {
    const base = 'http://localhost:5000';
    const ts = Date.now();
    const email = `auto-test-${ts}@example.com`;
    console.log('Using test email:', email);

    // helper
    async function post(path, body) {
      const res = await fetch(base + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch (e) { parsed = text; }
      return { status: res.status, body: parsed };
    }

    // 1) Register
    console.log('\n1) Register');
    const reg = await post('/api/students/register', { name: 'Auto Tester', email, password: 'StartPass1!', phone: '1112223333', year: '4th' });
    console.log('REGISTER', reg.status, reg.body);

    // 2) Role-specific login
    console.log('\n2) Role-specific login');
    const rlogin = await post('/api/students/login', { email, password: 'StartPass1!' });
    console.log('STUDENT LOGIN', rlogin.status, rlogin.body);

    // 3) Role-agnostic login
    console.log('\n3) Role-agnostic login');
    const aglogin = await post('/api/login', { email, password: 'StartPass1!' });
    console.log('AG LOGIN', aglogin.status, aglogin.body);

    // 4) Forgot password
    console.log('\n4) Forgot password (request token)');
    const forgot = await post('/api/students/forgot', { email });
    console.log('FORGOT', forgot.status, forgot.body);

    let token = null;
    if (forgot.body && forgot.body.resetToken) token = forgot.body.resetToken;

    if (!token) {
      console.log('No reset token returned by API. If email is configured, check your inbox. Exiting reset test.');
      return;
    }

    // 5) Reset password
    console.log('\n5) Reset password using token');
    const reset = await post(`/api/students/reset/${token}`, { password: 'NewPass123!' });
    console.log('RESET', reset.status, reset.body);

    // 6) Login with new password
    console.log('\n6) Login with new password');
    const newlogin = await post('/api/login', { email, password: 'NewPass123!' });
    console.log('NEW LOGIN', newlogin.status, newlogin.body);

    console.log('\nTest sequence completed.');
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
  }
})();
