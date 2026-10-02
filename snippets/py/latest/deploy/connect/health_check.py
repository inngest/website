# !snippet:start
import asyncio
import http.server
import threading

from inngest.connect import ConnectionState, connect

from .inngest_app import client, functions

connection = connect(apps=[(client, functions)])


class HealthCheckHandler(http.server.BaseHTTPRequestHandler):
    # This is a basic web server that only listens for the /ready endpoint
    # and returns a 200 status code when the connection to Inngest is active.
    def do_GET(self) -> None:
        if self.path == "/ready":
            if connection.get_state() == ConnectionState.ACTIVE:
                self._respond(200, "OK")
            else:
                self._respond(500, "NOT OK")
            return
        self._respond(404, "NOT FOUND")

    def _respond(self, status: int, body: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(body.encode())


async def main() -> None:
    # Start the server on a port of your choice
    http_server = http.server.ThreadingHTTPServer(
        ("", 8080), HealthCheckHandler
    )
    threading.Thread(target=http_server.serve_forever, daemon=True).start()
    print("Worker: HTTP server listening on port 8080")

    # start() returns when the Inngest connection has gracefully closed
    await connection.start()
    print("Worker: Shut down")

    # Stop the HTTP server
    http_server.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
# !snippet:end
