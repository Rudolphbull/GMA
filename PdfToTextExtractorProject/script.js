let pdfinput = document.querySelector(".selectpdf");
let pwd = document.querySelector(".pwd");
let upload = document.querySelector(".upload");
let afterupload = document.querySelector(".afterupload");
let select = document.querySelector("select");
let download = document.querySelector(".download");
let pdftext = document.querySelector(".pdftext");

upload.addEventListener("click", ()=>{
    let file = pdfinput.files[0];
    if(file!=undefined&&file.type=="application/pdf"){
        let fr = new FileReader();
        fr.readAsDataURL(file)
        fr.onload=()=>{
            let res = fr.result;
            if(pwd.value==""){
                extractText(res, false)
            } else {
                extractText(res, true)
            }
        }
    } else {
        alert("select a valid pdf file.")
    }
})

let alltxet = [];
async function extractText (url, pass) {
    try {
        let pdf;
        if(pass){
            pdf = await pdfjsLib.getDocument({url:url, password: pwd.value}).promise;
        } else {
            pdf = await pdfjsLib.getDocument(url).promise;
        }
    
        let pages = pdf.numPages;
        for(let i=1; i<pages; i++){
            let page = await pdf.getPage(i)
            let txt = await page.getTextContent();
            let text = txt.items.map((s)=>s.str).join("");
            alltxet.push(text)
        }
        alltxet.map((e,i)=>{
            select.innerHTML+= `
            <option value = "${i+1}">${i+1}</option>
            `;
        })
        afterProcess()
        
    } catch (error) {
        alert(error.message);
        
    }
  
}


function afterProcess(){
    pdftext.value = alltxet[select.value-1];
    download.href="data:text/plain;charset=utf-8,"+
    encodeURIComponent(alltxet[select.value-1])
    afterupload.style.display="flex";
    document.querySelector(".another").style.display= "unset";
}




// let pdf;
// if(pass){
//     pdf = await pdfjsLib.getDocument({url:url, password: pwd.value}).promise;
// } else {
//     pdf = await pdfjsLib.getDocument(url).promise;
// }

// let pages = pdf.numPages;
// for(let i=1; i<pages; i++){
//     let page = await pdf.getPage(i)
//     let txt = await page.getTextContent();
//     let text = txt.items.map((s)=>s.str).join("");
//     alltxet.push(text)
// }
// alltxet.map((e,i)=>{
//     select.innerHTML+= `
//     <option value = "${i+1}">${i+1}</option>
//     `;
// })