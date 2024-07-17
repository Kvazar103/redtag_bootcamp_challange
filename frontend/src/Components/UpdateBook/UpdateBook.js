import {Link, useNavigate,useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";

import AuthService from "../../services/auth.service";
import {useForm} from "react-hook-form";


export default function UpdateBook(){

    const navigate=useNavigate();

    const { state } = useLocation();
    
    const [book,setBook] =useState({
        title:`${state.book.title}`,
        pages:`${state.book.pages}`,
        language:`${state.book.language}`,
        genre:`${state.book.genre}`,
        details:`${state.book.details}`
    })


    const [requiredFieldForPages,setRequiredFieldForPages]=useState("");

    const onPagesChange=(e)=>{
        setBook({ ...book, pages: e.target.value });
        setRequiredFieldForPages("")
    }

    const onInputChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const {
        register,
        formState: { errors }
    } = useForm({ mode: 'all'});



    const onSubmit =async(e)=>{
        e.preventDefault();


        if(book.pages===""){
            setRequiredFieldForPages("Pages cannot be null")
        }else if(book.pages<=0){
            setRequiredFieldForPages("Please select a value that is no less than 1")
        }
        if(book.pages!=="" && book.pages>=0) {
            const formData = new FormData();

            formData.append("book", JSON.stringify(book))
    
            AuthService.updateBook((state.book.id),formData)
            .then(()=>{
                navigate("/headTable")
            })
        }
    }

    return(<div className="container"><br/><br/><br/>
        <div className="row" >
            <div style={{background:"white",textAlign:"left"}} className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <form style={{display:"grid"}} className="row g-3" onSubmit={(e)=>onSubmit(e)}>
                                      <div className="col-12">
                        <label htmlFor="inputAddress" className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" value={book.title} onChange={(e) => onInputChange(e)} id="inputAddress" placeholder="title"/>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputZip" className="form-label">Language</label>
                        <select id="inputState2" name="language" value={book.language} onChange={(e) => onInputChange(e)} >
                            <option defaultValue={""}>Choose Language</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>
  
                    <div className="col-md-4">
                        <label htmlFor="inputEmail4" className="form-label">Pages</label>
                        <input type="number" className="form-control" name="pages" value={book.pages}
                               {...register("pages",{required:true,valueAsNumber:true})}
                               onChange={(e) => onPagesChange(e)} id="inputEmail4"
                        />
                        {requiredFieldForPages&&(<span style={{color:"red"}}>{requiredFieldForPages}</span>)}<br/>
                        {errors.pages&&<span style={{color:'red'}}>Only numbers!</span>}
                    </div>
                    <div style={{display:"grid"}} className="col-md-4">
                        <label htmlFor="inputZip" className="form-label">Genre</label>
                        <select id="inputState2" name="genre" value={book.genre} onChange={(e) => onInputChange(e)} >
                            <option defaultValue={""}>Choose...</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Horror">Horror</option>
                            <option value="Romance">Romance</option>
                            <option value="Humor">Humor</option>
                            <option value="Satire">Satire</option>
                            <option value="Science">Science</option>
                            <option value="Thriller">Thriller</option>

                        </select>
                    </div>
                    <div style={{display:"grid"}} className="col-12">
                        <label htmlFor="inputDetails" className="form-label">Details</label>
                        <textarea style={{width:500,height:200,whiteSpace:"pre-line"}} name="details" value={book.details} onChange={onInputChange} rows="5" cols="30" placeholder="write something about your book">
                        </textarea>
                    </div>
                    <div className="col-12">   <br/>
                        <button type="submit" className="btn btn-primary">Update object</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/headTable`}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
);



}