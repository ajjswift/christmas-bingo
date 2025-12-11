export async function GET() {
    const wsUrl = process.env.WS_URL;

    if (!wsUrl) {
        return new Response(
            JSON.stringify({ error: "WS_URL not configured" }),
            { status: 500 }
        );
    }

    return new Response(JSON.stringify({ wsUrl }), {
        headers: { "Content-Type": "application/json" },
    });
}
