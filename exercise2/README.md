## Overview

The script uses Redis Enterprise REST API to create a DB, create three users with specific roles, display all users and delete the created DB once active.

## Pre-reqs

- Node.js v20+
- npm
- The following roles must exist on the cluser prior to running the script. These were created manually via `POST /vi/roles` - `createRole` in clients.js
    - `db_viewer`
    - `db_member`
    - `admin`

## Installation

Run the following in the exercise2 directory:

npm install

## Environment Variables

Create a `.env` file in the exercise2 directory with the following:

REDIS_API_URL=https://re-cluster1.ps-redislabs.org:9443
REDIS_USERNAME=<your-username>
REDIS_PASSWORD=<your-password>
DB_PASSWORD=<your-chosen-db-password>

## Usage 

Run the following command from the exercise2 directory:

node index.js

## Assumptions

- A default password is assigned to all created users as the exercise does not specify one. This should be changed in a production environment via the `REDIS_USER_PASSWORD` environment variable.
- The required roles (`db_viewer`, `db_member`, `admin`) were pre-created on the cluster manually before running the script. The `createRole` function is available in `clients.js` should they need to be recreated.
- SSL certificate verification is disabled (`rejectUnauthorized: false`) as the cluster uses a self-signed certificate. This is acceptable for a test environment.