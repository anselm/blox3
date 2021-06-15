const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 5000

app.use(express.static('public'))

let cache = {}

let channel = 'all'

io.on('connection', (socket) => {
	console.log("Connected " + socket.id)
	socket.on('disconnect', () => {
		let socketid = socket.id
		console.log('Disconnected socket=' + socketid)
		for(const [k,v] of Object.entries(cache)) {
			let data = v
			if(data && data.sponsor && data.sponsor==socketid) {
				console.log("deleting path=" + k + " from socket="+socketid)
				data.event="delete"
				io.emit(channel,data)
				delete cache[k]
				break
			}
		}
	});
	socket.on(channel, (data) => {
		if(!data.event) {
			console.error("Bad data")
			console.error(data)
			return
		}
		switch(data.event) {
			case "refresh":
				// get a copy of cache
				for (const [key, datacached] of Object.entries(cache)) socket.emit(channel,datacached)
				break
			case "update":
				// send to all including self
				if(data.path) {
					data.sponsor=socket.id
					if(!cache[data.path]) {
						console.log("Adding path=" + data.path + " socket=" + socket.id)
					}
					cache[data.path]=data
				}
				io.emit(channel,data)
				break
			case "update_others_volatile":
				// send to others only and as volatile only
				if(data.path) {
					data.sponsor=socket.id
					if(!cache[data.path]) {
						console.log("Adding via volatile path=" + data.path + " socket=" + socket.id)
					}
					cache[data.path]=data
				}
				socket.volatile.broadcast.emit(channel,data)
				break
			case "delete":
				// delete and tell everybody including self
				if(data.path)delete cache[data.path]
				io.emit(channel,data)
				break
		}
	})
})

http.listen(port, () => {
	console.log('listening on *:5000')
})
