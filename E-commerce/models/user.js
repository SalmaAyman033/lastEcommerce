const mongoose = require('mongoose');
const usersSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    idd:{
        type:String,
        default: function () {
            return this._id.toString();
    }
    },
    email:{
        type:String,
        required:true,
    },
    passwordHash:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    street:{
        type:String,
        default:'',
    },
    apartment:{
        type:String,
        default:'',
    },
    zip:{
        type:String,
        default:'',
    },
    city:{
        type:String,
        default:'',
    },
    country:{
        type:String,
        default:'',
    }
});
// I created a virtual ID to get ID in that way(id) not in that way(_id) to be frontend friendly.
usersSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
//to enable the virtuals for this schema
usersSchema.set('toJSON',{
    virtuals:true,
});
Users = mongoose.model('Users',usersSchema);
module.exports = Users;