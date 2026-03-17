import { sourceClient, replicaClient, connectClients } from "./clients.js";

const main = async () => {
    await connectClients();

    // Clear any existing data
    await sourceClient.del('numbers');
    console.log("Deleted 'numbers' key from source-db");

    const numbers = [];
    for(let i = 1; i <= 100; i++) {
        numbers.push(String(i));
    }

    await sourceClient.rPush('numbers', numbers);
    console.log('Inserted 1-100 into source-db');

    // Debounce for replication (small delay)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const values = await replicaClient.lRange('numbers', 0, -1);
    const reversedValues = values.reverse().join(', ');
    console.log('Values in reverse from replica-db:', reversedValues);

    await sourceClient.quit();
    await replicaClient.quit();
}

main().catch(err => console.error('Script failed', err))