const http = require('http');
const moment = require('moment')
const {accountSid, authToken} = require('./secrets.json')
const client = require('twilio')(accountSid, authToken);

const hostname = 'localhost';
const port = 3000;

// start time and end time in IST
var startTime = moment("7:00:00", "HH:mm:ss");
var endTime = moment("23:00:00", "HH:mm:ss");

var participants = [ 'whatsapp:+919876543210']

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function sendMessage(){
	for(let participant of participants){
		await client.messages.create({
			from: 'whatsapp:+14155238886',
			body: "Hey, it's time to drink water.",
			to: participant
		})
	}
}


async function main(){
	console.log("Script started. This script notifies you to drink water after every two hours.")
	let last = moment()

	while(true){
		let now = moment()
		if(now.isBetween(startTime, endTime)){
			if(moment.duration(now.diff(last)).asHours() >= 2){
				console.log(`${now} : Sending message now.`)
				await sendMessage()
				last = now
				await sleep(1000) // to slow down the speed of while loop.
			}
		}
	}
}


main()

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
