// js/supabase.js
// ⚠️ Remplace par TES valeurs Supabase
const SUPABASE_URL = "https://jrijpgqpiznlfwgimklm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyaWpwZ3FwaXpubGZ3Z2lta2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNDQ1MjAsImV4cCI6MjA4MzgyMDUyMH0.yQDPyornhj1dYXzvIEjOtnMParyON_PnvBG0XYumLTM";

// Charge la lib Supabase depuis CDN (voir include dans les pages)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Auth helpers ---
async function signUp(email, password) {
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

async function signIn(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

async function getSession() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Protège une page : si pas connecté -> login
async function requireAuth() {
  const session = await getSession();
  if (!session) window.location.href = "/login.html";
  return session;
}


// Expose helpers globally (pages use plain <script>)
window.supabaseClient = supabaseClient;
window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
window.getSession = getSession;
window.requireAuth = requireAuth;
