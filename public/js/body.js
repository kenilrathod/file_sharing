var drop_box = document.querySelector(".drop-box");
var browse = document.querySelector(".browse");
var file = document.querySelector("#file");
var progress = document.querySelector(".progress");
var copy = document.querySelector(".fa-copy");
var link = document.querySelector(".link_text");
var link_to_download = document.querySelector(".link_to_download")
var noty = document.querySelector(".noty");
var uploding_per = document.querySelector(".uploading_per");
var progres_div = document.querySelector(".progres_div");
var form_div = document.querySelector(".form-div");
var p = document.querySelectorAll("p");
var toast = document.querySelector(".toast");
var email_form = document.querySelector(".email_form");
var loader = document.querySelector(".loader")
var response = "";
var baseUrl = "https://file-share-application.herokuapp.com/"

drop_box.addEventListener("dragover",(e)=>{
    e.preventDefault();
    drop_box.style.backgroundColor = "white"
    drop_box.style.borderColor = "black"
    drop_box.style.borderStyle = "outset"
    drop_box.classList.add("drag_ani")
})
drop_box.addEventListener("dragleave",(e)=>{
    e.preventDefault();
    drop_box.style.backgroundColor = "#f5fcff"
    drop_box.style.borderColor = "#234E70"
    drop_box.style.borderStyle = "dashed"
    drop_box.classList.remove("drag_ani");
})
drop_box.addEventListener("drop",(e)=>{
    e.preventDefault();
    drop_box.style.backgroundColor = "#f5fcff"
    drop_box.style.borderColor = "#234E70"
    drop_box.style.borderStyle = "dashed"    
    drop_box.classList.remove("drag_ani")
    const files = e.dataTransfer.files; 
    if(files.length){
        file.files = files;
        uploadFile()
    }
})
browse.addEventListener("click",()=>{
    file.click()    
})
file.addEventListener("change",()=>{
    uploadFile()
})
//email post method
email_form.addEventListener("submit",async(e)=>{
    e.preventDefault();
    loader.style.display = "block"
    const formData = {
        uuid:document.querySelector(".link_text").value.split("/")[4],
        from:email_form.elements["sender"].value,
        to:email_form.elements["receiver"].value
    }
    fetch(`${baseUrl}files/send/${document.querySelector(".link_text").value.split("/")[4]}`,{
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData) 
    }).then((res)=>res.json()).then((data)=>{
        if(data.success){
            loader.style.display = "none"
            showtoast(`<i class='far fa-check-circle'></i>&nbsp;<span>${data.message}</span>`,"#5cb85c");
            setTimeout(()=>
            window.location.href = "/",3000)
        }
        else{
            showtoast(`<i class='fas fa-exclamation-triangle'></i>&nbsp;<span>${data.message}</span>`,"#d9534f")
        }
        })
})


const uploadFile = () => {
    const new_file = file.files[0];
    const formData = new FormData();
    formData.append("myfile",new_file)

    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            response = xhr.response;
            console.log(rersponse)
        }
    };

    xhr.upload.onprogress = updateProgress

    //error handle 
    xhr.upload.onerror = () => {
        showtoast("<i class='fas fa-exclamation-triangle'></i>&nbsp;<span>Error! file not upload</span>","#d9534f")
        file.value = "";
    }
    xhr.open("POST",`${baseUrl}file-share`);
    xhr.send(formData)
}

const updateProgress = (e)=>{
   var per = parseInt(e.loaded*100/e.total)
   progres_div.style.display = "block";
   progress.style.width = per+"%";
   uploding_per.innerHTML = `Uploading ${per}%...`;
   if(per == 100){
    file.value = "";
    uploding_per.innerHTML = `Upload successful...`;
    showtoast("<i class='far fa-check-circle'></i>&nbsp;<span>Upload successful</span>","#5cb85c")
    setTimeout(()=>{
        progres_div.style.display = "none";
    },2000)
    setTimeout(()=>{
        link_to_download.style.display = "block";
        link.value = JSON.parse(response).file_link;
        p.forEach(element => {
            element.style.display = "block";
        });
        form_div.style.display = "block"
        
    },2000)
   }
}

copy.addEventListener("click",()=>{
    link.select()
    navigator.clipboard.writeText(link.value)
    showtoast("<i class='fas fa-check'></i>&nbsp;<span>copy to clipboard</span>","#0275d8")
    copy.classList.replace("fa-copy","fa-check-square")
    setTimeout(()=>{
        copy.classList.replace("fa-check-square","fa-copy")
    },2000)
    
})
let time = ""
const showtoast = (msg,bg) => {
    clearTimeout(time)
    toast.innerHTML = msg
    toast.style.backgroundColor = bg
    toast.style.top = "20px"
    time = setTimeout(()=>{
        toast.style.top = "-100px"
    },2300)
    
}