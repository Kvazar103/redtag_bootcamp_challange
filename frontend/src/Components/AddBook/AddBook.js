import {useForm} from "react-hook-form";
import AuthService from "../../services/auth.service";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function AddBook(){

    let navigate = useNavigate();
    let token=JSON.parse(localStorage.getItem('token'));
    let config={
        headers:{
            Authorization:`${token}`
        }
    }

    const [object,setObject]=useState({
        title:"",
        pages:"",
        language:"",
        genre:"",
        details:""
    })
    const [author,setAuthor]=useState({
        name:"",
        surname:""
    }) 

    const [requiredFieldForTitle,setRequiredFieldForTitle]=useState(false);
    const [requiredFieldForPages,setRequiredFieldForPages]=useState("");
    const [requiredFieldForLanguage,setRequiredFieldForLanguage]=useState(false);
    const [requiredFieldForGenre,setRequiredFieldForGenre]=useState(false);
    const [requiredFieldForDetails,setRequiredFieldForDetails]=useState(false);
    const [requiredFieldForAuthorName,setRequiredFieldForAuthorName]=useState(false);
    const [requiredFieldForAuthorSurname,setRequiredFieldForAuthorSurname]=useState(false);

    const [authors,setAuthors]=useState([]);
    const [selectedAuthor,setSelectedAuthor]=useState("");

    useEffect(()=>{
        AuthService.getAllAuthors(config)
        .then((value)=>{
            setAuthors(value.data)
        })
    },[])
    

    const {
        register,
        formState: { errors }
    } = useForm({ mode: 'all'});

    const handleSave =async (e) => {
        e.preventDefault();


        if(object.title === ""){
            setRequiredFieldForTitle(true)
        }
        if(object.pages===""){
            setRequiredFieldForPages("Pages cannot be null")
        }else if(object.pages<=0){
            setRequiredFieldForPages("Please select a value that is no less than 1")
        }
        if(object.language===""){
            setRequiredFieldForLanguage(true)
        }
        if(object.genre===""){
            setRequiredFieldForGenre(true)
        }
        if(object.details===""){
            setRequiredFieldForDetails(true)
        }
        if(author.name===""){
            setRequiredFieldForAuthorName(true)
        }
        if(author.surname===""){
            setRequiredFieldForAuthorSurname(true)
        }
        if(selectedAuthor===""){
            if(object.title !== "" && object.pages!=="" && object.pages>=0 && object.genre!=="" && 
                object.details!==""&& author.name!==""&& author.surname!==""){

                const customer=JSON.parse(localStorage.getItem("customer"));
                const formData = new FormData();

                formData.append("body",JSON.stringify(object));
                formData.append("author",JSON.stringify(author))

                AuthService.addBook(customer.id,formData,config).then(()=>{
                    navigate("/headTable")
            })
        }
    }else if(object.title !== "" && object.pages!=="" && object.pages>=0 && object.genre!=="" && 
        object.details!==""&&  selectedAuthor!==""){
            const customer=JSON.parse(localStorage.getItem("customer"));
            const formData = new FormData();

            formData.append("body",JSON.stringify(object));
            formData.append("author_id",selectedAuthor);

            AuthService.addBook(customer.id,formData,config).then(()=>{
                navigate("/headTable")
        })
        }

    }

    const onInputChange = (e) => {    ///обовязкове інакше поля просто будуть read only
        setObject({ ...object,[e.target.name]: e.target.value });
        setRequiredFieldForTitle(false)
        setRequiredFieldForPages(false)
        setRequiredFieldForLanguage(false)
        setRequiredFieldForGenre(false)
        setRequiredFieldForDetails(false)

    };
    const onAuthorNameChange = (e) => {
        setAuthor({...author,[e.target.name]:e.target.value})
        setRequiredFieldForAuthorName(false)

    }
    const onAuthorSurnameChange=(e)=>{
        setAuthor({...author,[e.target.name]:e.target.value})
        setRequiredFieldForAuthorSurname(false)

    }

    const onSelectAuthor=(e)=>{
        setSelectedAuthor(e.target.value);
    }

    const onClickNewAuthorButt=()=>{
        document.getElementById("choose_author").style.display="none"
        document.getElementById("add_new_author").style.display="grid"
        document.getElementById("new_author_butt").style.display="none"
        setSelectedAuthor("")
    }


    return(<div className="container" style={{textAlign:"left"}}>
            <br/><br/><br/><br/>
            <div className="row">
                <div style={{background:"white"}} className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <form className="row g-3" onSubmit={(e)=>handleSave(e)}>
                        <div className="col-md-4">
                            <label htmlFor="inputZip" className="form-label">Language</label>
                            <select id="inputState2" name="language" value={object.language} onChange={(e) => onInputChange(e)} >
                                <option defaultValue={""}>Choose Language</option>
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                            </select>
                            {requiredFieldForLanguage&&(<span style={{color:"red"}}>cannot be null</span>)}
                        </div>
                        <div className="col-md-4" style={{display:"grid"}}>
                            <label htmlFor="inputZip" className="form-label">Genre</label>
                            <select id="inputState2" name="genre" value={object.genre} onChange={(e) => onInputChange(e)} >
                                <option defaultValue={""}>Choose Genre</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Mystery">Mystery</option>
                                <option value="Horror">Horror</option>
                                <option value="Romance">Romance</option>
                                <option value="Humor">Humor</option>
                                <option value="Satire">Satire</option>
                                <option value="Thriller">Thriller</option>
                            </select>
                            {requiredFieldForGenre&&(<span style={{color:"red"}}>cannot be null</span>)}
                        </div>

                        <div className="col-12">
                            <label htmlFor="inputAddress" className="form-label">Title</label>
                            <input type="text" className="form-control" name="title" value={object.title} onChange={(e) => onInputChange(e)} id="inputAddress" placeholder="title"/>
                            {requiredFieldForTitle&&(<span style={{color:"red"}}>cannot be null</span>)}
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label">Pages</label>
                            <input type="number" className="form-control" name="pages" value={object.pages}
                                   {...register("pages",{required:true,valueAsNumber:true})}
                                   onChange={(e) => onInputChange(e)} id="inputEmail4"/>
                            {requiredFieldForPages&&(<span style={{color:"red"}}>{requiredFieldForPages}</span>)}
                            {errors.pages&&<span style={{color:'red'}}>Only numbers!</span>}
                        </div>
                        <div className="col-12" style={{display:"grid"}}>
                            <label htmlFor="inputDetails" className="form-label">Details</label>
                            <textarea style={{width:500,height:200,whiteSpace:"pre-line"}} name="details" onChange={onInputChange} rows="5" cols="30" placeholder="write something about your object">
                            </textarea>
                            {requiredFieldForDetails&&(<span style={{color:"red"}}>cannot be null</span>)}
                        </div>
                        <div className="col-md-4" style={{display:"grid"}} id="choose_author">
                        <label htmlFor="inputZip" className="form-label">Author</label>
                              <select value={authors.name} onChange={onSelectAuthor}>
                                    <option >Select an option</option>
                                {authors.map((item) => (
                                         <option key={item.id} value={item.id}>
                                        {item.name} {item.surname}
                                    </option>
                                ))}
                                </select>
                        </div>
                        <div id="new_author_butt" style={{cursor:"pointer",color:"blue"}} onClick={onClickNewAuthorButt}  >New author?</div>
                        <div className="col-12" id="add_new_author" style={{display:"none"}}><br/>
                           <div style={{textAlign:"center"}}>New Author</div>
                       
                        <div className="col-12">
                            <label htmlFor="inputAddress" className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" value={author.name} onChange={(e) => onAuthorNameChange(e)} id="inputAddress" placeholder="author name"/>
                            {requiredFieldForAuthorName&&(<span style={{color:"red"}}>cannot be null</span>)}
                        </div>
                        <div className="col-12">
                            <label htmlFor="inputAddress" className="form-label">Surname</label>
                            <input type="text" className="form-control" name="surname" value={author.surname} onChange={onAuthorSurnameChange} id="inputAddress" placeholder="author surname"/>
                            {requiredFieldForAuthorSurname&&(<span style={{color:"red"}}>cannot be null</span>)}
                        </div>
                        </div>

                        <div className="col-12">   <br/>
                            <button type="submit" className="btn btn-primary">Add new object</button>
                        </div>
                    </form>
                </div>
            </div>
    </div>

    )
}