import { createDB, getUsers, deleteUser, getRoles, createUser, deleteDB, getDB } from "./clients.js";

// Cleanup existing test users
const cleanupUsers = async () => {
    const existingUsers = await getUsers();
    const testEmails = ['john.doe@example.com', 'mike.smith@example.com', 'cary.johnson@example.com'];
    for (const user of existingUsers) {
        if (testEmails.includes(user.email)) {
            await deleteUser(user.uid);
            console.log(`Deleted existing user: ${user.email}`);
        }
    }
}


const waitForDB = async (uid) => {
    let status = 'pending';
    let delay = 500;
    while (status !== 'active') {
        const db = await getDB(uid);
        status = db.status;
        console.log(`Database status: ${status}`);
        if (status !== 'active') {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay = Math.min(delay * 2, 10000); //expo backoff
        }

    }
}

const main = async () => {
    try {
        await cleanupUsers();


        // Create DB
        const db = await createDB('exercise2-db');
        console.log(`Database created: ${db.name} (uid: ${db.uid})`);
        await waitForDB(db.uid);

        // Fetch roles
        const roles = await getRoles();
        const getRoleUid = (management) => roles.find(r => r.management === management).uid;

        const dbViewerUid = getRoleUid('db_viewer');
        const dbMemberUid = getRoleUid('db_member');
        const adminUid = getRoleUid('admin');

        // Create three users
        await createUser('john.doe@example.com','John Doe', dbViewerUid);
        await createUser('mike.smith@example.com','Mike Smith', dbMemberUid);
        await createUser('cary.johnson@example.com','Cary Johnson', adminUid);

        console.log("Users created successfully");

        // Display users
        const allUsers = await getUsers();
        console.log('\nAll Users:');
        allUsers.forEach(u => {
            console.log(`Name: ${u.name}, Role: ${u.role}, Email: ${u.email}`);
        })

        // Delete DB
        await deleteDB(db.uid);
        console.log(`\nDatabase deleted: ${db.name}`);
    } catch (err) {
        console.error('Script failed:', err)
    }
}

main();


