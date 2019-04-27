import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const ScoreLogSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: { 
        type: Date, 
        required:true
    },
    score: {
        type: Number,
        required: false
    },
    answers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Question',
        required: false
    }
});

ScoreLogSchema.pre('save',{document:true} ,function(next) {
    var scoreLog = this;
    if (scoreLog.answers != []){
        var currentDate = scoreLog.created;
        currentDate.setDate(currentDate.getDate()-5);
        ScoreLog.find({created:{$gt:currentDate},owner:scoreLog.owner})
            .sort({created:"ascending"})
            .exec(function(err,scoreLogs){
                if (err){
                    return err;
                }
                else {
                    var scoreMultiplier = 1;
                    if (scoreLogs.length == 5){
                        scoreMultiplier == 5
                    }
                    else {
                        var laterDate = scoreLogs[scoreLogs.length - 1].created
                        for (var i =scoreLogs.length-2;i >= 0;i--){
                            var earlierDate = scoreLogs[i].created;
                            var timeDifference = Math.abs(laterDate.getTime() - earlierDate.getTime());
                            if (timeDifference > 86400000){
                                break;
                            }
                            else {
                                scoreMultiplier += 1;
                                laterDate = scoreLogs[i].created;
                            }
                        }
                    }
                    scoreLog.score = scoreMultiplier*scoreLog.answers.length
                    next();
                }
            })
        }
      });

const ScoreLog = mongoose.model('ScoreLog', ScoreLogSchema);

export default {
    ScoreLog: ScoreLog,
};