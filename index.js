const { Kafka } = require('kafkajs')
var fs = require('fs');

class simpleConsumer{
    
     constructor(){
         this.tenant_config     = JSON.parse(process.env.JSON_TENANT_CONFIG ? process.env.JSON_TENANT_CONFIG : "")
         this.kafka_topic       = this.tenant_config['streams'][process.env.KAFKA_TOPIC]['read']
         this.client_id         = process.env.MESOS_TASK_ID
         this.message           = process.env.MESSAGE ? process.env.MESSAGE : this.client_id + " is subscribed on stream/topic " + this.kafka_topic
     }

     isConfigValid(){
        var v = false;
        if (
            this.tenant_config !== undefined &&
            this.tenant_config['brokers'] !== undefined &&
            this.tenant_config['streams'] !== undefined &&
            this.tenant_config['private_consumer_groups'] !== undefined &&
            this.tenant_config['shared_consumer_groups'] !== undefined &&
            this.kafka_topic !== undefined && this.kafka_topic !== "" &&
            this.client_id !==undefined 
    
        ){
            v = true
        }
        else{
            console.error("missing required params")
        }
        return v;
    }

     async startApp(){

        if(this.isConfigValid()){
        
            this.kafka_config = {
                clientId: this.client_id,
                brokers: this.tenant_config['brokers'],
                initialRetryTime: 100,
                retries: 10,
                ssl: {
                    rejectUnauthorized: false,
                    ca: fs.readFileSync('/home/node/app/ca.crt'),
                    cert: fs.readFileSync('/home/node/app/client.crt'),
                    key: fs.readFileSync('/home/node/app/client.key')
                },
            }

            this.connector = new Kafka(this.kafka_config)

            

            //read stream
            this.consumer =  this.connector.consumer({groupId: this.tenant_config['private_consumer_groups'][1]})
            await this.consumer.connect()
            await this.consumer.subscribe({topic: new RegExp(this.kafka_topic)})

            await this.consumer.run({

                eachMessage: async ({topic, partition, message}) => {
                    console.log({
                        topic,
                        partition,
                        date: Date.now().toLocaleString(),
                        value: message.value.toString(),
                    })
                }
            })
        }
    }
     
};

var app = new simpleConsumer()
app.startApp()