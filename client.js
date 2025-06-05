import { Connection, Client } from '@temporalio/client';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  const connection = await Connection.connect();
  const client = new Client({ connection });

  const handle = await client.workflow.start('checkoutWorkflow', {
    args: ['customer-123'],
    taskQueue: 'checkout',
    workflowId: 'checkout-' + uuidv4(),
  });

  console.log(`Started workflow ${handle.workflowId}`);
  console.log(`Result: ${await handle.result()}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
