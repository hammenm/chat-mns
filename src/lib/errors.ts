export function errorResponseNotFound() {
  return new Response(JSON.stringify({ message: "Conversation not found" }), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
