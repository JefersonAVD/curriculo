import MyModal from "../../components/Modal"
import axios from "axios"
import Image from 'next/image'

export default function Page({title,cont}){
  console.log(cont)
  return(
      <MyModal title={title}>
        {
          cont.map((resp,index)=>{
            switch(resp.type){
              case 'paragraph':
                return(resp[resp.type].text.map(x=>{ return( x.href ? <a key={resp.id} href={x[0]?.href}><p>{x?.plain_text}</p></a>:<p key={resp.id}>{x?.plain_text}</p>)})) 
                break;
              case "bulleted_list_item" :
                return(<ul key={resp.id}><li>{resp[resp.type].text[index]?.plain_text}</li></ul>)
                break;
              case "image" :
                return(<Image alt={'img '+resp.id} key={resp.id} src={resp[resp.type].external.url}/>)
                break;
              case "bookmark":
                return(<iframe key={resp.id} src={`${resp.bookmark.url}`} width='100%' height='100%'></iframe>)
                break;
              default :
                return(<div></div>)
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

  /*if(dataGet.has_children){
    const respChild = await axios('https://api.notion.com/v1/blocks/'+dataGet.id+'/children',paramsGet)
    dataGet.last_edited_time = await respChild.data

  }




  /*   Get para o menu  */
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
  /*   Get para o menu  */
  return {
      props:{
          cont:dataGet,
          title:context.params.section,
          base:data,
          list:dataPost,
          
      }
  }
}