import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tshgautcxilwukbvvohj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaGdhdXRjeGlsd3VrYnZ2b2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTUxODIsImV4cCI6MjA4NTA5MTE4Mn0.DrYf2jSshX6LlycEDDuYD91wpCDrqRsqKOElhDEvHz0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFetch() {
    console.log('Testing connection to profiles...');

    // 1. Try to fetch the admin user we just created (known email)
    // We can't query by email easily on public table unless we expose it, but let's try reading any profile

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('FETCH ERROR:', JSON.stringify(error, null, 2));
        console.error('Message:', error.message);
    } else {
        console.log('SUCCESS. Data:', JSON.stringify(data, null, 2));
    }

    // 2. Try fetching schema info via rpc if possible, or just another table
    const { data: services, error: serviceError } = await supabase.from('services').select('*').limit(1);
    if (serviceError) {
        console.error('SERVICES FETCH ERROR:', serviceError.message);
    } else {
        console.log('Services fetch success.');
    }
}

testFetch();
