// Simple script to test admin login
const response = await fetch('http://localhost:4000/api/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const data = await response.json();
console.log('Response:', data);
if (data.token) {
  console.log('\n✅ Login successful!');
  console.log('Token:', data.token);
  console.log('\nCopy this token to use for protected routes:');
  console.log('Authorization: Bearer ' + data.token);
} else {
  console.log('❌ Login failed:', data);
}

