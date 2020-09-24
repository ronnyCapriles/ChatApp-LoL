from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
      pass

class Token(models.Model):
      user = models.ForeignKey("User", verbose_name= "TokenUser", on_delete=models.CASCADE)
      token = models.CharField("token", max_length=20)

class ChatRoom(models.Model):
      users = models.ManyToManyField("User", verbose_name="users",related_name= "chatUsers")
      token = models.OneToOneField("Token", verbose_name="chatToken", on_delete=models.CASCADE)
      name = models.CharField("name",max_length = 30) 

      def serialize(self,id):
            if (id == self.token.user.id):
                  
                  return {
                        
                        "token": self.token.token,
                        "name":self.name,
                        "myId": id,
                        "myChat":True,
                  }
            else:
                  return {
                        
                        "token": self.token.token,
                        "name":self.name,
                        "myId": id,
                        "myChat":False,
                  }
      
class Message(models.Model):
      chat = models.ForeignKey("ChatRoom", verbose_name= "chat", on_delete=models.CASCADE)
      user = models.ForeignKey("User", verbose_name= "User", on_delete=models.CASCADE)
      message = models.CharField("text", max_length=200)
      timestamp = models.DateTimeField(auto_now_add=True)

      def serialize(self):
            return{
                  "id":self.user.id,
                  "user":self.user.username,
                  "text":self.message
            }
