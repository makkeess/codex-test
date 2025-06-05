# Temporal Cart Checkout Example

This project demonstrates a simple checkout workflow using the Temporal.io JavaScript SDK.

## Purpose

The example shows how a worker and client interact to complete a basic e-commerce checkout. It now also exposes a simple web server that lets you create a cart, add items, and checkout using Temporal workflows. The project is intended as a small reference for getting started with Temporal.

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

## Starting the Example Client

You can still run the example client to start the old checkout workflow:

```bash
npm start
```

## Running the Web Server

To experiment with the shopping cart workflow, start the express server:

```bash
npm run server
```

Available endpoints:

- `GET /items` – list available items
- `POST /cart/create` – create a new cart
- `POST /cart/:id/add` – add an item using `{ "itemId": "apple", "qty": 2 }`
- `GET /cart/:id` – view cart items
- `POST /cart/:id/checkout` – checkout and complete the order
