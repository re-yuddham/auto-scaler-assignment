var path = require('path'),
	express = require('express'),
	app = express();    

const config = require('config');
const enVars =
(process.env.VCAP_SERVICES && JSON.parse(process.env.VCAP_SERVICES)) || "";
const envVar = enVars.rabbitmq[0];
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var amqp = require('amqplib/callback_api');

console.log(envVar.credentials.protocols.management);

const client = require('http-rabbitmq-manager').client({
    host : envVar.credentials.protocols.management.hostname,
    port : envVar.credentials.protocols.management.port,
    timeout : 12000,
    user : envVar.credentials.protocols.management.username,
    password : envVar.credentials.protocols.management.password
});


const sendMesssageToAllQueues = (queues, msg) =>  {
    amqp.connect(envVar.credentials.uri, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
        throw error1;
        }


        queues.forEach(queue => channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg))));
        console.log(" [x] Sent %s", msg);
    });
    setTimeout(() =>{ 
        connection.close(); 
    }, 1000);

    });
}

const fetchAllDeclaredQueues = () => {

    return new Promise((resolve, reject) => {
        client.listQueues({
            vhost : envVar.credentials.protocols.management.virtual_host
        }, function (err, res) {
            if (err) {
                reject(err);
            } else {
                const filteredQueues = res.filter(queue => new RegExp("^requests_").test(queue.name)).map(queue => queue.name);
                console.log(filteredQueues);
                resolve(filteredQueues);
            }
        });
    });
    
}

app.post('/requests',async(req,res) => {
    var parsedBody = req.body;

    //skip all safety checks
    const totalQueues = await fetchAllDeclaredQueues();

    //skip all safety checks
    const totalRequestCountPerInstance = Math.floor(parsedBody.requestCount / totalQueues.length);

    console.log(`Count : ${totalRequestCountPerInstance}`);
    const payload = {
        requestCount: totalRequestCountPerInstance
    };

    if(totalQueues.length > 0) { 
        sendMesssageToAllQueues(totalQueues, payload);
    } 
    res.send("OK"); 
});


var port = process.env.PORT || 8420;
app.listen(port,function () {
        console.log('end point running on : '+port);
});