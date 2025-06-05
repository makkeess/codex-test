# Temporal Cart Checkout Example

This project demonstrates a simple checkout workflow using the Temporal.io JavaScript SDK.

## Purpose

The example shows how a worker and client interact to complete a basic e-commerce checkout. It uses Workflow code to fetch a cart, process a payment, and persist the order. The project is intended as a small reference for getting started with Temporal.

## Running Temporal Locally

You need a running Temporal server to execute the example. The quickest way is to start the official Docker container:

```bash
docker run --rm -d --name temporal-dev -p 7233:7233 temporalio/auto-setup
```

The server will be available on `localhost:7233`. When you are done experimenting, stop it with `docker stop temporal-dev`.

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
