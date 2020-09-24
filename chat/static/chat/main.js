// capstone main.js file

//get the csrf token from the view
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


var csrftoken = getCookie('csrftoken');
// create de html element with the csrf cookie
const CSRFToken = () => {

    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
    );
};

// navbar and login-register components

class NavBar extends React.Component{
     
    constructor(props){
        super(props);
 
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this); 
        this.home = this.home.bind(this);      
    }
    login(value){
        ReactDOM.render(<Login value = {value}/>, document.querySelector("#myApp"));
    }

    home(){
        ReactDOM.render(<FirstPage login ={this.props.login} />, document.querySelector("#myApp")); 
    }

    logout(){
        fetch('/logout')
        .then(response => response.json())
        .then(value =>{
            ReactDOM.render(<NavBar login ={false}  name={""}/>, document.querySelector("#nav"));
            ReactDOM.render(<FirstPage login ={false} />, document.querySelector("#myApp")); 
                }    
            );     
    }

    render() {
        if(this.props.login){
            return(
                <nav className = "navbar navbar-expand-lg navbar-ligth py-auto" >
                    <a className="navbar-brand" onClick ={()=> this.home()}>Network</a> 
                      <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" id ="user-link"><strong>{this.props.name}</strong></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id = "logout" onClick={this.logout}>logout</a>
                            </li>             
                        </ul>
                </nav>
            );
        }else{
            return(
                <nav className="navbar navbar-expand-lg navbar-ligth ">
                    <a className="navbar-brand" onClick ={()=> this.home()}>Network</a>            
                      <ul className="navbar-nav">  
                            <li className="nav-item">
                                <a className="nav-link"  id ="user-link"><strong>{this.props.name}</strong></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id = "login" onClick={() => this.login("login")}>login</a>
                            </li>
                            <li className="nav-item">
                                <a  className="nav-link" id = "register" onClick={() => this.login("register")}>register</a>
                            </li>                    
                        </ul>
                </nav>
            );

        }
    }
}

class Login extends  React.Component{
    constructor(props){
        super(props); 
        this.state = {
            user: "",
            password:"",
            confirm:"",
            email: ""
        }
        
        this.inputLogin = this.inputLogin.bind(this)
        this.inputRegister = this.inputRegister.bind(this)
        this.handleUserChange = this.handleUserChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordConfirmationChange=this.handlePasswordConfirmationChange.bind(this)
    }

    inputLogin(e){
        e.preventDefault();
        fetch('/login',{
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            method : 'POST',
            body :JSON.stringify({
                username: this.state.user,
                password: this.state.password,     
          })    
        })
        .then(response => response.json())
        .then(result => {
            this.setState({ user: "" });
            this.setState({ password: "" });
           
            ReactDOM.render(<NavBar login ={result.login}  name={result.name}/>, document.querySelector("#nav"));
            ReactDOM.render(<FirstPage login ={result.login} />, document.querySelector("#myApp")); 
        })
    }

    inputRegister(e){
        e.preventDefault();
        fetch('/register',{
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            method : 'POST',
            body :JSON.stringify({
                username: this.state.user,
                email: this.state.email,
                password: this.state.password,
                confirmation: this.state.confirm,                    
          })    
        })
        .then(response => response.json())
        .then(result => {
           
            this.setState({ user: "" });
            this.setState({ password: "" });
            this.setState({ email: "" });
            this.setState({ confirm: "" });

            ReactDOM.render(<NavBar login ={result.login}  name={result.name}/>, document.querySelector("#nav"));
            ReactDOM.render(<FirstPage login ={result.login}/>, document.querySelector("#myApp")); 

        })
    }

    // handle functions

