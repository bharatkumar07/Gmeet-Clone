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

//for day
setInterval(() => {
    let fulldate = new Date(),
        day = fulldate.getDay(),
        month = fulldate.getMonth(), date = fulldate.getDate();

    let dayarr = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    let montharr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    let d = dayarr[day]+','+montharr[month]+' '+date;
    document.querySelector('.day').innerHTML = d;
}, 1000);

//function to join meeting
function meeting(){
    location.href="Meeting/meeting.html";
}
