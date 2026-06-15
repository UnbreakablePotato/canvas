import asyncio
import websockets
import json
import os

client_list = set([])

async def handler(connection):
    print(f"{connection} connected")
    client_list.add(connection)

    while connection:
        try:
            message = await connection.recv()
        except Exception as e:
             print(f"{connection} has left")
             client_list.remove(connection)
             break

        message_string = json.loads(message)

        message_to_send = json.dumps(message_string)

        for client in client_list:
            if client != connection:
                await client.send(message_to_send)
                

        print(f"Recieved from client: {message}")
        await connection.send("Hello client!")

async def main():
    port = int(os.environ.get("PORT", 8000))
    async with websockets.serve(handler, "0.0.0.0", port):
        print(f"Server running at ws://0.0.0.0:{port}")
        await asyncio.Future()

asyncio.run(main())