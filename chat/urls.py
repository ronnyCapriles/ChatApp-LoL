from django.urls import path
from websocket.urls import websocket
from . import views



urlpatterns = [
    path("",views.index,name = 'index'),
    path("login",views.login_view,name = 'login'),
    path("logout",views.logout_view, name ='logout'),
    path("register",views.register, name = 'register'),
    path("authenticated",views.authenticated,name='authenticated'),
    path("getToken",views.getToken,name="create"),
    path("join",views.join,name="join"),
    path("chats",views.chats,name = "chats"),
    path("users/<str:token>/",views.chatUsers, name = "users"),
    path("messages/<str:token>/<int:numberPage>",views.messages,name = "msg"),
    websocket("chat/<str:token>/<int:id>", views.chat)
]

