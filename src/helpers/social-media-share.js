const currentDomain = process.env.VUE_APP_URL;

export const shareControl = (data) => {
    
    const {shareType, url, title, description, image} = data;
    const query="title=" + title + "&description=" + description + "&image=" + image + "&url=" + url;
    const apiUrl = "public/social-media?" + query;
    const path = currentDomain + "/" + apiUrl;

    switch(shareType){
        case "email": {
            // window.location = 'mailto:?subject="Title - '+ slideName +'"&body=View Slide at - '+ currentDomain +'/survey.php?id='+ slideId;
            break; 
        };
        case "facebook": {
            const url = 'https://work.facebook.com/sharer.php?display=popup&u=' + path;
            const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
            window.open(url,'sharer', options);
            // window.open("https://www.facebook.com/sharer/sharer.php?u=" + path + "_blank");
            break; 
        };
        case "twitter": {
            // window.open('https://twitter.com/home?status='+ currentDomain +'/survey.php?title='+ title +'&id='+ slideId, '_blank');
            break; 
        };
        case "linkedin": {
            // window.open('https://www.linkedin.com/shareArticle?mini=true&url='+ currentDomain +'/survey.php?title='+ title +'&id='+ slideId, '_blank');
            break; 
        }
    }
   
}

function shareOnSweepstake(shareType, url, id){
    // if (shareType == 'email') { //email share
    //     window.location = 'mailto:?subject="Title - '+ slideName +'"&body=View Slide at - '+ currentDomain +'/survey.php?id='+ slideId;
    //  } else if (shareType == 'facebook'){ //facebook share
    //      window.open('https://www.facebook.com/sharer/sharer.php?u='+ currentDomain +'/survey.php?title='+ title +'&id='+ slideId, '_blank');
    //  } else if (shareType == 'twitter'){ //twitter share
    //      window.open('https://twitter.com/home?status='+ currentDomain +'/survey.php?title='+ title +'&id='+ slideId, '_blank');
    //  } else { //linkedin share
    //      window.open('https://www.linkedin.com/shareArticle?mini=true&url='+ currentDomain +'/survey.php?title='+ title +'&id='+ slideId, '_blank');
    //  }
}