    handleUserChange(e) {
        this.setState({ user: e.target.value });
      }
    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
      }
    handlePasswordConfirmationChange(e) {
        this.setState({ confirm: e.target.value });
      }
    handleEmailChange(e) {
        this.setState({ email: e.target.value });
      }

    
    render() { 
        if (this.props.value === "login"){
            return (

                <div className= "login-form" onClick={this.props.onClick}>
                    <form method="POST" onSubmit = {this.inputLogin}>
                    <CSRFToken />
                        <div className="form-group">
                            <div className = "login-name">LOGIN</div>
                            <label htmlFor ="username-login">Username</label>
                            <input type ="text"  id = "username-login" name="username" onChange={this.handleUserChange} value={this.state.user} />
                            <label htmlFor ="password-login">Password</label>
                            <input type ="password" id ="password-login" name="password" onChange={this.handlePasswordChange} value={this.state.password}/>
                            <input className= "btn btn-dark" type="submit" value = "submit" />
                        </div>
                    </form>
                </div>   
            );

        }else if(this.props.value === "register"){
            
                return(
                    <div className= "login-form" onClick={this.props.onClick} >
                        <form  action="" method="POST" onSubmit = {this.inputRegister}>
                        <CSRFToken />
                        <div className="form-group">
                                <div className = "login-name">REGISTER</div>
                                <label htmlFor ="username-register">Username</label>
                                <input type ="text" id = "username-register" onChange={this.handleUserChange} value={this.state.user}/>
                                <label htmlFor ="email">Email</label>
                                <input type ="email" id = "email" onChange={this.handleEmailChange} value={this.state.email}/>
                                <label htmlFor ="password-register">Password</label>
                                <input type ="password" id = "password-register" onChange={this.handlePasswordChange} value={this.state.password}/>
                                <label htmlFor ="password-confirmation">confirm password</label>
                                <input type ="password" id = "password-confirmation" onChange={this.handlePasswordConfirmationChange} value={this.state.confirm}/>
                                <input className= "btn btn-dark" type="submit" value = "submit"/>
                            </div>
                        </form>
                    </div>
                );
            }
        }
    }
    
// component with the buttons create and join inside

class FirstPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login: this.props.login,
            token: "",
            show:false,
            chats: []
        };
        this.createChat = this.createChat.bind(this);
        this.joinChat = this.joinChat.bind(this);
    }
    

    createChat(){
        ReactDOM.render(<JoinCreateChat login = {this.state.login} value={"create"} />, document.querySelector("#myApp"));
    }
    joinChat(){
        ReactDOM.render(<JoinCreateChat login = {this.state.login} value={"join"} />, document.querySelector("#myApp"));
    }

      render() { 
          return (
            <div style ={{display:"flex",flexFlow: "column",width:"100%"}}>
                <MainChatButton login = {this.state.login}/>
                <div className= "row row-btns" onClick={this.props.onClick}>
                    <div className= "col-12 col-sm-6" >
                        <div className = "btn-container">
                            <div onClick={this.createChat} className = "btn-create"><p className = "p-btn">Create</p></div>
                        </div>
                    </div>
                    <div className= "col-12 col-sm" >
                        <div className="btn-container">
                            <div onClick={this.joinChat} className = "btn-create" ><p className = "p-btn">Join</p></div>
                        </div>
                    </div>    
                </div>
            </div>
          );
      }
  }

  class MainChatButton extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            show:false,
            chats: []
          }
        
        fetch("/chats")
        .then(response => response.json())
        .then(value =>{
            if(!value.error){
            value.forEach(element => {
                this.setState(state =>({
                    chats : state.chats.concat({token:element.token,name:element.name,id:element.myId,myChat:element.myChat})     
                    })) 
                });
            }
        })
        this.checkChat = this.checkChat.bind(this)
      }


    checkChat(){
        if(this.props.login){
            if(this.state.show === false){
                this.setState({show:true})
            }else{
                this.setState({show:false})
            }
        }else{
            alert("login first")
        }
    }

    render(){
        return(
            <div className = "chats">
                <button onClick ={this.checkChat} className = "chat-room" >+</button>
                <div className = "ctn-chat" style = {{display: this.state.show ? 'block' : 'none'}}> 
                    <div className="ctn-chat-btn" >
                    {this.state.chats.map((item,key) => (
                        <ChatButton key={key} token = {item.token} name = {item.name} id={item.id} myChat ={item.myChat}/>
                    ))}   
                    </div>
                </div>
            </div>
        )}
  }

  class ChatButton extends React.Component{
    constructor(props){
        super(props)
        this.openChat = this.openChat.bind(this)
    }

    openChat(){
        ReactDOM.render(<ChatPage name = {this.props.name} id = {this.props.id} token ={this.props.token}/>, document.querySelector("#myApp"));
    }

    render(){
        if(this.props.myChat){
            return(
                <div className = "chat-mychat" onClick={this.openChat}>                  
                        <div>{this.props.name[0].toUpperCase()}</div>                
                </div>
            )
        }else{
            return(
                <div className = "chat-otherchat" onClick={this.openChat}>
                    <div>{this.props.name[0].toUpperCase()}</div>
                </div>
                )
            } 
        }
  }
        

  class JoinCreateChat extends React.Component{
    constructor(props){
        super(props);
        this.renderFirstPage = this.renderFirstPage.bind(this)
    }
    renderFirstPage(){
        ReactDOM.render(<FirstPage login = {this.props.login}/>, document.querySelector("#myApp"));
    }

    render(){ 
        
        return (
         <div> 
            <div className="outside-card" onClick = {this.renderFirstPage}></div>
            <div className="bg-card">         
                <Token value ={this.props.value}/>      
            </div>
        </div>         

        );
    }
  }

  class Token extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            token : "insert your token",
            error: "",
            name:"insert the chat's name",
            create:true
        
        }

        //Get the random token to get access
        
        fetch('/getToken')
            .then(response => response.json())
            .then(value =>{
                if (this.props.value === "create"){
                    this.setState({token:value.token})
                }
            });

        this.copyToken = this.copyToken.bind(this)
        this.join = this.join.bind(this)
        this.handleToken = this.handleToken.bind(this)
        this.handleName = this.handleName.bind(this)
 
    }

    // copy the token into the clipboard function
    copyToken(){
        
        if(this.state.error === "" && this.state.token !== "insert your token"){
            navigator.clipboard.writeText(this.state.token)
            alert("succefull copied")
        }else{
            alert("dont copied")
        }
    }

    join(e){
        e.preventDefault()
        if (this.state.token.length === 20 ){
            if ((this.state.create === true && (this.state.name != "insert the chat's name" && this.state.name != "")) || this.state.create === false){
              
                fetch('/join',{
                    headers: {'X-CSRFToken': getCookie('csrftoken')},
                    method : 'POST',
                    body :JSON.stringify({
                        token: this.state.token, 
                        create:this.state.create, 
                        name:this.state.name,              
                }) 
                })
                .then(response => response.json())
                .then(value =>{
                    if (value.valid){
                        ReactDOM.render(<ChatPage name = {value.name} id = {value.id} token ={this.state.token}/>, document.querySelector("#myApp"));
                    }else{
                        alert("invalid token or fill the name ") 
                        this.setState({token:"insert your token"}) 
                    } 
                })
            }
        }else{
            alert("Invalid Token")
        }
    }

    handleToken(e) {
        this.setState({ token: e.target.value});
    }
    handleName(e){
        this.setState({name:e.target.value})
    }
    

    render(){
        if (this.props.value === "create"){
        
            return(
                <div className=" ctn-card ">
                    <form action="" method="POST" onSubmit = {this.join}>
                        <CSRFToken />
                        <div className="token"> 
                            <input className = "token-text" type ="text" maxLength = "30" autoComplete="off"  onClick={()=>{this.setState({name:""})}} onChange={this.handleName} value={this.state.name}/>
                        </div>
                        <div className="token">
                            <div className = "token-text">{this.state.token}</div>
                            <i className="fas fa-copy fa-2x" onClick ={this.copyToken}></i>
                        </div>
                        <input type ="submit" className = "join" onClick={()=>{this.setState({create:true})}}  value = "Join"/>
                    </form>
                </div>        
                
            );
        }else if(this.props.value === "join"){
     
            return(
                <div className="ctn-card ">  
                    <form  action="" method="POST" onSubmit = {this.join}>
                        <CSRFToken />
                        <div className="token">                      
                            <input className = "token-text" type ="text"  autoComplete="off" onClick={()=>{this.setState({token:""})}} onChange={this.handleToken} value={this.state.token} />   
                        </div>
                        <input type ="submit" className = "join" onClick={()=>{this.setState({create:false})}} value = "Join"/>
                    </form>               
                </div>  
            );
        }
      }
    }

    fetch('/authenticated')
        .then(response => response.json())
        .then(value =>{   
            ReactDOM.render(<NavBar login ={value.login}  name={value.name}/>, document.querySelector("#nav"));
            ReactDOM.render(<FirstPage login ={value.login} />, document.querySelector("#myApp")); 
        }    
            );

