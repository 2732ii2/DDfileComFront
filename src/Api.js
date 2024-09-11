import axios from "axios";
// const Url='http://localhost:3971/';
const Url='https://datadrivenimagecompression.onrender.com/';

const sendData=async(data)=>{
    try{
     const receive=await axios.post(`${Url}sendfile`,data);
     console.log(receive?.data);
     if(receive?.data?.mess){
        return {mess:'Submission Successful:',id:receive?.data?.id};
     }
     return {
        err:receive?.data?.err
     }
    }
    catch(e){
        return {err:e?.message}
    }
}
const getbyid=async(data)=>{
    try{
     const receive=await axios.post(`${Url}getbyid`,{data:data});
     console.log(receive?.data);
     if(receive?.data?.msg){
        return {mess:'Submission Successful:',data:receive?.data,id:receive?.data?.id};
     }
     return {
        err:receive?.data?.err
     }
    }
    catch(e){
        return {err:e?.message}
    }
}
// getbyid
export {sendData,getbyid};