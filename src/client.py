import asyncio
import websockets
import json

async def client(event=""):
    async with websockets.connect("ws://localhost:8000") as websocket:
        write = asyncio.create_task(client_messenger(websocket, event))
        read = asyncio.create_task(client_listener(websocket))

        await read
        await write


async def client_messenger(websocket,event):
    #name = await aioconsole.ainput("Type your name:")
    #message = await aioconsole.ainput()
    event_json = {
        "type": "draw",
        "strokeId": "1234",
        "color": "FF0000",
        "linewidth": 5,
        "x1": x1,
        "y1": y1,
        "x2": x2,
        "y2": y2
    }
    #event = json.dumps(event_json)
    while True:
        event_json = {
        "type": "draw",
        "strokeId": "1234",
        "color": "FF0000",
        "linewidth": 5,
        "x1": x1,
        "y1": y1,
        "x2": x2,
        "y2": y2
    }
        await websocket.send(json.dumps(event))
        #message = await aioconsole.ainput()




async def client_listener(websocket):
    while True:
        response = await websocket.recv()
        if response != "":
            event = json.loads(response)
        if event["type"] == "draw":
            pass
            #check who drew
            #update local canvas with given data
        elif event["type"] == "quit":
            pass
        elif event["type"] == "join":
            pass
        

asyncio.run(client())


"""
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
        "y": 9,
        "x2": 7,
        "y2": 11
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
        "x1": 4,
        "y1": 9,
        "x2": 7,
        "y2": 11
    }

"""