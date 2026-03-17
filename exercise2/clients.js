import axios from "axios";
import https from 'https';
import 'dotenv/config';

const client = axios.create({
    baseURL: process.env.REDIS_API_URL,
    auth: {
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false})
});

export const createDB = async (name) => {
    const response = await client.post('/v1/bdbs', {
        name,
        memory_size: 102400000,
    });
    return response.data;
};

export const getDB = async (uid) => {
    const response = await client.get(`/v1/bdbs/${uid}`);
    return response.data;
}


export const createRole = async (name, management) => {
    const response = await client.post('/v1/roles', {
        name,
        management
    });
    return response.data;
}

export const createUser = async (email, name, roleUid) => {
    const response = await client.post('/v1/users', {
        name,
        email,
        role_uids: [roleUid],
        password: process.env.DB_PASSWORD
    });
    return response.data;
};

export const getUsers = async () => {
    const response = await client.get('/v1/users');
    return response.data;
};

export const deleteUser = async (uid) => {
    const response = await client.delete(`/v1/users/${uid}`);
    console.log('Delete status:', response.status);
    return response.data
}

export const deleteDB = async (id) => {
    const response = await client.delete(`/v1/bdbs/${id}`);
    return response.data;
}

export const getRoles = async () => {
    const response = await client.get('/v1/roles');
    return response.data;
};

