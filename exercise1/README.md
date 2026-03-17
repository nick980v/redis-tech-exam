## Overview:

This script inserts the values 1-100 into a Redis list on source-db, then connects to replica-db and prints them in reverse order.

## Pre-reqs

- Node.js v20+
- npm

## Installation

Run the following in the exercise1 directory:

npm install

## Usage

Run the following command from the exercise1 directory:

node index.js

## Data structure discussion

I chose a Redis List for this problem as it naturally preserves the insertion order, making it straightforward to insert 1-100 and retrieve them in reverse. Rather than pushing each value individually in a loop, I batched all the 100 values into a single RPUSH call - this avoids 100 separate network round trips to the DB, which at scale would be a noticeable performance impact.

Alternative structures I considered:

- Set - would ensure uniqueness automatically, but Sets are unordered so reversing would require additional sorting in code.
- Sorted Set - supports the reverse range queries, but adds unnecessary complexity for a simple sequential dataset like 1-100.

The List was the right balance of simplicity and efficiency for this use case.
