import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tshgautcxilwukbvvohj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaGdhdXRjeGlsd3VrYnZ2b2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTUxODIsImV4cCI6MjA4NTA5MTE4Mn0.DrYf2jSshX6LlycEDDuYD91wpCDrqRsqKOElhDEvHz0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
    const email = 'admin@gmail.com';
    const password = 'admin123';

    console.log(`Attempting to register user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'System Admin',
                role: 'admin' // Attempt to set role, but RLS/Trigger might override or ignore
            }
        }
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('User created successfully:', data.user.id);
    }
}

createAdmin();
