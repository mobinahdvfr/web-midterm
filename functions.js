/**clear the local storage in every first run */
localStorage.clear();

/**A function for when we click on submit */
async function on_click(){                                                       
    clear_left();
    var username = document.getElementById('insert').value                       //getting username
    let data = ""                                                                //storing the user data

    if (navigator.onLine){

        /**If the username is not in the local storage */
        if (localStorage.getItem(username)==null){                                   
            var api_address = "https://api.github.com/users/" + username        //making the api address to get the data from it
            let response = await fetch(api_address)                             //the response to our request
            
            /**If user doesn't exist */
            if (response.status == 404) {                                        
                var img = document.createElement('img')
                img.src = "notfound.jpg"
                document.getElementById('pic').appendChild(img)
                document.getElementById('info').innerHTML = "User not found!"
                return
            }

            /**If there's another problem */
            if (response.status !=200 && response.status!=404){                     
                var img = document.createElement('img')
                img.src = "error.png"
                document.getElementById('pic').appendChild(img)
                document.getElementById('info').innerHTML = "Could not fetch result!"
            }

            /**Reading the data from the response when there is no problem */
            let jsonData = await response.json();
            data = JSON.stringify(jsonData)
            localStorage.setItem(username, data)                                 //adding username and data to local storage
            console.log("read from origin")
        }

        /**Reading from the local storage */
        else{
            data = localStorage.getItem(username)
            console.log("read from local storage")
        }


        /**Extract data from json data, and set the variables */
        data = JSON.parse(data)
        var image_url = data.avatar_url
        var name = data.name
        var blog = data.blog
        var address = data.location
        var bio = data.bio

        
        const user_repo = await fetch(`https://api.github.com/users/${username}/repos?per_page=5&sort=pushed`)
        const user_repos = await user_repo?.json()
        const freq_lang = [];                                    //store languages
        for (let i = 0; i < user_repos.length; i++) {            //loop through repositories
            const obj = user_repos[i];                                         
            const langs = await fetch(obj.languages_url)         // get languages of repo
            const lang = await langs.json()                      // convert response to json
            freq_lang.push(lang);                                // add languages to array
        }
    
        let max = -1;
        let max_lang = '';
    
        /**get most used language*/
        for (let j = 0; j < freq_lang.length; j++) {
            const obj = freq_lang[j];                              // get languages
            for (const key in obj) {                               // loop through languages
                if (obj.hasOwnProperty(key)) {                     // check if language is in object
                const value = obj[key];                            // get value of language
                if (value > max) {                                
                    max = value;                          
                    max_lang = key;                             
                }
                }
            }
        }
        const most_used_lang = max_lang;                           // set most used language

        /**handle if the datas are empty */
        if (name == null || name == ""){
            name = "Name : -"
        }
        if (blog == null || blog == ""){
            blog = "Blog : -"
        }
        if (address == null || address == ""){
            address = "Location : -"
        }
        if (bio == null || bio == ""){
            bio = "Bio : - "
        }
        
        /**adding the data to our document */
        table = document.getElementsByClassName('user-info');
        var img = document.createElement('img')
        img.src = image_url
        document.getElementById('pic').appendChild(img)
        document.getElementById('info').innerHTML = name + '<br/>' + blog + '<br/>' + address;
        document.getElementById('bio').innerHTML = bio + '<br/>' + '<br/>' + most_used_lang;
    }

    /**There is no internet connection */
    else{                                                                               
        var img = document.createElement('img')
        img.src = "error.jpg"
        document.getElementById('pic').appendChild(img)
        document.getElementById('info').innerHTML = "No internet connection!"
    }
}
/**It clears the content of the left div */
function clear_left(){
    document.getElementById('pic').innerHTML = ""
    document.getElementById('info').innerHTML = ""
    document.getElementById('bio').innerHTML = ""
}




function get_lang(){                       

}
