import MyModal from "../components/Modal"
import axios from "axios"
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from "react"

export default function Page({cont,title}){

  const router = useRouter();
  

  function populate(content){
    
  }
  if (router.isFallback) {
    return <MyModal title={'Loading...'}>Loading...</MyModal>
  }
  if (!cont){
    return <MyModal title={'Erro 404'}>'Não há nada aqui...'</MyModal>
  }

  return(
      <MyModal title={title}>
        {router.isFallback?<MyModal title={'Loading...'}>Loading...</MyModal> :
          cont.map((resp,index)=>{
            switch(resp.type){
              case 'paragraph':
                return <a key={resp.id} target='_blank'rel="noreferrer" href={resp[resp.type].text[0]?.href}> {resp[resp.type].text?.map(x=>{ return( x.href ? <p>{x?.plain_text}</p>:<p key={resp.id}>{x?.plain_text}</p>)})}</a>
                break;
              case "bulleted_list_item" :
                return<ul key={resp.id}><li>{resp[resp.type].text[0]?.plain_text}</li></ul>
                break;
              case "image" :
                return<Image alt={'img '+resp.id} key={resp.id} src={resp[resp.type].external.url}/>
                break;
              case "bookmark":
                return<iframe key={resp.id} src={`${resp.bookmark.url}`} width='100%' height='100%'></iframe>
                break;
              default :
              return<div></div>
                break;
            }
          })
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

  let respGet = null
  let dataGet = null
  try{
    respGet = await axios('https://api.notion.com/v1/blocks/'+id+'/children', paramsGet)
    dataGet = await respGet.data.results
  }
  catch(err) {}; 
  if (!dataGet) {
    return {
      notFound: true,
    }
  }

  function getChild(data){
    data.forEach(async (x,index)=>{
      if(x.has_children){
        const respChild = await axios('https://api.notion.com/v1/blocks/'+x.id+'/children',paramsGet)
        x.child = await respChild.data.results
        getChild(x.child)
      }
    })
  }
  getChild(dataGet)

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
