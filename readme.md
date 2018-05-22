# A couple ways to deploy an app on [Amazon Lightsail](https://aws.amazon.com/lightsail/)

The application is a super simple Node / Express application that connects back to a Mongo database. 

Deploy the application with:

* [Amazon Lightsail's MEAN stack blueprint](#lightsails-mean-stack-blueprint)
* [Docker containers with Docker Compose](#docker-containers-with-docker-compose)

## Lightsail's MEAN stack blueprint

**Note**: This example assumes you're familiar with SSH and how to edit files in a Linux operating system. If you're not check out [this VIM tutorial](http://www.openvim.com/) and this aritcle [using SSH to connec to Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html).

The Lightsail MEAN stack blueprint includes components such as Node, Express, Apache, and Rockmongo. In order to deploy an application there are a few things that should be configured. 

**Note** : This walkthrough assumes you are familiar with both `ssh` and how to edit files in a Linux environment**

1. From the AWS console click `Lighsail` under `Compute`.

1. From the Lightsail console click `Create Instance`.

1. Choose whichever region you prefer.

1. Under `Select a blueprint` click on `MEAN`.

1. You can leave all the remaining settings at their defaults. 

1. Scroll to the bottom of the page, and click `Create`

  Once your intance is up and running, you will need to SSH into it. While in most cases you could use the integrated terminal, for this tutorial you'll need to use something like Putty on Windows or the integrated terminal on a Mac as you will need to open an SSH tunnel later in this walkthrough. 

#### Change the Default Apache Port

1. Once the instance is up and running navigate to its IP address in your browser.

   Notice that the Bitnami page comes up. This means Apache is using port 80, and we'll need to adjust that so your application can use the port instead

1. SSH into the running intance. 

   You can download the the default SSH key from Lightsail, and the username for the intance is `bitnami`. On a Mac or Linux machine the command would be as follows (make sure you're in the directory where your `default.pem` file is located):

   `ssh -i default.pem bitnami@<instance_ip>`

   **Note**: Make sure you replace `<instance_ip>` in the SSH command with the actual IP address of your Lightsail instance. 

1. Open up  `/opt/bitnami/apache2/conf/httpd.conf`  in your editor of choice and look for the line `Listen 80` change it so it reads `Listen 8080`. 
   
   Save the file.

1. Open up `/opt/bitnami/apache2/conf/bitnami/bitnami.conf` in your editor of choice and look modify the line that reads `<VirtualHost _default_:80>` to read `<VirtualHost _default_:8080>`

   Save the file.

1. Run the following command to restart Apache: `sudo /opt/bitnami/ctlscript.sh restart apache`

   **Note**: The comman output will say Apache is running on por 80. This is incorrect, you've reconfigured it to run on port 8080.

1. Next you'll need to open up port 8080 in the instance's firewall. 
   
   Move back to your web browser, and from the Lightsail menu click the three dot menu in the upper right corner of your intances's card and choose 'Manage`

1. Click on `Networking` from the horizontal menu

1. We'll need to open up port 8080 in the firewall. So scroll down, and click `+ Add another`. and enter `8080` for the port number. 

   Click `Save`

1. In your browser visit `http://instance_IP:8080` to verify the Bitnami page appears. 

   Now that Apache is running on port 8080, you can assign port 80 to our application. 

#### Add a User to Mongo

Before you can run the application, you'll need to create a user and assign it the right permissions in MongoDB. The application database name is `tasks` and the username and password for the application database will also be `tasks`. 

In order to access MongoDB we'll need the admin username and password. By default that username is `root` and the password is stored on a file in the home directory of the instance. 

1. Move back into your terminal windows (or start another SSH session if you've closed the previous one).

1. Make sure you're in the home directory for the bitnami user by entering `cd ~`

1. The password we'll need to access MongoDB is stored in the home directory in a file named `bitnami_application_password`

    Use `cat` to view the password: `cat bitnami_application_password`

    **Note**: Jot this password down somewhere as you will need it again in a few steps. 

1. Start the Mongo command shell: `mongo admin --username root -p`. When prompted enter the application password.

   You should now be running the MongoDB CLI. 

1. The application uses a database named `tasks` so switch to that now by entering `use tasks`. 

1. Next create a new user (`tasks`) with admin permissions for the `tasks` database by entering the following command:

    ```
    db.createUser(
        {
            user: "tasks",
            pwd: "tasks",
            roles: [ "dbOwner" ]
        }
    )
    ```

1. Verify the user was created: `show users`.

1. Exit the command shell by entering `exit`.

#### Accessing MongoDB using Rockmongo

The MEAN instance includes Rockmongo, a web-based GUI for MongoDB. However, by defauit it can only be accessed via connections from `localhost` or hosts with the IP address of `127.0.0.1`. 

Because your web browser is running on your local machine, you'll need to establish an SSH tunnel between your local machine and the Lightsail instance. 

**Note**: Step 1 below is for Mac and/or Linux users - if you're on Windows using Putty please see [the instructions on the Bitnami page](https://docs.bitnami.com/aws/faq/operating-servers-instances/access_ssh_tunnel/). Once you've configured Putty, pick up the instructions below at step 2. 

1. In your terminal open a second window and make sure you're in the directory with your `default.pem` file and create the SSH tunnel by entering the following command: 

   `ssh -N -L 8888:127.0.0.1:8080 -i default.pem bitnami@<instance_ip>`

   This command instructs your system to tunnel any requests to `http://127.0.0.1:8888/` port 8080 on your Lightsail instance. 

   **Note**: Be sure to substitute your Lightsail instance's IP address where it says `<isntance_ip>`. 

   **Note**: There is no output from this command the cursor will just appear below the command line and sit there. 

1. In your web browser navigate to `http://127.0.0.1:8888/rockmongo/`

1. Log in using the same credentials you used to access the MongoDB CLI previously. 

   You should be presented w/ the Rockmongo web UI. 

1. On the left hand side click `admin (2)`. 

1. On the left hand side click `system.users (2)`.

   On the right hand side, you should see a document for the user you created previously:

    ```
    {
    "_id": "tasks.tasks",
    "user": "tasks",
    "db": "tasks",
    "credentials": {
        "SCRAM-SHA-1": {
        "iterationCount": NumberInt(10000),
        "salt": "RTYpdaCLShO4JN4NWXvIKQ==",
        "storedKey": "HI2u8AbFAZSRbQVmZ85pwztQ5Ac=",
        "serverKey": "VxqIf3afMIuavMLOu8rgd+RbDeM=" 
        } 
    ```

#### Clone the Github repo and test out the application

Now that MongoDB is configured, we can actually install the application and test it out. The application is a simple Todo list that uses an Express web front end to connect back to MongoDB. 

1. Move back to your original session in your terminal (leave the SSH tunnel running).

1. Use `git` to clone the demo application repository into your Lightsail instance:

    `git clone https://github.com/mikegcoleman/todo.git`

1. Change into the application directory:

    `cd todo`

1. Install the necessary Node packages:

    `npm install --production`
    
1. The application needs a couple of environment variables. The first designates the port number and the second is the URL to connect to the MongoDB. These variables are read from a `.env` file that you'll need to create. 

   To create the file enter the following command:

   `touch .env`

1. Next use a text editor to add the two lines below and then save the file:

   ```
   PORT=80
   DB_URL=mongodb://tasks:tasks@localhost:27017/?authMechanism=SCRAM-SHA-1&authSource=tasks
   ```
    
1. Start the application:

   `sudo node ./bin/www`

   You should see a message the the application is running on port 80

1. In your web browser navigate to your instance IP to see the running application. 

1. To ensure everything is working as expected click `Add task` in the top menu. Fill in the details and click `Add Task`.

1. Go back to Rockmongo (if you've closed the SSH tunnel you'll need to reopen it) at: http://127.0.0.1:8888/rockmongo

1. Click on `tasks (1)` (the number may not be `1` if you added more than one task).

1. Click on `tasks (1)` under `keyword`

   You should should see the taks you added in the right hand pane. 

#### Cleanup

1. To close the SSH tunnel press `ctrl-c` in that terminal session.

1. To delete your Lightsail instance navigate to the Lightsail console, click the 3 dot menu in the upper right of the instance card, and click `Delete`.

   Confirm you wish to delete the instance. 


## Docker containers with Docker Compose
Currently Lightsail does not feature a Docker blueprint, but that's not really an issue. We can use the optional launch script to install Docker and make other necessary changes to the system. In the case of this tutorial you'll create an instance with a launch script that installs Docker and Docker Compose. It will also copy in the Docker Compose file that defines our application, and it will modify systemd so that on subsequent reboots our application automatically restarts. 

1. From the Lightsail console click `Create Instance`.

1. Choose whichever region you prefer.

1. Under `Select a blueprint` click on `OS Only` and choose the Ubuntu image. 

1. Click on `+ Add launch script`.

1. Enter the following code into the dialog box:
   
   ```
   curl -o lightsail-compose.sh https://raw.githubusercontent.com/mikegcoleman/todo/master/lightsail-compose.sh

   chmod +x ./lightsail-compose.sh

   ./lightsail-compose.sh
   ```

   **Note**: To see contents of that script, please visit the github repository

1. Choose the appropriate instance size. In this case, there's no reason to do anything more than the $5 size. 

1. Optionally rename the instance.

1. Click `Create`.

   Lightsail will launch a new instances, copy in our shell script, and execute it on first boot. 

   The shell script installs `docker` and `docker-compose`. It then copies over the Docker compose file. Next it copies in the systemd unit file, and registers it. This is the most reliable way to ensure the application runs automatically after a system restart. Finally, it starts the application via Docker Compose. 

1. Once the instance is up and running you can navigate to its IP address to see the running site. 

1. To ensure everything is working as expected click `Add task` in the top menu. Fill in the details and click `Add Task`.

   You should now have that task listed. 

1. Docker containers are ephemeral by default (meaning when a container reboots any changes made to the container are removed), but the Docker Compose file specified a persistent volume to use for the database data. 

   To make sure this is working, restart your Lightsail instance by navigatimg to the Lightsail console, clicking the 3 dot menu in the upper right of the instance card, and selecting `Restart`.

   **Note**: The instance will say it's running very quickly, however it will takea  minute or two before everything is booted up and running. 

1. Reload the application website in your browser and ensure your task is still listed to verify that the Docker volumes are persisting your data. 

#### Cleanup
1. To delete your Lightsail instance navigate to the Lightsail console, click the 3 dot menu in the upper right of the instance card, and click `Delete`.

   Confirm you wish to delete the instance. 

