import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.schema({
  username: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

//hash password helper method
userSchema.pre('save', async function (next)){
    if(!this.isModified('password')){return next();}

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(error){
        next(error);
    }
}
userSchema.methods.comparePassword = async function(canidatePassword){
    return await bcrypt.compare(canidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;