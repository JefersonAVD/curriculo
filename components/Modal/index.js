import {  Modal , Delete } from "rbx"
import { modalToogle } from "../../pages/_app"
import { useContext } from "react"


export default function MyModal({children,title}) {
    const {toggle,changetoggle} = useContext(modalToogle)

    return ( 
        
        <div hidden={toggle} className={ !toggle ? 'is-flex modalRoot' : undefined} >
            <Modal.Background onClick={()=>{}}/>
            <Modal.Card>
                <Modal.Card.Head>
                <Modal.Card.Title>{title}</Modal.Card.Title>
                    <Delete as='a' onClick={()=>{changetoggle(!toggle)}}/>
                </Modal.Card.Head>
                <Modal.Card.Body>
                    {children}
                </Modal.Card.Body>
                <Modal.Card.Foot>
                </Modal.Card.Foot>
            </Modal.Card>
        </div> 
            
            
         
    )
}
