## A couple ways to deploy an app on [Amazon Lightsail](https://aws.amazon.com/lightsail/)

The application is a super simple Node / Express application that connects back to a Mongo database. 

Deploy the application with:

* [Lightsail's MEAN stack blueprint](#lightsails-mean-stack-blueprint)
* [Docker containers with Docker Compose](#docker-containers-with-docker-compose)
* Docker containers with Single-node Docker Swarm (TBD)
* Docker containers with a Single-node Kubernetes Cluster (TBD)

### Lightsail's MEAN stack blueprint

### Docker containers with Docker Compose
Currently Lightsail does not feature a Docker blueprint, but that's not really an issue. We can use the optional launch script to take care of what needs to be done. 

1. From the Lightsail console click `Create Instance`

1. Choose whichever region you prefer

1. Under `Select a blueprint` click on `OS Only` and choose the Ubuntu image. 

1. Click on `+ Add launch script`

1. Enter the following code into the dialog box
   
   ```
   curl -o lightsail-compose.sh https://raw.githubusercontent.com/mikegcoleman/todo/master/lightsail-compose.sh

   chmod +x ./lightsail-compose.sh

   ./lightsail-compose.sh
   ```
1. Choose the appropriate instance size. In this case, there's no reason to do anything more than the $5 size. 

1. Optionally rename the instance

1. Click `Create`
