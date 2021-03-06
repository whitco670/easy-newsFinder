const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
	title: {
		type: String,
		unique: true,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
}, 
{ timestamps: { createdAt: 'created_at' }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article
