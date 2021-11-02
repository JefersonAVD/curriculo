import {Column, Container , Icon, Image} from "rbx"
import { useContext } from "react"
import { modalToogle } from "../../pages/_app"
import Link from 'next/link'

import { faWindowRestore } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export default function Menu({list,base}) {
    const {toggle,changetoggle} = useContext(modalToogle)
    return (
        <Container>
            <Column.Group multiline centered>
                <Column size='full' textAlign='centered'>
                    <div className='level-item'>
                        <Image.Container className='level fit'>
                            <Image alt={'minha imagem de perfil'} rounded={true} src={base && base.cover.file.url}/>   
                        </Image.Container>
                    </div>
                    <div>
                        <h1>Jeferson Ataide Vasques Dias</h1>
                        <label>Programador Front-end</label>
                    </div> 
                </Column>
                {
                    list && list.map((resp,index)=>{return(
                        <Link key={index} href={'/'+resp.properties.Name.title[0].text.content} /*href={'/'+resp.id}*/ >
                            <Column as='a' size='3'  className='menuItem' onClick={()=>{changetoggle(!toggle)}}>
                                <p>{resp.properties.Name.title[0].text.content}</p>
                                <Icon as='span'>
                                    <FontAwesomeIcon size='2x' icon={faWindowRestore}/>
                                </Icon>
                            </Column>
                        </Link>
                    )})
                }
            </Column.Group>
        </Container>
    )
}



