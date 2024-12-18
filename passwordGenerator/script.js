let pdDisplay=document.querySelector("#display-password");

let copyBtn=document.querySelector("#copy-button");
let copyMsg=document.querySelector("#copy-msg");

let pdLengthDisplay=document.querySelector("#password-length");
let pdSlider=document.querySelector("#password-length-input");

let upperCaseCheck=document.querySelector("#upperCase");
let lowerCaseCheck=document.querySelector("#lowerCase");
let numbersCheck=document.querySelector("#numbers");
let symbolsCheck=document.querySelector("#symbols");
let checkboxList=document.querySelectorAll(".check input");

let strengthSign=document.querySelector("#strength-sign");
let generatePdBtn=document.querySelector("#generate-password-button");

let symbolsString="~!@#$%^&*()>?|.`[]{}";
let numbersString="0123456789";
let upperCaseString="QWERTYUIOPASDFGHJKLZXCVBNM";
let lowerCaseString="qwertyuiopasdfghjklzxcvbnm";

let pd="";
let pdLength=10;
let checkCount=0;

calcStrength();
setStrengthIndictaorColor("#ccc9ce")
handleSlider()
copyMsg.style.scale=0;

function handleSlider(){
    pdSlider.value=pdLength;
    pdLengthDisplay.innerHTML=pdLength;
    let min=pdSlider.min;
    let max=pdSlider.max;
    //pdSlider.style.backgroundSize = ( (pdLength - min)*100/(max - min)) + "% 100%"
    pdSlider.style.backgroundSize= (pdLength-min)/(max+1-min )*1000+"%" ;
}

function setStrengthIndictaorColor(color){
    strengthSign.style.backgroundColor=color;
    strengthSign.style.color=color;
}

function randomInt(min,max){
    if(max<=min)    return 0;
    return Math.floor((Math.random()*(max-min)+min));
}

function randomCharacter(st){
    return st[randomInt(0,st.length)];
}

function calcStrength(){
    if(checkCount==4){
        setStrengthIndictaorColor("#0f0");
    }
    else if(checkCount>1){
        setStrengthIndictaorColor("#ff0");
    }
    else{
        setStrengthIndictaorColor("#f00");
    }
}

async function copyPd(){
    try{
        await navigator.clipboard.writeText(pdDisplay.value);
        copyMsg.innerHTML="copied";
        console.log("copied");
    }
    catch{
        copyMsg.innerHTML="error";
        console.log("error");
    }
    console.log("displayMsg");
    copyMsg.style.scale=1;
    setTimeout(function(){
        copyMsg.style.scale=0;
    },2000);
}


pdSlider.addEventListener("input", function(e){
    pdLength=e.target.value;
    handleSlider();
    pdLengthDisplay.innerHTML=pdLength;
});

copyBtn.addEventListener('click', function(e){
    if(pdDisplay.value){
        copyPd();
    }
})

checkboxList.forEach(function(checkBox){(
    checkBox.addEventListener("input",function(e){
        checkCount=checkCount+(checkBox.checked==true) -(checkBox.checked==false);
        if(checkCount>pdLength){
            pdLength=checkCount;
            handleSlider();
        }
    }))
})

generatePdBtn.addEventListener("click",function(){
    console.log("pdGeneration");
    pd=generatePd();
    pdDisplay.value=pd;
    calcStrength();
})


function generatePd(){
    if(checkCount<=0){
        checkboxList.forEach(function(checkBox){
            checkBox.checked=true;
            checkCount+=1;
        })
    }
    let password="";
    let pdCharacters="";

    if(upperCaseCheck.checked==true){
        password+=randomCharacter(upperCaseString);
        pdCharacters+=upperCaseString;
    }
    
    if(lowerCaseCheck.checked==true){
        password+=randomCharacter(lowerCaseString);
        pdCharacters+=lowerCaseString;
    }

    if(numbersCheck.checked==true){
        password+=randomCharacter(numbersString);
        pdCharacters+=numbersString;
        pdCharacters+=numbersString;
    }

    if(symbolsCheck.checked==true){
        password+=randomCharacter(symbolsString);
        pdCharacters+=symbolsString;
    }

    while(password.length< pdLength){
        password+=randomCharacter(pdCharacters);
    }
    console.log(password)
    password= shuffleString(password);
    return password;
}

function shuffleString(str) {
    let arr = str.split('');
    
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.join('');
  }

