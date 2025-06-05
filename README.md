# Temporal Cart Checkout Example

This project demonstrates a simple checkout workflow using the Temporal.io JavaScript SDK.

## Installation

```bash
npm install
```

## Running the Worker

Start the Temporal worker to process workflows:

```bash
npm run worker
```

## Starting the Workflow

In a separate terminal, run the client to start a checkout workflow:

```bash
npm start
```

The workflow orchestrates simple activities that fetch a cart, process a payment, and save an order.
