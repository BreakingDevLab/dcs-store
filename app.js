const SUPABASE_URL = 'https://qbmszgddepljxqxynyxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibXN6Z2RkZXBsanhxeHlueXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODUzMzcsImV4cCI6MjEwNjE2MTMzN30.Xn96bQzIKht44_6IYTkXMY6wk3sT2uf2IJtbOhW1WgU';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const orderForm = document.getElementById('order-form');

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const customerName = document.getElementById('customer-name').value.trim();
  const orderItems = document.getElementById('order-items').value.trim();

  const { data, error } = await supabaseClient
    .from('orders')
    .insert([
      { 
        customer_name: customerName, 
        order_items: orderItems,
        status: 'pending' 
      }
    ]);

  if (error) {
    alert('Error submitting order: ' + error.message);
  } else {
    alert('Order submitted successfully!');
    orderForm.reset();
  }
});
