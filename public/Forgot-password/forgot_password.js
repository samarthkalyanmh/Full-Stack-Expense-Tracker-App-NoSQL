async function resetPassword(e){
    e.preventDefault()
    try{
        const email = document.getElementById('email').value
        document.getElementById('email').value = ''

        const obj = {
            email
        }
    
        const response = await axios.post('http://34.194.245.165/password/forgotpassword', obj)
        
        document.body.innerHTML += `<h1 style="text-align:center; color:yellow;">Check your Email for Reset password link and close this tab</h1>`

    } catch(err){
        console.log(err)
    }
    
}
