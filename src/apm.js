import { init as initApm } from '@elastic/apm-rum';

export const apm = initApm({
  serviceName: 'finance-frontend',
  serviceVersion: '1.0.0',
  serverUrl: 'https://localhost:8200',
  environment: 'development',
  active: true,
  distributedTracingOrigins: [
    'http://localhost:5000',
    'http://10.210.44.169:5000'
  ]
});

// initApm({
//   serviceName: 'finance-frontend',
//   serviceVersion: '1.0.0',
//   serverUrl: 'https://localhost:8200',
//   environment: 'development',

//   active: true,

//   distributedTracingOrigins: ['http://localhost:5000']
// })