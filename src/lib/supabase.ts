// Demo mode — no Supabase connection required
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noopBuilder: any = new Proxy({}, {
  get: () => (..._args: unknown[]) => noopBuilder,
})

noopBuilder.then = (resolve: (val: { data: null; error: null }) => void) => {
  resolve({ data: null, error: null })
  return noopBuilder
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => noopBuilder,
  channel: () => ({
    on: function() { return this },
    subscribe: () => {},
  }),
  removeChannel: () => {},
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: () => Promise.resolve({ data: null, error: null }),
      list: () => Promise.resolve({ data: [], error: null }),
    }),
  },
}
