const {validatorSchema} = require("../Model/validateSchema")
const handleError=(err)=>
{
    const errors={email:'',password:'',number:''};
    if(err.message.includes('E11000 duplicate key'))
    errors.email="Email already exists";
    if(err.message.includes('"email" must be a valid email'))
    errors.email="Enter valid email";
    if(err.message.includes('password'))
    errors.password=err.message;
    if(err.message.includes('"number"'))
    errors.number=err.message;
    return errors;
}
const validator=async (email,password,number)=>{
    try
    {
        const result=await validatorSchema.validateAsync({
            email:email,
            password:password,
            number:number
        });
        return true;
    }
    catch(err)
    {
        const errors=handleError(err);
        return errors;
    }
}
module.exports ={validator};
