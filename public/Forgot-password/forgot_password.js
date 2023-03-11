async function resetPassword(e){
    e.preventDefault()
    try{
        const email = document.getElementById('email').value
        document.getElementById('email').value = ''

        const obj = {
            email
        }
    
        const response = await axios.post('http://54.167.151.207/password/forgotpassword', obj)
        
        document.body.innerHTML += `<h1 style="text-align:center; color:yellow;">Check your Email for Reset password link</h1>`
        console.log(response)

    } catch(err){
        console.log(err)
    }
    
}
