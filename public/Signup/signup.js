async function signup(e){
    
    try{
        e.preventDefault()
    
        let name = document.getElementById('name').value
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const userDetails = {
            name,
            email,
            password
        }
    
        const response = await axios.post('http://54.167.151.207:3000/user/signup', userDetails)

        if(response.status === 201){

            document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${response.data.message}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)

            window.location.href = "../Login/login.html"
        }
        else {
            throw new Error(response.data.message)
        }

    } catch(err){
        console.log(err)      
        document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:red; margin-top:30px;">${err}</h2>`
        setTimeout(()=>{
            document.body.removeChild(document.body.lastElementChild) 
        }, 3000)
    }
}