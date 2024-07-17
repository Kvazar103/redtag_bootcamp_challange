import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import AuthService from "../../services/auth.service";
import {useNavigate} from "react-router-dom";

function Header() {

  const customer=AuthService.getCurrentUser();

  let navigate = useNavigate();

  const logOut=()=>{
    AuthService.logout();
    navigate("/");
};
  
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        {customer?(<Navbar.Brand style={{cursor:"pointer"}} onClick={()=>navigate("/headTable")}>Library manager app</Navbar.Brand>):(<Navbar.Brand style={{cursor:"pointer"}} onClick={()=>navigate("/")}>Library manager app</Navbar.Brand>)}
        <Navbar.Toggle />
        {customer?(
          <Nav className="me-auto">
          <Nav.Link onClick={()=>navigate("/addBook")}>AddBook</Nav.Link>
          </Nav>
        ):(<Navbar.Collapse></Navbar.Collapse>)}
        <div style={{display:"flex"}}>
        {customer&&(<Navbar.Collapse  className="justify-content-end">
                            <Navbar.Text id={"signed"} >
                                &nbsp;&nbsp;Signed in as: <span style={{cursor:"pointer",color:"black"}} >{customer.name}</span>
                            </Navbar.Text>
                        </Navbar.Collapse>)}
                        {customer?(<Nav.Link to={'/login'}  onClick={logOut}><span >&nbsp;&nbsp;LogOut</span></Nav.Link>):
                            (<Nav.Link  onClick={()=>navigate(`/`)}>Login</Nav.Link>)
                        }
                        {
                            customer?(<Nav.Link onClick={()=>navigate(`/login`)}></Nav.Link>):(<Nav.Link onClick={()=>navigate(`/register`)}>&nbsp;&nbsp;Register</Nav.Link>)
                        }
                        </div>
        
      </Container>
    </Navbar>
  );
}

export default Header;