const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
dotenv.config({ path: "d:/Satya_Computers/.env" });

async function testDB() {
    const url = process.env.DATABASE_URL;
    const token = process.env.DATABASE_AUTH_TOKEN;
    if (!url) { console.error("No DATABASE_URL"); return; }
    
    console.log("Testing DB connection to:", url);
    const client = createClient({ url, authToken: token });
    try {
        const result = await client.execute("SELECT 1+1 as test");
        console.log("SUCCESS! DB result:", result.rows[0].test);
    } catch (e) {
        console.error("DB ERROR:");
        console.error(e);
    }
}
testDB();
