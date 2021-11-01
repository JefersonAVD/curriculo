import axios from "axios"
  
export default function Home({list,base}) {
  console.log(list)
    return (
        <>  
        </>
    )
}

export async function getStaticProps(){
    const paramsPost = {
        headers:{
            "Authorization": process.env.NOTION_KEY,
            "Notion-Version": "2021-08-16"
        },
        method:'post'
    }
    const paramsGet = {
        headers:{
            "Authorization": process.env.NOTION_KEY,
            "Notion-Version": "2021-08-16"
        },
        method:'get'
    }
    
     
    const respPost = await axios('https://api.notion.com/v1/databases/ee7c4808765e4e438e09979102edb518/query',paramsPost)
    const dataPost = await respPost.data.results

    const respGet = await axios('https://api.notion.com/v1/databases/ee7c4808765e4e438e09979102edb518/',paramsGet)
    const dataGet = await respGet.data

    return {
        props:{
            list:dataPost,
            base:dataGet,
        }
    }
}
