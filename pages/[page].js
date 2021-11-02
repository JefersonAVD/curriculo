import MyModal from "../components/Modal"
import axios from "axios"
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from "react"

export default function Page({cont,title}){
  const router = useRouter();

  function populate(resp){
    let valueContent 
      switch(resp.type){
        case 'paragraph':
          valueContent = resp[resp.type].text[0]?.href ? 
          <a key={resp.id} target='_blank'rel="noreferrer" href={resp[resp.type].text[0]?.href}> 
            {resp[resp.type].text?.map(x=>{ return( <p key={resp.id+1}>{x?.plain_text}</p>)})}
            
          </a> : 
          <div> {resp[resp.type].text?.map(x=>{ return( <p key={resp.id+1}>{x?.plain_text}</p>)})}
            <div className='child'>{resp.child?.map(x=>{return <p key={resp.id+1} >{x[x.type].text[0].plain_text}</p>})}</div></div> 
          break;
        case "bulleted_list_item" :
          valueContent = <ul key={resp.id}>{resp[resp.type].text?.map(x=>{return <li key={resp.id+1} >{x?.plain_text}</li>})}</ul>
        case "image" :
          valueContent = <Image key={resp.id}  alt={'img '+resp.id} src={resp[resp.type].external.url}/>
        default :
          valueContent = ''
      }
    return(
    <div key={resp.id} className='content'>
      {valueContent}
    </div>) 
  }


  if (router.isFallback) {
    return <MyModal title={'Loading...'}>Loading...</MyModal>
  }
  if (!cont){
    return <MyModal title={'Erro 404'}>Não há nada aqui...</MyModal>
  }

  return(
      <MyModal title={title}>
        {router.isFallback?<MyModal title={'Loading...'}>Loading...</MyModal> :
          cont.map(populate)
        }
      </MyModal>  
  )
}

export async function getStaticPaths(){
  const paramsPost = {
    headers:{
        "Authorization": process.env.NOTION_KEY,
        "Notion-Version": "2021-08-16"
    },
    method:'post'
  }
  const respPost = await axios('https://api.notion.com/v1/databases/ee7c4808765e4e438e09979102edb518/query',paramsPost)
  const dataPost = await respPost.data.results

  const paths = dataPost.map(resp=>{
    
    return {
      params:{
        page:resp.properties.Name.title[0].text.content
      }
    }
  })
  return{
    paths,
    fallback:true
  }
}

export async function getStaticProps(context){

  const block_name = context.params.page

  const paramsPost = {
    headers:{
        "Authorization": process.env.NOTION_KEY,
        "Notion-Version": "2021-08-16"
    },
    method:'post'
  }
  const respPost = await axios('https://api.notion.com/v1/databases/ee7c4808765e4e438e09979102edb518/query',paramsPost)
  const dataPost = await respPost.data.results

  let id ;

  dataPost.forEach(x=>{
    if(x.properties.Name.title[0].text.content == block_name){
      id = x.id;
    }
  })

  const paramsGet = {
      headers:{
          "Authorization": process.env.NOTION_KEY,
          "Notion-Version": "2021-08-16"
      },
      method:'get'
  }

  let respGet = await axios('https://api.notion.com/v1/blocks/'+id+'/children', paramsGet)
  let dataGet = await respGet.data.results

 

  async function getChild(data){
    data.forEach(async (x)=>{
      if(x.has_children){
        const respChild = await axios('https://api.notion.com/v1/blocks/'+x.id+'/children',paramsGet)
        x.child = await respChild.data.results
        getChild(x.child)
      }
    })
  }
  await getChild(dataGet)


  /*   Get para o menu  */
    const resp = await axios('https://api.notion.com/v1/databases/ee7c4808765e4e438e09979102edb518/',paramsGet)
    const data = await resp.data


  /*   Get para o menu  */

  
  return {
    props:{
        cont:dataGet,
        base:data,
        list:dataPost,
        title:block_name,   
    },
    revalidate:1,
  }
}
