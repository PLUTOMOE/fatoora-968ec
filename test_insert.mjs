import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://byckypheqbrcekoigspl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y2t5cGhlcWJyY2Vrb2lnc3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDMyNzksImV4cCI6MjA5MjAxOTI3OX0.B_19k6wd2SMUrxzAKiJjYHonf5qu3A4uSptPOMWBrSY'
);

// Test: try to insert with anon key (no auth)
const { data, error } = await supabase.from('entities').insert({
  user_id: '00000000-0000-0000-0000-000000000001',
  name: 'Test Company',
  status: 'active'
}).select().single();

console.log('Data:', data);
console.log('Error:', JSON.stringify(error, null, 2));

// Also check RLS policies
const { data: d2, error: e2 } = await supabase.from('entities').select('*');
console.log('Select result:', d2);
console.log('Select error:', JSON.stringify(e2, null, 2));
