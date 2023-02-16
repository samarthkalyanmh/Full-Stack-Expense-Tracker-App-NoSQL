async function login(e){
    
    try{
        e.preventDefault()

        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const userDetails = {
            email,
            password
        }
    
        const response = await axios.post('http://localhost:5/user/login', userDetails)
        // console.log(response.data[0].data)

        if(response.status === 200){
            document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${response.data}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)

        } else if(response.status === 400){
            document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${response.data}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)

        } else if(response.status === 404){
            document.body.innerHTML = document.body.innerHTML + `<h2 style="text-align:center; color:green; margin-top:30px;">${response.data}</h2>`

            setTimeout(()=>{
                document.body.removeChild(document.body.lastElementChild) 
            }, 2000)
        }

        console.log(response)

    } catch(err){
        console.log(err)    
    }
}