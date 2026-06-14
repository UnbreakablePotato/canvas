A real-time, multi-user collaborative drawing canvas. This project uses Python's websockets library on the backend to handle concurrent connections and broadcast drawing events to an HTML5 Canvas frontend.

## Features
* **Real-Time Collaboration**: Multiple users can draw on the same canvas simultaneously with minimal latency.
* **Lightweight Backend**: Powered by Python's native asyncio and the websockets library.
* **Vanilla Frontend**: Clean and simple HTML5 Canvas and JavaScript implementation. No frameworks required.
* **Broadcast Architecture**: The server tracks active connections and broadcasts coordinates and stroke data to all connected clients.

## Prerequisites

* **Python 3.10+**
* A modern web browser (Chrome, Firefox, Safari, Edge)

## Installation
* **Clone the repository**
 In your termninal: 
 ```console
 foo@bar:~$ git clone [https://github.com/UnbreakablePotato/canvas.git](https://github.com/UnbreakablePotato/canvas.git)
 foo@bar:~$ cd canvas
 ```

* **Set up your virtual environment**
```console
 foo@bar:~$ python -m venv venv
```

* **Install the websockets library**
```console
 foo@bar:~$ pip install websockets
 ```