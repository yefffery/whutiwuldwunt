// Resolves the dev bridge host for the connector preview. Local previews run
// the bridge inside the same Vite server, so the binding is direct.
export function hostBinding(port = 5173) {
  return `http://127.0.0.1:${port}`;
}
