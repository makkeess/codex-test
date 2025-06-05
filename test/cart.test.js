import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import { v4 as uuidv4 } from 'uuid';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as activities from '../activities/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workflowsPath = join(__dirname, '../workflows');

const catalog = {
  apple: { name: 'Apple', price: 1 },
  banana: { name: 'Banana', price: 2 }
};

test('cart workflow checkout', async () => {
  const env = await TestWorkflowEnvironment.createLocal();
  const worker = await Worker.create({
    connection: env.nativeConnection,
    workflowsPath,
    activities,
    taskQueue: 'cart-test',
  });

  let result;
  await worker.runUntil(async () => {
    const handle = await env.workflowClient.start('cartWorkflow', {
      args: ['customer-1', catalog],
      taskQueue: 'cart-test',
      workflowId: 'wf-' + uuidv4(),
    });

    await handle.signal('addItem', 'apple', 2);
    await handle.signal('addItem', 'banana', 1);
    await handle.signal('checkout');
    result = await handle.result();
  });

  assert.equal(result, 'Order completed');
  await env.teardown();
});
