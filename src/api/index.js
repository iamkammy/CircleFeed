import axios from '../helpers/axios';

export const signup = async (data)=> {
   try {
    let res = await axios.post('/signup', JSON.stringify(data));
    return res; 
   } catch (error) {
       
    //    console.log("from api error --->  ",error);
       return error
   }

}


// fetch('/signup',{
//     method : 'post',
//     headers : {
//         'Content-Type' : 'application/json',
//     },
//     body : JSON.stringify(data)
// })
// .then(res => res.json())
// .then(data => {
//     console.log(data)
//     return data
// })
// .catch((err)=> {
//     console.log("from error ---> " +err)
// })