# Chat App

      The following repository corresponds to the final Project of the CS50's Web Programming with Python and JavaScript courses. A thematic asynchronous SPA chat room based on league of legends is presented: the Backend, an API written entirely in Python that implements asynchronous views, a Frontend developed with the usage of html5, Sass as a css3 preprocessor, and the react JS library. Also, PostgreSQL is being used for database management. 

      The app allows you to create chat rooms where several users can send messages in real-time. These messages are stored in the database and with the usage of an Infinity Scroll, it is possible to see previous messages made in the same room. Also, it utilizes the API of Riot Games focused on League of Legends to display information of the different champions the game has and to coordinate with the team which arrangement of champions would be appropriate without using an external page. 

### Files:

      Once the depository is downloaded, the project called Capstone will be seen on the inside. This will have 2 applications: the chat application and the WebSocket application. The chat app is in charge of the views management and the general structure of the project; on the other hand, the WebSocket application contains the middleware which manages the WebSocket type of requests. 

#### Chat:

      The chat application manages the views which are designed to respond with a JSON element in order to make asynchronous requests from the frontend. The application is composed of the default files generated by Django and the file views.py.    

#### Websocket:

      The WebSocket application is in charge of serving as middleware for the management of the WebSocket requests. Also, it contains the default generated files as well as the files middleware.py and connection.py.

      Broadly speaking, the file middleware.py contains a WebSocket function that receives an application as a parameter that in this case is the asynchronous application (ASGI) which Django generates. Then, it solves the type of request by returning a function called asgi which is in charge of connecting the URL address with our WebSocket class contained on the connection.py file. 

      The connection.py file contains all the structures of our WebSocket. I will assume that it is not necessary to explain the operation process of a WebSocket. In general terms, it constructs the types and methods that manage the different types of requests to the server, being the most important ones: accept, close, send, and receive; the rest of the methods are in charge of the submission process and the reception of different types of objects in between the client and the server. 

#### Database Managment:

      The project incorporates PostgreSQL in the database management the following lines of code which correspond to the configuration:

      ```python
      DATABASES = {
            'default': {
                  'ENGINE': 'django.db.backends.postgresql_psycopg2',
                  'NAME': 'final_project',
                  'USER': 'user_2',
                  'HOST': 'localhost',
                  'PASSWORD': 'postgres',
                  }
            }
      ```

#### Frontend:

      As was previously mentioned, the frontend of the app was built with the usage of the react JS library; all the components are contained in the file main.js. Also, the bootstrap library was used to ease the process of a responsive application; it is worth to mention that all these libraries are inserted through CDN links. 

### First Steps:

      Once the external packages are downloaded and the database is configured, the next  steps must be  followed:

#### Setup Server:

      The project utilizes Uvicorn as a server since it manages the ASGI applications, unlike the default server that contains Django.

      The following line of code starts the program and it can be accessed through the URL localhost:8000, an Http petition.

      ```bash
            >> py uvicorn capstone.asgi:application 
      ```

      Once the server is started, the user will be able to access and make usage of the web application
      
      The user must log in or register him/her in the web page; this one will not send any type of validation through email in the case of the creation of a new user. Once the user is registered, he/she will be able to create a new chat room, to join a chat room for the first time, or to join a chat room already created. Once the user is inside the room, he/she will be able to send messages and the other members of the room will receive them in real-time as well, and also the user will be able to look at the different champions statistics.