////////////////////////////////////////  chat app   //////////////////////////////////////////


// websocket component

// if the server get down or the connection for any reason it's lose, each ten secs the socket will try to connect again
class ChatPage extends React.Component{

    constructor(props){
        super(props)
        this.state ={
            close:false,
            ws:null,
            text:"",
            prev:false,
            prevId:0,
            msgPage:1,
            messages: [], 
            username:[],
        }



        this.sendMessage = this.sendMessage.bind(this)
        this.handleText = this.handleText.bind(this)
        this.updateMessage = this.updateMessage.bind(this)
        this.updateActiveUsers = this.updateActiveUsers.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.initialMessages = this.initialMessages.bind(this)

    }

    componentDidMount(){
        this.connect();
        this.initialMessages(1);
       
    }
    componentDidUpdate(prevProps){
       
        if(this.props.token !== prevProps.token){
           
            this.setState({
                close:false,
                ws:null,
                text:"",
                prev:false,
                prevId:0,
                msgPage:1,
                messages: [], 
                username:[],
            })
            this.connect();
            this.initialMessages(1);
            
        }
    }

    timeout = 250;

    connect = () => {
     
        var ws = new WebSocket(`ws://localhost:8000/chat/${this.props.token}/${this.props.id}`);
        let that = this; 
        var connectInterval;
        
         // websocket onopen event listener
        ws.onopen = () => {
            console.log("connected websocket main component");
            this.setState({ws:ws})
            that.timeout = 250; 
            clearTimeout(connectInterval); 

        };

        // websocket onclose event listener
        ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );

