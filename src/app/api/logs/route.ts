export async function GET() {
    const mockLogs = [
      {
        uid: "B3793F02",
        name: "John",
        time: "03:15:01",
        status: "Access Granted"
      },
      {
        uid: "A1B2C3D4",
        name: "Lisa",
        time: "03:12:45",
        status: "Access Denied"
      }
    ];
  
    return new Response(JSON.stringify(mockLogs), {
      headers: { "Content-Type": "application/json" }
    });
  }
  