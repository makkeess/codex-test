import { Worker } from '@temporalio/worker';
import * as activities from './activities/index.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  const worker = await Worker.create({
    workflowsPath: join(__dirname, 'workflows'),
    activities,
    taskQueue: 'checkout',
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
