## A couple ways to deploy an app on [Amazon Lightsail](https://aws.amazon.com/lightsail/)

The application is a super simple Node / Express application that connects back to a Mongo database. 

Deploy the application with:

* [Lightsail's MEAN stack blueprint](#lightsails-mean-stack-blueprint)
* [Docker containers with Docker Compose](#docker-containers-with-docker-compose)


### Lightsail's MEAN stack blueprint
The Lightsail MEAN stack blueprint includes components such as Node, Express, Apache, and Rockmongo. In order to deploy an application there are a few things that should be configured. 

** Note: This walkthrough assumes you are familiar with both `ssh` and how to edit files in a Linux environment**

1. From the Lightsail console click `Create Instance`

1. Choose whichever region you prefer

1. Under `Select a blueprint` click on `MEAN`

1. For this example you can use the $5.00 bundle

1. Optionally pick a name for your instance. 

1. Click `Create`

  Once your intance is up and running, you will need to SSH into it. While you could use the integrated terminal, it's probably easier to use something like Putty on Windows or the integrated terminal on a Mac as you will need to open two sessions later in this tutorial

1. Once the instance is up and running navigate to its IP address in your browser

   Notice that the Bitnami page comes up. This means Apache is using port 80, and we'll need to adjust that so your application can use the port instead

1. SSH into the running intance. 

   You can download the the default SSH key from Lightsail, and the username for the intance is `bitnami`. On a Mac or Linux machine the command would be as follows (make sure you're in the directory where your `default.pem` file is located):

   `ssh -i default.pem bitnami@instance_ip>`

1. Open up  `/opt/bitnami/apache2/conf/httpd.conf` file in your editor of choice and look for the line `Listen 80` change it so it reads `Listen 8080`. 
   
   Save the file

1. Open 



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

   Lightsail will launch a new instances, copy in our shell script, and execute it on first boot. 

   The shell script installs `docker` and `docker-compose`. It then copies over the Docker compose file. Next it copies in the systemd unit file, and registers it. This is the most reliable way to ensure the application runs automatically after a system restart. Finally, it starts the application via Docker Compose. 

1. Once the instance is up and running you can navigate to its IP address to see the running site. 