            if(!this.state.close){
                that.timeout = that.timeout + that.timeout; 
                connectInterval = setTimeout(this.check, Math.min(10000, that.timeout));
            }
        };

        // websocket onmessage event listener
        ws.onmessage = e=>{
                     
                const message = JSON.parse(e.data)
                if (message.type === "message"){
                    if(message.token === this.props.token){
                        this.updateMessage(message,false)
                    }

                }else if(message.type === "users"){
                    this.updateActiveUsers(message)
                }
            
                if(message.error === "invalid token or user do not join yet"){
                    ws.close();
                    this.setState({close:true})
                    ReactDOM.render(<FirstPage login ={true} />, document.querySelector("#myApp")); 
                }      
        }
    };

    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); 
    };

    sendMessage(e){
        e.preventDefault()
        try{
            this.state.ws.send(this.state.text);       
        }finally{
            this.setState({text:""})
        } 
    }

    initialMessages(ms){
       
        fetch(`messages/${this.props.token}/${ms}`)
            .then(response =>response.json())
            .then(data =>{
                data.forEach(message => {
                    this.updateMessage(message,true);
                });
                this.setState({msgPage:this.state.msgPage+1});
            })      
    }

    updateMessage(data,reverse){

        if (this.props.id === data.id){
            if(reverse ===false){
                this.setState(state =>({
                    messages : [{myMessage:true,username:data.user,msg:data.text,display:'block'}].concat(state.messages)
                }))
            }else{
                this.setState(state =>({
                    messages : state.messages.concat([{myMessage:true,username:data.user,msg:data.text,display:'block'}])
                })) 
            }
            
        }else{
            if(reverse ===false){
                this.setState(state =>({
                    messages :  [{myMessage:false,username:data.user,msg:data.text,'display':'block'}].concat(state.messages)
                }))
            }else{
                this.setState(state =>({
                    messages : state.messages.concat([{myMessage:false,username:data.user,msg:data.text,'display':'block'}])
                })) 
            } 
        }
    }

    updateActiveUsers(data){

        fetch(`users/${this.props.token}/`)
        .then(response => response.json())
        .then(value =>{
            this.setState({username:[]})
            value.usernames.forEach(element => {
                this.setState(state =>({
                    username :state.username.concat({username:element,activeState:false}) 
                }))
            });

            this.state.username.map((element,index) => {
                data.activeUsers.forEach(user => {
                   
                    if(element.username === user){
                        this.state.username[index].activeState = true;
                        this.setState({username:this.state.username})
                    } 
                });
            }); 
        })
}

    handleScroll(e){ 
        const bottom = e.target.scrollHeight + e.target.scrollTop === (e.target.clientHeight+1)
    
        if (bottom){
            this.initialMessages(this.state.msgPage);
        } 
    } 
    handleText(e){
        this.setState({text:e.target.value})
    }

    render() {         
        return( 
            <div className = "chat-app">
                <div className ="name-token">
                    <div className ="chat-name"># {this.props.name}</div>
                    <div className ="chat-token"> {this.props.token} :Token</div>
                </div>
                <MainChatButton login = {true}/>
                <div className ="row row-chat">
                    <div className ="col-12 col-sm-5 order-2 order-sm-0 col-champions"><Champions /></div>
                    <div className="col-12 col-sm-5 order-1 order-sm-1 col-chat">
                        <div className = "box">
                            <div className = "box-cnt">
                                <div className ="box-chat" onScroll ={this.handleScroll}>
                                    <div className ="box-msg">
                                        {this.state.messages.map((item,key) => (
                                            <Message key={key} myMessage = {item.myMessage} username = {item.username} text={item.msg} displayCircle ={item.display}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className = "input-msg">
                                <form action ="" onSubmit = {this.sendMessage}>
                                    <input type ="text" onChange ={this.handleText} value={this.state.text}/>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className = "col-12 col-sm-2 order-0 order-sm-2 col-users">
                        <div className = "users-active">
                            <div className = "user-active-box">
                                <p>Online Users</p>
                                    {this.state.username.map((item,key) => {
                                        if(item.activeState ==true){
                                            return <Usernames key={key} username = {item.username} activeState ={item.activeState} />
                                        }
                                    })} 
                            </div>
                            <div className = "user-unactive-box">
                                <p>Offline Users</p>
                                    {this.state.username.map((item,key) => {
                                        if(item.activeState ==false){
                                            return <Usernames key={key} username = {item.username} activeState ={item.activeState} />
                                        }
                                    })} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Message extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        if(this.props.myMessage ===true){
            return(
                <div className = "message-left">
                    <div className = "ms-image"></div>
                    <div className ="ms-content">
                        <div className= "ms-user">{this.props.username}</div>
                        <div className="ms-text">{this.props.text}</div>
                    </div>
                </div>
            )
        }else{
            return(
                <div className = "message-rigth">
                    <div className = "ms-image"></div>
                    <div className ="ms-content">
                        <div className= "ms-user">{this.props.username}</div>
                        <div className="ms-text">{this.props.text}</div>
                    </div>
                </div>
            )
        }    
    }      
}  


class Usernames extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        if(this.props.activeState){
            return(          
                <div className = "user-active-ctn">
                    <div className = "user-image"></div>
                    <div className= "username">{this.props.username}</div>
                </div> 
        )}else{
            return(
                <div className = "user-unactive-ctn">
                    <div className = "user-image"></div>
                    <div className= "username-unactive">{this.props.username}</div>
                </div>
            )
        }
    }
}

//show the stats and the img of each champion

class Champions extends React.Component{
    constructor(){
        super()
        this.state ={
            championImages:[],
            championInfo:[],
            championStats:[],
            championBlurb:[],
            championPartype:[],
            display : "none",
            oneChampionStats: []
        }

        this.showStats = this.showStats.bind(this);
    }

    componentDidMount(){
        fetch('http://ddragon.leagueoflegends.com/cdn/10.19.1/data/en_US/champion.json')
        .then(response => response.json())
        .then(data =>{
            Object.values(data.data).forEach(champion => {

                this.setState(state =>({
                    championImages : state.championImages.concat([{name:champion.name,full:champion.image.full,extended:`${champion.name}_0.jpg`}]),
                    championInfo : state.championInfo.concat([{name:champion.name,info:champion.info}]),
                    championStats: state.championStats.concat([{name:champion.name,stats:champion.stats}]),
                    championBlurb: state.championBlurb.concat([{name:champion.name,blurb:champion.blurb}]),
                    championPartype: state.championPartype.concat([{name:champion.name,partype:champion.partype}]),
                }))
            });
        })
    }

    showStats(name){
        
        this.setState({display:"flex"})
        this.state.championInfo.map((item,index) => {
            if(item.name === name){
                this.setState(state =>({
                  
                    oneChampionStats: [{
                        info:item,
                        stats:this.state.championStats[index].stats,
                        blurb:this.state.championBlurb[index].blurb,
                        ptype:this.state.championPartype[index].partype
                    }]   
                    }
                ))
            }
        })
    }


    render(){
        return(
        <div className = "champions">
            <div className ="champions-ctn">
                <div className = "champions-all">
                    <div className = "champions-all-overflow">
                    {this.state.championImages.map((item,key) => (
                        <div key={key} onClick ={()=>{this.showStats(item.name)}}>
                            <AllChampions key={key} route ={`http://ddragon.leagueoflegends.com/cdn/10.19.1/img/champion/${item.full}`} />
                        </div>
                        ))}
                    </div>
                </div>
                <div className = "champion-outside" style={{display:this.state.display}} onClick ={() =>{this.setState({display:"none"})}}><ChampionStats allStats = {this.state.oneChampionStats[0]}/></div>
            </div>
        </div>
        
        )
    }
}

// champion img
class AllChampions extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(<img className ="img-fluid" src = {this.props.route} />)
    }
}


