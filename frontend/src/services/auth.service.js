import axios from "axios";

const API_URL="http://localhost:8080/"

const login=async (login,password)=>{
    return await axios.post(API_URL+"login",{
        login,
        password
    })
        .then((response)=>{
            if(response.headers.authorization){
                console.log(response)
                console.log(response.headers.authorization)
                console.log(response.data)
                localStorage.setItem("customer",JSON.stringify(response.data))
                localStorage.setItem("token",JSON.stringify(response.headers.authorization))
            }
            return response;
        });
};

const register=async (formData)=>{
    return await axios.post(API_URL+"register",formData)
}
const getCustomer=async (customerId)=>{
    return await axios.get(API_URL+"customer/"+customerId)
}
const getCurrentUser=()=>{
    return JSON.parse(localStorage.getItem("customer"));
}
const logout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("token");
  }

const getAllAuthors= async (config)=>{
    return await axios.get(API_URL+"getAllAuthors",config)
}
const getAllBooks=async(config)=>{
    return await axios.get(API_URL+"getAllBooks",config)
}

const addBook=async(customerID,formData,config)=>{
    return await axios.post(API_URL+customerID+"/addBook",formData,config);
}

const getAuthorById=async (authorId,config)=>{
    return await axios.get(API_URL+"author/"+authorId,config)
}

const deleteBook=async (customerId,bookId,authorId)=>{
    return await axios.delete(API_URL+"customer/"+customerId+"/book/"+bookId+"/author/"+authorId)
}

const updateBook= async (bookId,formData)=>{
    return await axios.patch(API_URL+bookId+"/updateBook",formData,bookId)
}

const getBook=async (bookId)=>{
    return await axios.get(API_URL+bookId+"/getBook")
}
const deleteAuthor=async (authorId,customerId)=>{
    return await axios.delete(API_URL+"deleteAuthor/"+authorId+"/"+customerId)
}

const AuthService={
    login,
    register,
    getCustomer,
    logout,
    addBook,
    getAllAuthors,
    getAllBooks,
    getAuthorById,
    deleteBook,
    getCurrentUser,
    updateBook,
    getBook,
    deleteAuthor
}
export default AuthService;