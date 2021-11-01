import MyModal from "../../components/Modal"
import axios from "axios"
import Image from 'next/image'

export default function Page({title,cont}){
  return(
      <MyModal title={title}>
        {
          cont.map(resp=>{
          if(resp.type=="paragraph"){
            return(resp[resp.type].text[0]?.href ? <a key={resp.id} href={resp[resp.type].text[0]?.href}>{resp[resp.type].text[0]?.plain_text}</a>:<p key={resp.id}>{resp[resp.type].text[0]?.plain_text}</p>)
          }else if (resp.type=="bulleted_list_item"){
            return(<ul key={resp.id}><li>{resp[resp.type].text[0]?.plain_text}</li></ul>)
          }else if (resp.type=="image"){
            return(<Image alt={'img '+resp.id} key={resp.id} src={resp[resp.type].external.url}/>)
          }else if(resp.type=="bookmark"){
            return (<iframe key={resp.id} src={`${resp.bookmark.url}`} width='100%' height='100%'></iframe>)
          }
      })}
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
        page:resp.id,
        section:resp.properties.Name.title[0].text.content,
      }
    }
  })

  

  

  return{
    paths,
    fallback:false
  }
}

export async function getStaticProps(context){

  const block_id = context.params.page;

  const paramsGet = {
      headers:{
          "Authorization": process.env.NOTION_KEY,
          "Notion-Version": "2021-08-16"
      },
      method:'get'
  }

  const respGet = await axios('https://api.notion.com/v1/blocks/'+block_id+'/children',paramsGet)
  const dataGet = await respGet.data.results

  const resp = await axios('https://api.notion.com/v1/databases/ee7c4808765e4e438e09979102edb518/',paramsGet)
  const data = await resp.data

  const paramsPost = {
    headers:{
        "Authorization": process.env.NOTION_KEY,
        "Notion-Version": "2021-08-16"
    },
    method:'post'
  }
  const respPost = await axios('https://api.notion.com/v1/databases/ee7c4808765e4e438e09979102edb518/query',paramsPost)
  const dataPost = await respPost.data.results

  return {
      props:{
          cont:dataGet,
          title:context.params.section,
          base:data,
          list:dataPost,
          
      }
  }
}