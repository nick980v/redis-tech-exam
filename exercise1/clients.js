import { createClient } from 'redis';

const sourceClient = createClient({
    socket: {
        host: 'redis-12764.re-cluster1.ps-redislabs.org',
        port: 12764
    }
});

const replicaClient = createClient({
    socket: {
        host: 'redis-11002.re-cluster1.ps-redislabs.org',
        port: 11002
    }
});

sourceClient.on('error', err => console.log('Redis Source Client Error', err));
replicaClient.on('error', err => console.log('Redis Replica Client Error', err));

const connectClients = async () => {
    await sourceClient.connect();
    await replicaClient.connect();
}


export { sourceClient, replicaClient, connectClients };