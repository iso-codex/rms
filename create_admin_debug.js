import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tshgautcxilwukbvvohj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaGdhdXRjeGlsd3VrYnZ2b2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTUxODIsImV4cCI6MjA4NTA5MTE4Mn0.DrYf2jSshX6LlycEDDuYD91wpCDrqRsqKOElhDEvHz0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
    const email = 'admin@gmail.com';
    const password = 'admin123';

    console.log(`Attempting to register user: ${email}`);

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: 'System Admin',
                    role: 'admin'
                }
            }
        });

        if (error) {
            console.error('Error creating user object:', JSON.stringify(error, null, 2));
            console.error('Error message:', error.message);
        } else {
            console.log('User created successfully. ID:', data.user ? data.user.id : 'No user data returned');
            console.log('Session:', data.session ? 'Session created' : 'No session (email confirm required likely)');
        }
    } catch (err) {
        console.error('Unexpected exception:', err);
    }
}

createAdmin();
