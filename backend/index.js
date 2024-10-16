// index.js
import express from 'express';
import bodyParser from 'body-parser';
import { createRule, combineRules, evaluateRule } from './ruleEngine.js';
import { connectToDatabase } from './db.js';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
app.use(bodyParser.json());

connectToDatabase().catch(console.error);

// Create a rule
app.get('/',async(req,res)=>{
    console.log("hello")
})
app.post('/create_rule', async (req, res) => {
    try {
        const { rule_string } = req.body;
        const result = await createRule(rule_string);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Combine rules
app.post('/combine_rules', async (req, res) => {
    try {
        const { rule_ids } = req.body;
        const combinedAst = await combineRules(rule_ids);
        res.json({ combinedAst });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Evaluate a rule
app.post('/evaluate_rule', (req, res) => {
    const { ast, data } = req.body;
    const result = evaluateRule(ast, data);
    res.json({ result });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
