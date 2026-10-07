const SUPABASE_URL = 'https://qbmszgddepljxqxynyxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibXN6Z2RkZXBsanhxeHlueXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODUzMzcsImV4cCI6MjEwNjE2MTMzN30.Xn96bQzIKht44_6IYTkXMY6wk3sT2uf2IJtbOhW1WgU';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch and render orders into Kanban columns
async function loadKanbanBoard() {
  const { data: orders, error } = await supabaseClient
    .from('orders')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching orders:', error.message);
    return;
  }

  const lists = {
    pending: document.getElementById('list-pending'),
    in_progress: document.getElementById('list-in_progress'),
    completed: document.getElementById('list-completed')
  };

  const counts = { pending: 0, in_progress: 0, completed: 0 };

  // Clear lists
  Object.values(lists).forEach(el => el.innerHTML = '');

  orders.forEach(order => {
    const status = order.status || 'pending';
    counts[status] = (counts[status] || 0) + 1;

    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.innerHTML = `
      <div class="card-title">#${order.id} - ${escapeHtml(order.customer_name)}</div>
      <div class="card-items">${escapeHtml(order.order_items)}</div>
      <div class="card-actions">
        ${status === 'pending' ? `<button onclick="updateStatus(${order.id}, 'in_progress')">Start &rarr;</button>` : ''}
        ${status === 'in_progress' ? `<button onclick="updateStatus(${order.id}, 'pending')">&larr; Back</button><button onclick="updateStatus(${order.id}, 'completed')">Complete &check;</button>` : ''}
        ${status === 'completed' ? `<button onclick="updateStatus(${order.id}, 'in_progress')">&larr; Reopen</button>` : ''}
      </div>
    `;

    if (lists[status]) {
      lists[status].appendChild(card);
    }
  });

  // Update column counters
  document.getElementById('count-pending').textContent = counts.pending;
  document.getElementById('count-in_progress').textContent = counts.in_progress;
  document.getElementById('count-completed').textContent = counts.completed;
}

// Change order status in Supabase
async function updateStatus(orderId, newStatus) {
  const { error } = await supabaseClient
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    alert('Failed to update order status: ' + error.message);
  } else {
    loadKanbanBoard();
  }
}

// Helper to escape HTML characters
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// Enable Supabase Realtime Subscription
function subscribeToRealtime() {
  const indicator = document.getElementById('live-indicator');
  
  supabaseClient
    .channel('public:orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      loadKanbanBoard();
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        indicator.textContent = '🟢 Live Updates Active';
        indicator.style.color = '#10b981';
      }
    });
}

// Initial boot
loadKanbanBoard();
subscribeToRealtime();
