const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event) => {
  const { question } = JSON.parse(event.body);
  const dbUrl = 'https://raw.githubusercontent.com/Opensense21/PHTH-Chatbot-11june/refs/heads/main/database.json'; // Replace with your raw database.json URL
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const dbResponse = await fetch(dbUrl);
    const database = await dbResponse.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an AI assistant that answers questions based solely on the provided database. Do not use external knowledge. If the information is not in the database, say so. The database is: ${JSON.stringify(database)}. The user's question is: "${question}". Answer in the same language as the question.`;
    const result = await model.generateContent(prompt);
    const answer = await result.response.text();
    return { statusCode: 200, body: JSON.stringify({ answer }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ answer: 'Error processing request.' }) };
  }
};
