<!-- Include Supabase JS SDK inside your storefront <head> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // Initialize Supabase Client
  const SUPABASE_URL = 'https://qbmszgddepljxqxynyxv.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibXN6Z2RkZXBsanhxeHlueXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODUzMzcsImV4cCI6MjEwNjE2MTMzN30.Xn96bQzIKht44_6IYTkXMY6wk3sT2uf2IJtbOhW1WgU';
  
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /**
   * Submit an order to Supabase
   * @param {Array} cartItems - Example: [{ name: "1/4 Chicken & Chips", qty: 2, price: 65.00 }]
   * @param {Object} customer - Example: { name: "John Doe", phone: "0821234567", paymentMethod: "Cash", instructions: "Extra hot sauce" }
   * @param {Number} totalAmount - Total order price (e.g., 130.00)
   */
  async function submitOrderToSupabase(cartItems, customer, totalAmount) {
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .insert([
          {
            client_name: customer.name || 'Guest',
            phone: customer.phone || 'N/A',
            payment_method: customer.paymentMethod || 'Cash',
            items: cartItems,
            subtotal: totalAmount,
            total: totalAmount,
            stage: 'pending',
            instructions: customer.instructions || ''
          }
        ])
        .select();

      if (error) {
        console.error('Supabase submission error:', error);
        alert('Order submission failed: ' + error.message);
        return false;
      }

      console.log('Order created successfully:', data);
      return true;
    } catch (err) {
      console.error('Network exception submitting order:', err);
      alert('Network error. Please try again.');
      return false;
    }
  }
</script>