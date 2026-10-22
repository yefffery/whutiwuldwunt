// Auxiliary worker for connected-app previews. Without an active agent preview
// session every invocation is reported as unavailable.
function unavailableResponse() {
  return new Response(
    JSON.stringify({
      status: "binding_unavailable",
      message: "Connected apps need an active agent preview session in this preview.",
    }),
    { status: 503, headers: { "content-type": "application/json" } },
  );
}

export class ConnectorPreview {
  async fetch() {
    return unavailableResponse();
  }
}

export default {
  async fetch() {
    return unavailableResponse();
  },
};
