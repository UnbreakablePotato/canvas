import asyncio
import websockets
import aioconsole
import json

async def client():
    async with websockets.connect("ws://localhost:8000") as websocket:
        write = asyncio.create_task(client_messenger(websocket))
        read = asyncio.create_task(client_listener(websocket))

        await read
        await write


async def client_messenger(websocket):
    name = await aioconsole.ainput("Type your name:")
    message = await aioconsole.ainput()
    event_json = {
        "type": "draw",
        "user": name,
        "message": message,
        "strokeId": "1234",
        "color": "FF0000",
        "linewidth": 5,
        "x": 4,
        "y": 9
    }
    #event = json.dumps(event_json)
    while event_json["message"] != "quit":
        event_json = {
        "type": "draw",
        "user": name,
        "message": message,
        "strokeId": "1234",
        "color": "FF0000",
        "linewidth": 5,
        "x": 4,
        "y": 9
    }
        await websocket.send(json.dumps(event_json))
        message = await aioconsole.ainput()

async def client_listener(websocket):
    while True:
        response = await websocket.recv()
        print(response)

asyncio.run(client())