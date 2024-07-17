import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import { useForm } from 'react-hook-form';

import AuthService from "../../services/auth.service";
import {usePasswordValidation} from "./usePasswordValidation";
import checkMark from '../../images/check_mark/check-mark-button-svgrepo-com.png'

export default function Register(){
    let navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        surname: "",
        email: "",
        login:"",
        password:"",
    });
    
    const [emailMsg,setEmailMsg]=useState(false);
    const [requireMsgForName,setRequireMsgForName]=useState(false);
    const [requireMsgForSurname,setRequireMsgForSurname]=useState(false);
    const [requireMsgForLogin,setRequireMsgForLogin]=useState(false);
    const [loginAlreadyExists,setLoginAlreadyExists]=useState(false);

    const { name, surname, email,login,password } = user;

    const [
        validLength,
        hasNumber,
        upperCase,
        lowerCase
    ] = usePasswordValidation({
        passwordToCheck: user.password,
    });

    const {
        register,
        formState: { errors }
    } = useForm({ mode: 'all'});

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setEmailMsg(false)
        setRequireMsgForName(false)
        setRequireMsgForSurname(false)
        setRequireMsgForLogin(false)
        setLoginAlreadyExists(false);
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        if(user.name === ""){
            setRequireMsgForName(true)
        }
        if(user.surname===""){
            setRequireMsgForSurname(true)
        } if(user.login===""){
            setRequireMsgForLogin(true)
        }
        if(errors.email){
            console.log(errors.email)
        }
        const formData=new FormData();
        formData.append("customer",JSON.stringify(user))
        if(user.email === ""){
            setEmailMsg(true)
        }
        if((validLength && hasNumber && upperCase && lowerCase)&&(user.email!=="")&&(!errors.email)&&(user.name!=="" && user.surname!==""&& user.login!=="")){
            console.log(user)
           await AuthService.register(formData).catch((value)=>{
                console.log(value)
                console.log("error(Найімовірніше, вже подібний логін існує)")
                //тут помилка може появлятися тільки якщо такий самий логін вже існує
                setLoginAlreadyExists(true)
            }).then(async()=>{
               await AuthService.login(user.login,user.password).then(()=>{
                            navigate("/headTable");
                })
            })
        }
    };

    return (
        <div className="container" style={{textAlign:"left"}}>
            <div className="row">
                <div style={{background:"white"}} className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Register User</h2>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="Name" className="form-label">
                                Name
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your name"
                                name="name"
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        {requireMsgForName?<span style={{color:"red"}}>required field</span>:""}
                        <div className="mb-3">
                            <label htmlFor="Surname" className="form-label">
                                Surname
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your surname"
                                name="surname"
                                value={surname}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        {requireMsgForSurname?<span style={{color:"red"}}>required field</span>:""}

                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                E-mail
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your e-mail address"
                                name="email"
                                value={email}
                                {...register("email",{required:true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i})}
                                onChange={(e) => onInputChange(e)}
                            />
                            {errors.email && <span style={{color:"red"}}>invalid email</span>}<br/>
                            {emailMsg && <span style={{color:"red"}}>email cannot be null</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Login" className="form-label">
                                Login
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your login"
                                name="login"
                                value={login}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        {requireMsgForLogin?<span style={{color:"red"}}>required field</span>:""}
                        {loginAlreadyExists&&<span style={{color:"red"}}>login already exists</span>}
                        <div className="mb-3">
                            <label htmlFor="Password" className="form-label">
                                Password
                            </label>
                            <input
                                type={"password"}
                                className="form-control"
                                placeholder="Enter your password"
                                name="password"
                                value={password}
                                {...register("password",{required:true,minLength:{value:6,message:"Minimum six characters"}})}
                                onChange={(e) => onInputChange(e)}
                            />
                            {/*{errors.password && <span style={{color:"red"}}>{errors.password.message}</span>}*/}

                            <div>

                                  <div>
                                      {validLength?
                                      <div>
                                          <img src={checkMark} width={"20px"} height={"20px"} alt={"check_mark_for_password_length"}/><span style={{color:"#77b255"}}>Valid Length 6</span>
                                      </div>:(<span style={{color:"lightgray"}}>Valid length 6</span>)}
                                  </div>

                               <div>
                                   {hasNumber?
                                   <div>
                                       <img src={checkMark} width={"20px"} height={"20px"} alt={"check_mark_for_number_in_password"}/><span style={{color:"#77b255"}}>Has a number</span>
                                   </div>:(<span style={{color:"lightgray"}}>Has a number</span>)}
                               </div>
                               <div>
                                   {upperCase?
                                    <div>
                                        <img src={checkMark} width={"20px"} height={"20px"} alt={"check_mark_for_upper_character"}/><span style={{color:"#77b255"}}>Upper character</span>
                                    </div>:(<span style={{color:"lightgray"}}>Upper character</span>)}
                               </div>
                               <div>
                                   {lowerCase?
                                       <div>
                                           <img src={checkMark} width={"20px"} height={"20px"} alt={"check_mark_for_lower_character"}/><span style={{color:"#77b255"}}>Lower character</span>
                                       </div>:(<span style={{color:"lightgray"}}>Lower character</span>)}
                               </div>
                            </div>
                        </div>
                        <button  type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}