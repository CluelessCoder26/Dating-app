import autocannon from 'autocannon';
import { jwtService } from '../../src/services/jwt.service.js';

// We'll generate a fake token for a mock user
// Ideally this user exists in the DB, but since our middleware validates JWT signature,
// we just need a valid token. If DB lookup is required in the route, we might get 404,
// which is still a valid load test for the route mechanics.
const token = jwtService.generateAccessToken({ id: 'load_test_user_id', role: 'USER' });

const run = () => {
  const url = 'http://localhost:5010';
  
  console.log(`Starting load test against ${url}...`);

  const instance = autocannon({
    url,
    connections: 100, // Concurrent connections
    duration: 10, // Duration in seconds
    requests: [
      {
        method: 'GET',
        path: '/api/discovery',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ]
  }, (err, result) => {
    if (err) {
      console.error('Error during load test:', err);
      return;
    }
    console.log('--- Load Test Results ---');
    console.log(`Endpoint: GET /api/discovery`);
    console.log(`Total Requests: ${result.requests.total}`);
    console.log(`Req/Sec (Avg): ${result.requests.average}`);
    console.log(`Latency (Avg): ${result.latency.average} ms`);
    console.log(`Latency (p99): ${result.latency.p99} ms`);
    console.log(`Errors: ${result.errors}`);
    console.log(`Timeouts: ${result.timeouts}`);
  });

  autocannon.track(instance, { renderProgressBar: true });
};

run();
