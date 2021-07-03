import useAuth from "./useAuth";
import { Container } from 'react-bootstrap';
import '../styles/dashboard.css'

function Dashboard({ code }) {
    const access_token = useAuth(code);
    // console.log(data);
    return (
        <Container>
            <div id='top' className='py-2'>top</div>
            <div id='library' className='my-2'>library</div>
            <div id='player'>player <p>hi
                s</p></div>            
        </Container>
    )
}
export default Dashboard;
