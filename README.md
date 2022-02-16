# Algemeen

- docker image repo : https://registry.cp.kpn-dsh.com/

# 1 ) Makefile aanpassen

PLATFORM=poc
TENANT=<tenant>
DOCKER_REPO_URL=registry.cp.kpn-dsh.com/$(TENANT)
VERSION:=1
tagname=example-kafkajs
tenantuserid=<userid>

# 2 ) Uitvoeren
make all

# 3 ) Voorbeeld config @ DSH

{
	"name": "example-kafkajs",
	"image": "registry.cp.kpn-dsh.com/<tenant>/example-kafkajs:1",
	"cpus": 0.1,
	"mem": 256,
	"env": {
		"KAFKA_TOPIC": "<stream.topic>"
	},
	"instances": 1,
	"singleInstance": false,
	"needsToken": true,
	"user": "<userid>:<userid>"
}