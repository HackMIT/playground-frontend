class Socket {
	constructor() {
		this.conn = null;
	}

	send(data) {
		this.conn.send(data);
	}

	start() {
		this.conn = new WebSocket("ws://localhost:8080/ws");
		this.conn.onopen = this.onopen;
		this.conn.onclose = this.onclose;
		this.conn.onmessage = this.onmessage;
	}
}

const socketInstance = new Socket();
export default socketInstance;
