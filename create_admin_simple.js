import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tshgautcxilwukbvvohj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaGdhdXRjeGlsd3VrYnZ2b2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTUxODIsImV4cCI6MjA4NTA5MTE4Mn0.DrYf2jSshX6LlycEDDuYD91wpCDrqRsqKOElhDEvHz0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
    // Trying the exact requested email, but deeper password
    const email = 'admin@gmail.com';
    const password = 'AdminPassword123!';

    console.log(`Registering ${email} with strong password...`);

    try {
        // No metadata options to avoid validation triggers
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error('ERROR RESPONSE:', JSON.stringify(error, null, 2));
        } else {
            console.log('SUCCESS:', data);
        }
    } catch (err) {
        console.error('EXCEPTION:', err);
    }
}

createAdmin();
