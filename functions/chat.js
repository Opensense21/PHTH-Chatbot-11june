const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event) => {
  try {
    const { question } = JSON.parse(event.body);
    if (!question) throw new Error('No question provided');
    
    const dbUrl = 'https://raw.githubusercontent.com/Opensense21/PHTH-Chatbot-11june/refs/heads/main/database.json'; // Replace with actual URL
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('Google API key missing');

    const dbResponse = await fetch(dbUrl);
    if (!dbResponse.ok) throw new Error(`Failed to fetch database: ${dbResponse.status}`);
    const database = await dbResponse.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an AI assistant that answers questions based solely on the provided database. Do not use external knowledge. If the information is not in the database, say so. The database is: ${JSON.stringify(database)}. The user's question is: "${question}". Answer in the same language as the question.`;
    const result = await model.generateContent(prompt);
    const answer = await result.response.text();

    return { statusCode: 200, body: JSON.stringify({ answer }) };
  } catch (error) {
    console.error('Function error:', error.message); // Log to Netlify
    return { statusCode: 500, body: JSON.stringify({ answer: `Error: ${error.message}` }) };
  }
};
