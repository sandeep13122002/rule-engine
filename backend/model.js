import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
    rule_string: { type: String, required: true },
    ast: { type: String, required: true } // Store AST as a string
});

export const Rule = mongoose.model('Rule', ruleSchema);