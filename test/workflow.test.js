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

// Verify that running a previously recorded history does not throw,
// which indicates that the workflow remains deterministic.

test('checkout workflow determinism', async () => {
  const env = await TestWorkflowEnvironment.createLocal();
  const worker = await Worker.create({
    connection: env.nativeConnection,
    workflowsPath,
    activities,
    taskQueue: 'determinism',
  });

  let history;
  try {
    history = await worker.runUntil(async () => {
      const handle = await env.workflowClient.start('checkoutWorkflow', {
        args: ['customer-123'],
        taskQueue: 'determinism',
        workflowId: 'wf-' + uuidv4(),
      });
      await handle.result();
      return await handle.fetchHistory();
    });

    await Worker.runReplayHistory({ workflowsPath }, history);
  } finally {
    await env.teardown();
  }

  assert.ok(history?.events?.length > 0, 'history should contain events');
});
