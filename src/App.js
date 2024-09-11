import logo from './logo.svg';
import img1 from "./screenshot.jpeg";
import './App.css';
import {toast, Toaster} from "react-hot-toast";
import { useEffect, useState } from 'react';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { getbyid, sendData } from './Api';
import {PacmanLoader} from "react-spinners";
function App() {
  const [csvdata,setCsvData]=useState([]);
  const [headers,setHeaders]=useState([]);
  const [genid,setgenid]=useState();
  const [main,setmain]=useState({
    vals:[],
    newdata:[]
  })
  const [file,setfile]=useState();
  console.log("file",file);
  const [loading,setloading]=useState(false);
  // console.log(headers,csvdata);
  async function callfunc(vals,newdata){
    
    // if(!err){
      setloading(true);
      var resp= await sendData({header:vals,rowsData:newdata})
      console.log(resp);
      if(resp?.mess){
        setgenid(resp?.id);
        toast.success(resp?.mess)
      }
      else{
        toast.error(resp?.err)
      }
      setloading(false);
    //  }
  }

  const [Err,setErr]=useState(false);
  useEffect(()=>{
    var err=false;
    var vals;
  
     try{
      if(headers.length){
        vals= headers.filter((e)=>{
         if(!(!e || e=='\r')){
           return e
         }
         // else if(e);
       })
       console.log(vals);
       if(vals.length!=3){
         err=true;
         console.log("condition of error");
       }
     }
     if(csvdata.length){
       // console.log(csvdata);
       var newdata=[];
       csvdata.forEach(e=>{
         if(e?.length){
           // console.log(e);
           const values=e.filter((e)=>{
             if(!(!e || e=='\r')){
               return e
             }
           })
           if(values.length){
             newdata.push(values);
           }
         }
       })
       console.log(newdata);
       var c=0;
       newdata.forEach(e=>{
         if(!e[2]?.includes(",")){
           c=1;
         }
       })
       if(c==1){
         err=true;
         console.log("condition of err");
   
       }
       if(!err)
       {
         setmain({
           ...main,vals:vals,newdata:newdata
         })
       }
       
      else {
       setErr(!Err);
      {file && toast.error('Invalid CSV Format');}}}
     }
     catch(e){
      console.log(e?.message);
     }
  },[headers,file])

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setfile(file);
    if (!file) return;

    if (file.type !== 'text/csv') {
      alert('Please upload a valid CSV file.');
      return;
    }
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      
      const rows = text.split('\n').map(row => row.split(';'));

      setHeaders(rows[0]);  
      setCsvData(rows.slice(1));  
    };

    reader.readAsText(file);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(genid)
      .then(() => {
        toast.success('ID copied to clipboard!');
      })
      .catch((err) => {
        toast.error('Failed to copy text: ', err);
      });
  };
  const [putid ,setputid]=useState();
  const changehandler=(e)=>{
     setputid(e.target.value);
  }
  const [respdata,setrespdata]=useState();
  console.log("respdata",respdata);
  const submithandler=async()=>{
   setloading(true);
  var resp = await getbyid(putid);
  console.log("=>",resp)
  setloading(false);
  setrespdata(resp?.data?.data);
  }
  const [show,setshow]=useState(false);
  const [showhint,setshowhint]=useState(false);
  return (
    <div className="App relative flex w-[100%] h-[100vh] bg-[rgba(80,0,0,.1)] flex-col items-center  ">

      <h1 className="text-[24px] mono mt-[80px]"> <strong>Efficient Image Compression System</strong> : <span className="opacity-[.8]">Extract and Compress Images from CSV Data</span></h1>

      <div className="absolute w-[200px] h-[200px] bg-[red] opacity-[.2] left-[10%] top-[30px] rounded-[20px]"></div>

      <div className="bg-[rgba(0,0,0,.1)] relative flex flex-col items-center pt-[50px]  w-[30%] h-[500px] mt-[40px]">
    {show ?<>

<div className="flex gap-3 ">
Unique Id : 
<input onChange={changehandler} className="bg-[transparent] border-[1px] border-black px-3 text-black outline-none" placeholder={"Write your unique Id "} value={putid}  />
</div>
       <button onClick={submithandler} className="bg-[rgba(0,0,0,.6)] rounded-[4px] text-white    mt-[50px] px-3">Submit</button>
    <button className="absolute bottom-3 left-[20px] cursor-pointer" onClick={()=>setshow(!show)}>Back</button>
    {loading && <PacmanLoader className="mt-[50px] mb-[30px]" />}
 {respdata && <JSONToCSV data={respdata}/>}
  
  
    </>: <> <p onMouseLeave={()=>  setshowhint(!showhint) } onMouseEnter={()=>  setshowhint(!showhint) } className="absolute bg-[white] cursor-pointer right-[20px] pb-1 text-black w-[20px] h-[20px] top-[10px] rounded-[50%]">i</p>

         {showhint && <div className="w-[150px] h-[150px] -right-[50px] flex flex-col bg-black absolute">
            <h2 className="text-white spec text-[20px]">file should be in this format *</h2>
           <div className="flex gap-2  text-white text-[14px]">Serial No | Product Name | Input Image Urls</div>
          </div>}
          <div className={`w-[200px] relative flex-col flex justify-center items-center h-[40px] ${file?"":"bg-black"}`}>
       {file? <div className="border-[1px] relative border-black w-[100%] h-[100%] flex items-center justify-center">{file.name}


        <p onClick={()=>{
          setfile("")
          setErr(false);
          setHeaders([]);  
          setCsvData([]);  
          }} className="absolute border-[1px] cursor-pointer font-medium border-black pb-1 -top-1 bg-white  rounded-[50%] w-[15px] h-[15px] flex items-center justify-center -right-1">x</p>
       </div>:<><h2 className="absolute text-white"> Click me to Select</h2>
        <input onChange={handleFileUpload} className="w-[100%] h-[auto] opacity-[.0]" type="file" id="csvFile" name="csvFile" accept=".csv" required/></> }
          </div>
          <button onClick={()=>{
            // alert(Err);
             if(Err || !file){
              toast.error('Select another file');
            }
            else{
          callfunc(main?.vals,main?.newdata)}
          }} className="px-2 bg-[transparent] border-[1px] border-black mt-[40px] "> Submit</button>

          {loading && <PacmanLoader className="mt-[50px] mb-[30px]" />}
          {genid?<h2 onClick={copyToClipboard} className=" relative mt-auto mb-[150px] bg-[rgba(255,255,255,.5)] px-7 py-4 pb-5 flex items-center justify-center  " >Generated Id : {genid}

          <CopyAllIcon className="absolute right-[2px] top-[1px] "/>

          </h2>:null}
          <buttonn onClick={()=>setshow(!show)} className="absolute bottom-3 right-[20px] cursor-pointer" >Next</buttonn>
          
          </>}
           
      </div>
    
       
      
      
       <Toaster
  position="top-right"
  reverseOrder={false}
/>
    </div>
  );
}





const JSONToCSV = ({data}) => {
  console.log("=",data)
  const {rowsData,outputData,header}=data;
  header.push('outputData')
  var mainrow=[]
  mainrow=rowsData.map((e,index)=>{
    if(!e.includes(outputData[index]))
    e.push(outputData[index]);
    return e;
  })
//  mainrow=mainrow.map(e=>e.join(','))
 console.log("rows",mainrow);

  const jsonData = [
    { name: 'John Doe', age: 30, city: 'New York' },
    { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
    { name: 'Sam Johnson', age: 22, city: 'Chicago' }
  ];
  const convertToCSV = (jsonData) => {
    const headers = header;
    const rows =rowsData
    console.log(rows);
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(jsonData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv'; 
    a.click(); 

    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button className="mt-[50px] !text-[blue] border-b-[1px] border-[blue] " onClick={downloadCSV}>Download CSV</button>
    </div>
  );
};


export default App;
