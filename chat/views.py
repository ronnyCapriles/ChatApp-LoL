import json
from django.shortcuts import render,redirect
from django.db import IntegrityError
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.utils.crypto import get_random_string
from django.contrib.auth.decorators import login_required
from asgiref.sync import sync_to_async
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.paginator import Paginator

from .models import *


# firts page view
@ensure_csrf_cookie
def index(request):
      return render(request,'firstPage.html')


def login_view(request):
      if request.method == "POST":
           
            # Attempt to sign user in
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
          
            user = authenticate(request, username= username, password= password)

            # Check if authentication successful
            if user is not None:
                  login(request, user)
                  return JsonResponse({"name":request.user.username,"login":True},status = 200)
            else:
                  return JsonResponse({"error":"Invalid username or password"},status = 400)
      else:
            return JsonResponse({"login":True ,"name":request.user.username},status = 200)


def logout_view(request):
    logout(request)
    return JsonResponse({"login":False ,"name":""},status = 200)


def register(request):

      if request.method == "POST":

            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")

            # Ensure password matches confirmation
            password = data.get("password")
            confirmation = data.get("confirmation")

            if password != confirmation:
                  return JsonResponse({"error":"Password must match"},status = 400)

            # Attempt to create new user
            try:
                  user = User.objects.create_user(username, email, password)
                  user.save()
            except IntegrityError:
                  return JsonResponse({"error":"Username already taken"},status = 400)
            login(request, user)
            return JsonResponse({"name":request.user.username,"login":True},status = 200)
      else:
            return render(request, "firstPage.html")


def authenticated(request):
      # return if the user its login or not
      if request.user.is_authenticated:
            return JsonResponse({"name":request.user.username,"login":True},status = 200)
      else:
            return JsonResponse({"name":"","login":False},status = 200)

def getToken(request):
      if request.user.is_authenticated:

            #create a random token
            token = get_random_string(length=20)

            # if it already exists, create another
            try:
                  while(len(Token.objects.filter(token = token))):
                        token = get_random_string(length=20)          
            except:
                  pass
            
            return JsonResponse({"token":token},status = 200)

      else:
            return JsonResponse({"token":"Please Login First"},status = 400)

@login_required
def join(request):
      if request.method == 'POST':
            data = json.loads(request.body)
            token = data.get("token")
            create = data.get("create")
            name = data.get("name")
            user = User.objects.get(id = request.user.id)

      # join the users into the chat room

            if create:
                  newToken = Token(user=request.user,token = token)
                  newToken.save()
                  chat = ChatRoom(token = newToken,name = name)
                  chat.save()
                  chat.users.add(user)
                  return JsonResponse({"valid":True,"id":request.user.id,"name":chat.name},status = 200)
            else:
                  try:  
                        token =Token.objects.get(token = token)
                        chat = ChatRoom.objects.get(token = token)
                        chat.users.add(user)
                        return JsonResponse({"valid":True,"id":request.user.id,"name":chat.name},status = 200)
                  except:
                        return JsonResponse({"valid":False},status = 400)
      else:
            pass

@login_required
def chats(request):

      # return a list of all user chats
      try:
            chats = ChatRoom.objects.filter(users = request.user)
         
      except:
            return JsonResponse({"error":True})

      return JsonResponse([chat.serialize(request.user.id) for chat in chats],safe = False)

def chatUsers(request,token):
      
      #returns an object with the chat asociated with the token and the users within the chat
      try:
            token = Token.objects.get(token = token)
            chat = ChatRoom.objects.get(token = token)
            users = chat.users.all()
  
      except:
            return JsonResponse({"error":True})

      return JsonResponse({"chatRoomName": chat.name,"usernames":[user.username for user in users]},safe = False)

# send messages into the chat

def messages(request,token,numberPage):

      token = Token.objects.get(token = token)
      chat = ChatRoom.objects.get(token = token)
      allMessages = Message.objects.filter(chat = chat)
      orederdMessages = allMessages.order_by("-timestamp").all()
      paginationMessages = Paginator(allMessages,20)
      return JsonResponse([message.serialize() for message in paginationMessages.page(numberPage).object_list],safe = False)


## websocket view
async def chat(socket,token,id):
     
      await socket.accept()

      try:
            token_object = await sync_to_async(Token.objects.get, thread_sensitive=True)(token = token)
            chat = await sync_to_async(ChatRoom.objects.get, thread_sensitive=True)(token= token_object)
            user = await sync_to_async(User.objects.get, thread_sensitive=True)(id= id)
      except:
            await socket.send_json({"error":"invalid token or user do not join yet"})
      
   
      handleSocket(socket,token,user.username)

      for ws in getSockets(token):
            await ws.send_json({
                  'type': 'users',
                  'activeUsers': [user for user in getUsernames(token)]
            })

      while True:
     
            event = await socket.receive()
            if event['type'] == 'websocket.connect':
                  await socket.send_json({
                        'type': 'websocket.accept'
                  })

            if event['type'] == 'websocket.disconnect':
                  deleteSocket(socket,token,user.username)
                  for ws in getSockets(token):
                        await ws.send_json({
                              'type': 'users',
                              'activeUsers': [user for user in getUsernames(token)]
                        })
                  await socket.close()
                  break

            if event['type'] == 'websocket.receive':

                  text = event["text"]
                 
                  await save_message(chat,user,text)
                 
                  for ws in getSockets(token):
                        await ws.send_json({
                              'type': 'message',
                              'token':token,
                              'user':user.username,
                              'id':id,
                              'text': text,
                        })
                  
       
# save the messages into the database
@sync_to_async
def save_message(chat,user,message):
      message = Message(chat = chat,user =user,message = message)
      message.save()


## handle the multiples chatrooms 

chatRoom = [{'token':str,'users':[{'websockets':object,'usernames':str}]}]    

def handleSocket(ws,t,username):

      for dicts in chatRoom:
            if dicts['token'] == t:
                  for user in dicts['users']:
                        if user['usernames'] == username:
                              user['websockets'] =ws
                              return
                  dicts['users'].append({'websockets':ws,'usernames':username})
                  return

      chatRoom.append({'token':t,'users':[{'websockets':ws,'usernames':username}]})

def deleteSocket(ws,t,username):
      for dicts in chatRoom:
            if dicts['token'] == t:
                  i = 0
                  for user in dicts['users']:
                        if user['usernames']==username:
                              dicts['users'].pop(i)
                        i = i+1
 
def getSockets(t):
      ws = []
      for dicts in chatRoom:
            if dicts['token'] == t:
                  for user in dicts['users']:
                        ws.append(user['websockets'])
                  return ws

def getUsernames(t):
      un = []
      for dicts in chatRoom:
            if dicts['token'] == t:
                  for user in dicts['users']:
                        un.append(user['usernames'])
                  return un             
            
      
     