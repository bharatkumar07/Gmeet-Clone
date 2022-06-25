
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = false;

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
})

const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })
    videoGrid.append(video);
}

//to mute the audio
const muteAudio = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled; 
//getAudioTracks()[0] to get the audio of yourself and .enabled returns true audio is on
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}
const setUnmuteButton = ()=>{
    const html=`
    <i class="fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.mute_button').classList.add('mute_audio'); //just adding a class to make background-color red in css
    document.querySelector('.mute_button').innerHTML = html;
}
const setMuteButton = ()=>{
    const html=`
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.mute_button').classList.remove('mute_audio'); //removing the class to make background-color back to normal
    document.querySelector('.mute_button').innerHTML = html;
}

//to stop the video
const stopVideo = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled; 
//getVideoTracks()[0] to get the video of yourself and .enabled returns true video is on
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayButton();
    }
    else{
        myVideoStream.getVideoTracks()[0].enabled = true;
        setStopButton();
    }
}
const setPlayButton = ()=>{
    const html=`
    <i class="fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.video_button').classList.add('stop_video'); //just adding a class to make background-color red in css
    document.querySelector('.video_button').innerHTML = html;
}
const setStopButton = ()=>{
    const html=`
    <i class="fas fa-video"></i>
    <span>Start Video</span>
    `
    document.querySelector('.video_button').classList.remove('stop_video'); //removing the class to make background-color back to normal
    document.querySelector('.video_button').innerHTML = html;
}



//for time
setInterval(()=>{
    let Time = new Date();
    let format = 'AM',
        hour=Time.getHours(), minute = Time.getMinutes();

    //fixing
    if(hour==0){ hour=12;}
    if(hour>12){format = 'PM'; hour=hour-12;}
    if(hour/10<1){hour = '0'+hour;}
    if(minute/10<1){minute = '0'+minute;}

    let t=hour+':'+minute+" "+format;
    document.querySelector('.time').innerHTML = t;
}, 1000);

//for leave_call button
document.querySelector('.leave_call').addEventListener('click', ()=>{
    let leavecall = confirm("Confirm to leave the call: ");
    if(leavecall){
        window.location = "../index.html";
    }
})

//for chat_button
let chatbtn = document.querySelector('.chat_button');
chatbtn.addEventListener('click', ()=> {
    let html = `
        <div class="right-section">
            <div class="chat_system">
            <div class="chathead">
                <h5>Chat</h5>
            </div>
            <hr style="margin:0.4rem 0">
            <div class="chat_window">
                <ul class="messages">
                    
                </ul>
            </div>
            <div class="message_container">
                <input id="chat_message" type="text" placeholder="Type message here...">
            </div>
            </div>
        </div>
    `

    const main = document.querySelector('.main');
    if(main.childElementCount>1){ //if right-section(chat) is already present then remove it
        document.querySelector('.right-section').remove();
        document.querySelector('.left-section').style.width = "100%";
    }
    else{
        main.insertAdjacentHTML('beforeend',html); //beforeend is used to insert this html just before the end of main class

    //changing the width of left_section from 100% to 75%
    document.querySelector('.left-section').style.width = "75%";
    }
})

//for more options
document.querySelector('.more_options').addEventListener('click', ()=>{
    document.querySelector('.more_options_content').classList.toggle('show_content');
})
//to close the more options content if user clicks oustide of it
window.onclick = function(event){
    if(!event.target.matches('.more')){
        let content = document.getElementsByClassName('more_options_content');
        for(let i=0; i<content.length; i++){
            let x = content[i];
            if(x.classList.contains('show_content')){
                x.classList.remove('show_content');
            }
        }
    }
}
