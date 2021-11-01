import 'rbx/index.css' 
import Foot from '../Footer'

export default function Layout({children}) {

    return (
        <div className='MainContent'>
            {children}
            <Foot/> 
        </div>
    )
}
