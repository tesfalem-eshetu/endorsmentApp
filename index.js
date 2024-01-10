import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push , onValue , update , get} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const firebaseConfig = {
    
  databaseURL: "https://endorsementapp-20583-default-rtdb.firebaseio.com/"

};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database, "endorsements");

const inputDivEl = document.getElementById("inputDiv")
const publishBtnEl = document.getElementById("publish-btn")
const endorsementUlEl = document.getElementById("endorsementUl")
const fromEl = document.getElementById("from")
const toEl = document.getElementById("to")

publishBtnEl.addEventListener("click" , function(){
  let endorsementText= inputDivEl.textContent
  let fromWho = fromEl.textContent
  let toWhom = toEl.textContent
  let endorsement = {
    text : endorsementText,
    from : fromWho,
    to : toWhom ,
    likes : 0
  }
    push(dbRef,endorsement)
})

onValue(dbRef , function(snapshot){
  if (snapshot.exists()) {

    let itemsInDb = Object.entries(snapshot.val())
    clearInputFields(inputDivEl) 
    clearInputFields(endorsementUlEl) 
    clearInputFields(fromEl) 
    clearInputFields(toEl) 
    
    for (let i = itemsInDb.length-1 ; i >=0; i--){
      let currentItem = itemsInDb[i]
      appendToUl(currentItem)

    }
  }
})

function appendToUl(endorsement){
  let endorsementId = endorsement[0]
  let endorsementValue = endorsement[1]
  let text = endorsementValue.text
  let from = endorsementValue.from
  let to = endorsementValue.to
  let likes = endorsementValue.likes


  let newEl = document.createElement("li")
  newEl.innerHTML = `<div class="DivOfendorsementsLiDiv">
                          <div class="toDiv">To ${to}</div>
                            <div class="endorsementsLiDiv">
                              ${text}
                            </div>
                          <div class="fromDiv">From ${from} <div><img id="heartImg"src="./assets/heart.png"><span id="likeNum">${likes}<span></div></div>        
                      </div>`
              
  newEl.addEventListener("dblclick", function(event) {
    if (event.target.id === "heartImg") {
        let exactLocationOfItemInDB = ref(database, `endorsements/${endorsementId}`);
      
        get(exactLocationOfItemInDB).then((snapshot) => {
            const currentLikes = snapshot.val().likes || 0;
            update(exactLocationOfItemInDB, {
                likes: currentLikes + 1,
            });
        });
    }
});

  endorsementUlEl.append(newEl)
}

function clearInputFields(InputFields){
  InputFields.textContent = ""
}



