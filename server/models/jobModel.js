import mongoose, { Mongoose } from 'mongoose';

const jobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: true,
        trim: true
    },
    role:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        enum: ['Interested', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
        default: 'Applied'
    },
    appliedDate:{
        type: Date,
        default: Date.now
    },
    dueDate:{
        type: Date
    },
    tags: [{type: String,trim: true }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobUrl:{
        type: String
    },
    notes: { 
        type: String
    },
    salary: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('Job', jobSchema);