const STATE = {
    score:{
        playerScore:0,
        computerScore:0,
        socreBox: document.getElementById('score_points'),
    },
    cardSprites:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fielCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides:{
        player1: "player-cards",
        player1BOX: document.querySelector('#player-cards'),
        computer: "computer-cards",
        computerBOX: document.querySelector('#computer-cards'),
    },
    actions:{
        button: document.getElementById('next-duel')  
    },
}

//OCRRIGIR PLACE CARTAS

const pathImages = "./src/assets/icons/"
const cardData = [
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"Papper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name:"Dark Magician",
        type:"Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name:"Exodia",
        type:"Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random()* cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard)
    cardImage.classList.add("card");

    if(fieldSide === STATE.playerSides.player1){
        
        cardImage.addEventListener('mouseover', ()=>{
            drawSelectedCard(IdCard);
        })
        
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }


    return cardImage;
}

async function drawSelectedCard(index){
    STATE.cardSprites.avatar.src = cardData[index].img;
    STATE.cardSprites.name.innerText = cardData[index].name;
    STATE.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function setCardsField(cardId){     
    await removeAllCardsImages()

    let computerCardId = await getRandomCardId();
    
    ShowHiddenCardFieldsImages(true)

    await hiddenCardDetails();
    
    await drawCardsInField(cardId, computerCardId)

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function updateScore(){
    STATE.score.socreBox.innerText = `Win: ${STATE.score.playerScore} | Lose: ${STATE.score.computerScore}`
}

async function drawCardsInField(cardId, computerCardId){
    STATE.fielCards.player.src = cardData[cardId].img;
    STATE.fielCards.computer.src = cardData[computerCardId].img;
}

async function ShowHiddenCardFieldsImages(value) {
    if(value == true){
        STATE.fielCards.player.style.dispaly = 'block';
        STATE.fielCards.computer.style.dispaly = 'block';
    }
    if(value == false){
        STATE.fielCards.player.style.display = 'none';
        STATE.fielCards.computer.style.display = 'none';
    }
}

async function hiddenCardDetails(){
    STATE.cardSprites.avatar.src = "";
    STATE.cardSprites.name.innerText = "";
    STATE.cardSprites.type.innerText = "";
}

async function drawButton(text){
    STATE.actions.button.innerText = text.toUpperCase();
    STATE.actions.button.style.display = 'block';
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";

    let playerCard = cardData[playerCardId]

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        STATE.score.playerScore++;        
    }
    
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        STATE.score.computerScore++;
    }
    await playAudio(duelResults)

    return duelResults;

}

async function removeAllCardsImages(){
    let { computerBOX, player1BOX } = STATE.playerSides;
    let imgElements = computerBOX.querySelectorAll('img');
    imgElements.forEach((img)=>{
        img.remove();
    })

    imgElements = player1BOX.querySelectorAll('img');
    imgElements.forEach((img)=>{
        img.remove();
    })



}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i< cardNumbers; i++){
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard,fieldSide)
        
        
        document.getElementById(fieldSide).appendChild(cardImage)

    }
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play();

    try{
        audio.play();
    }catch{

    }
}



async function resetDuel(){
    STATE.cardSprites.avatar.src = '';
    STATE.actions.button.style.display = 'none';

    STATE.fielCards.player.style.display = 'none';
    STATE.fielCards.computer.style.display = 'none';

    init();
}

function init(){

    ShowHiddenCardFieldsImages(false)

    drawCards(5,STATE.playerSides.player1)
    drawCards(5,STATE.playerSides.computer)

    const bgm = document.getElementById("bgm")
    bgm.play()
}

init()