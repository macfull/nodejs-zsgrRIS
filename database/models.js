module.exports = {
    user:{
        name:{type:String,required:true},
        password:{type:String,required:true}
    },
    appointment:{
        patient_info_id:{type:String},
        patient_id:{type:String},
        patient_name:{type:String}
    }
};