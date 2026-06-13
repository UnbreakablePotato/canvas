import asyncio
import websockets
import json

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

        message_to_send = json.loads(message)

        for client in client_list:
            if client != connection:
                await client.send(message_to_send)
                

        print(f"Recieved from client: {message}")
        await connection.send("Hello client!")

async def main():
    async with websockets.serve(handler, "localhost", 8000):
        print("Server running at ws://localhost:8000")
        await asyncio.Future()

asyncio.run(main())