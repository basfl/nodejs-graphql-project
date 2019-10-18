const getButton=document.getElementById("get");
const postButton=document.getElementById("post");

getButton.addEventListener("click",()=>{
  fetch("http://localhost:8080/feed/posts").then(res=>
   res.json()).then(data=>{
    console.log(data)
  }).catch(err=>{
    console.log(err)
  })
})

postButton.addEventListener("click",()=>{
  fetch("http://localhost:8080/feed/post",{
    method:"POST",
    body:JSON.stringify({
      title:"t1",
      content:"c"
    }),
    headers:{
      "Content-Type":"application/json"
    }
  }).then(res=>
   res.json()).then(data=>{
    console.log(data)
  }).catch(err=>{
    console.log(err)
  })
})