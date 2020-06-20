import React from 'react'
import socketIOClient from "socket.io-client"
import './sas.scss'
import Mensaje from './Mensaje'
import './bootstrap-grid.min.css'

const socket = socketIOClient('localhost:4000/')
export default class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            texto: '',
            mensajes: [],
            entrar: false,
            nick: ''
        }
        this.chat = React.createRef()
    }

    componentDidMount(){
        if (Notification.permission !== 'granted')
             Notification.requestPermission();
        
       socket.on('mensaje', data => {
            console.log(data)
            let aux = this.state.mensajes
            let obj = {}
            obj.mensaje = data.texto
            obj.nick = data.nick
            obj.fecha = data.fecha
            obj.yo = (data.nick==this.state.nick)?true:false
            console.table(obj)
            aux.push(obj)
            this.setState({mensajes: aux})
             new Notification(data.nick+' dice: ', {
             //  icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
               body: data.texto,
              });
        })

       socket.on('escribiendo', data => {
            console.log(data)
            this.setState({escribiendo: data.mensaje})
        })
    }

    componentDidUpdate(){
        this.scroll()
    }

    scroll = () => {
        if(this.chat.current)
            this.chat.current.scrollTop = this.chat.current.scrollHeight;
    }

    handleTexto = (e) => {
        console.log(e)
        this.setState({texto:e.target.value, escribiendo: ''})
        console.log(e.target.value)
      //  socket.emit('escribiendo')
    }

    click = () => {
        let {texto, nick} = this.state
        if(texto!=""){

            console.log(this.chat)
            socket.emit('mensaje', {texto: texto, nick: nick})
            this.setState({texto: ''})
        }
        
    }

    handleNick = e => {
        this.setState({nick: e.target.value})
    }

    entrar = () => {
        let {nick} = this.state
        if(nick != ""){
            this.setState({entrar: true})
        }
    }

    render(){
        return(
            <>
                {
                    !this.state.entrar?
                    <div style={{height: '100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <span style={{marginRight: 10}}>Nick: </span>
                        <input onKeyPress={e => {
                            if(e.key=='Enter'){
                                this.entrar()
                            }
                        }} type='text' value = {this.state.nick} onChange = {this.handleNick}/>
                        <button className={'btn'} onClick={this.entrar}>Entrar</button>
                    </div> : 
                    <div>
                        <div className={'chat'} ref={this.chat}>
                            {
                                this.state.mensajes.map((ele, index) => <Mensaje
                                                                            key={index}
                                                                            nick={ele.nick}
                                                                            mensaje = {ele.mensaje}
                                                                            yo = {ele.yo}
                                                                        />)
                            }
                        </div>
                        <div className={'container-fluid'}>
                            <div className={'row'}>
                                <div className='col-xs-12 col-sm-10'>
                                    <input onKeyPress={(e) => {
                                        if(e.key=='Enter'){
                                            this.click()
                                        }
                                    }} style={{width: '100%'}} type='text' value = {this.state.texto} onChange = {this.handleTexto} />
                                </div>
                                <div className='col-xs-12 col-sm-2'>
                                    <button style={{width: '100%'}} className={'btn'} onClick = {this.click}>enviar</button>
                                </div>
                            </div>
                        </div>
                        
                        
                        
                    </div>
                }
                
            </>
            
        )
    }
}
