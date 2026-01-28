
import { createClient } from '@supabase/supabase-js';

// Hardcoded for debug purposes (normally from env)
// Note: In a real scenario I would read these from the file content I just viewed or .env, 
// ensuring I don't leak them if this was a shared artifact.
// But this is a temporary local file.
// Wait, I didn't see the .env output yet because it was async.
// I will assume I can't see .env content easily if it's not in the previous turn output.
// I will use `process.env` and require the user to run it with env vars, OR 
// I will read the .env file in the script.

import fs from 'fs';
import path from 'path';

// Simple .env parser since we might not have dotenv installed
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });
        return env;
    } catch (e) {
        console.error("Could not load .env file", e.message);
        return {};
    }
};

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE URL or KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDebug() {
    console.log("--- Starting Debug ---");

    // 1. Recreate Caseworker Account
    const email = 'caseworker@test.com';
    console.log(`\nAttempting to recreate user ${email}...`);

    // Sign Up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: 'password123', // Using a fresh password
        options: {
            data: {
                full_name: 'Caseworker Test',
                role: 'caseworker'
            }
        }
    });

    if (signUpError) {
        console.error("SignUp failed:", JSON.stringify(signUpError, null, 2));
    } else {
        console.log("SignUp successful. User ID:", signUpData.user?.id);

        // Login immediately
        console.log("Attempting login as recreated user...");
        const { data: newData, error: newError } = await supabase.auth.signInWithPassword({
            email: email,
            password: 'password123'
        });

        if (newError) {
            console.error("Login failed:", JSON.stringify(newError, null, 2));
        } else {
            console.log("Login successful.");
        }
    }
}


runDebug();