// champion stats
class ChampionStats extends React.Component{
    constructor(props){
        super(props) 
    }

    render(){

       if(this.props.allStats != undefined){
        return(
            <div className="champion-bg">
                <div className="champion-ctn">
                    <div className ="all-stats">
                        <div className = "stats">
                            <div className = "champion-name">
                                {this.props.allStats.info.name}
                            </div>
                            <div className= "img-stats">
                                <img className ="img-fluid" src ={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${this.props.allStats.info.name}_0.jpg`}/>
                                <div className ="sp-stats">
                                    {Object.keys(this.props.allStats.stats).map((key,index) =>(
                                    
                                        <SpecificStats key ={index} value ={Object.values(this.props.allStats.stats)[index]} stat={key}/> 
                                    ))}
                                </div>
                            </div>
                                <div className = "blurb-text">
                                    {this.props.allStats.blurb}
                                </div>
                        </div>
                            <GenericStats  attack = {this.props.allStats.info.info.attack} defense ={this.props.allStats.info.info.defense} magic ={this.props.allStats.info.info.magic} difficulty ={this.props.allStats.info.info.difficulty}/> 
                    </div>
                </div>
            </div>
            )
        }else{
            return(<div></div>)
        }
    }
}

// progress bar of the champion
class GenericStats extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className ="generic-stats">
                <div>attack</div>
                <div className="progress">
                    <div className="progress-bar"  id = "color" role="progressbar" style ={{width: `${this.props.attack*10}%`}} aria-valuenow={`${this.props.attack}`} aria-valuemin="0" aria-valuemax="10">{this.props.attack}</div>
                </div>
                <div>defense</div>
                <div className="progress">
                    <div className="progress-bar"  id = "color" role="progressbar" style ={{width: `${this.props.defense*10}%`}} aria-valuenow={`${this.props.defense}`} aria-valuemin="0" aria-valuemax="10">{this.props.defense}</div>
                </div>
                <div>magic</div>
                <div className="progress">
                    <div className="progress-bar"  id = "color" role="progressbar" style ={{width: `${this.props.magic*10}%`}} aria-valuenow={`${this.props.magic}`} aria-valuemin="0" aria-valuemax="10">{this.props.magic}</div>
                </div>
                <div>difficulty</div>
                <div className="progress">
                    <div className="progress-bar" id = "color" role="progressbar" style ={{width: `${this.props.difficulty*10}%`}} aria-valuenow={`${this.props.difficulty}`} aria-valuemin="0" aria-valuemax="10">{this.props.difficulty}</div>
                </div>
            </div>
        )
    }
}

// champion specific stats
class SpecificStats extends React.Component{
    constructor(props){
        super(props)  
    }

    render(){
        return(
            <div className ="specific-stats">
                <div className = "champion-stat">{this.props.stat}: {this.props.value}</div>
            </div>
        )
    }
}