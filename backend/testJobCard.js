const token = 'PASTE_YOUR_TOKEN_HERE';

const response = await fetch('http://localhost:4000/api/job-cards', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({
    customer: { name: 'John' }, // mobile missing
    vehicle: { model: 'Scooter' }, // vin missing
    jobCard: {
      serviceType: 'INVALID',
      serviceInDatetime: 'not-a-date',
    },
  }),
});

const data = await response.json();

console.log('Status:', response.status);
console.log('Response:', JSON.stringify(data, null, 2));
