import os
import numpy as np
import pandas as pd
from .embeddings import load_embeddings
from .models.distilbert import get_embedding
from .models.utils import cosine_similarity
from app.prediction_models.diabetes_prediction import DiabetesRiskPredictor
from app.prediction_models.heart_prediction import HeartRiskPredictor
import pandas as pd
import numpy as np
from ast import literal_eval
from scipy.spatial.distance import cosine
from openai import OpenAI
from dotenv import load_dotenv

def generate_response_openai(user_id: int, user_input: str, db, diabetes_model, heart_model) -> str:
    user_input = user_input.lower().strip()
    current_dir = os.path.dirname(os.path.abspath(__file__)) 
    csv_path = os.path.join(current_dir, 'data', 'cardio_and_diabetes_qa_embeddings.csv')
    if is_greeting(user_input):
        return "👋 Hello! How can I assist you today? You can ask about heart health, diabetes risk, exercise recommendations, or healthy habits."
  
    response = rag_pipeline(user_input, os.path.join(os.path.dirname(__file__), 'data', csv_path))

    return response
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)
# Initialize the OpenAI client (uses environment variable OPENAI_API_KEY or pass api_key directly)
# client = OpenAI(
#     # This is the default and can be omitted
#     # api_key= "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"
#     os.environ.get("OPENAI_API_KEY")
# )
# Load CSV and prepare data
def load_qa_data(filepath):
    df = pd.read_csv(filepath)
    df['embedding'] = df['embedding'].apply(literal_eval)
    return df

# Get embedding for user query
def get_openai_embedding(text, model="text-embedding-ada-002"):
    response = client.embeddings.create(
        input=[text],
        model=model
    )
    return response.data[0].embedding

# Retrieve most similar question-answer pair
def retrieve_relevant_qa(user_query, df, top_k=1):
    query_vec = get_openai_embedding(user_query)
    df['similarity'] = df['embedding'].apply(lambda x: 1 - cosine(query_vec, x))
    top_matches = df.sort_values('similarity', ascending=False).head(top_k)
    return top_matches

# Generate response using OpenAI GPT model
def generate_response_rag(user_query, retrieved_df):
    context = "\n".join(
        [f"Q: {row['Question']}\nA: {row['Answer']}" for _, row in retrieved_df.iterrows()]
    )
    if is_risk_question(user_query):
        prompt = f"""⚠️ The user is asking about personal health risk. Use a few sample from the context below to ask user to provide more information.
        Add relevant emojis in the response where suitable. 
        If the context is unrelated or does not help answer the question reply {random.choice(FALLBACK_RESPONSES)}
    Context:
    {context}

    Question: {user_query}
    Answer:"""
    else:
        prompt = f"""💬 You are a helpful and friendly medical assistant 🤖. Use the context below to answer the user's question clearly and accurately with a positive tone. 
        Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.
    If the context is unrelated or does not help answer the question reply {random.choice(FALLBACK_RESPONSES)}

    Context:
    {context}

    Question: {user_query}
    Answer:"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # or "gpt-4"
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    return response.choices[0].message.content

import random

FALLBACK_RESPONSES = [
    "Hmm, I'm not sure about that. Could you try asking something related to heart disease or healthy living?",
    "I’m sorry, I don’t have enough information on that topic. Try rephrasing your question with heart health in mind!",
    "That's a bit outside what I can help with. Let’s try something about cardiovascular health!",
    "Oops! I’m trained mainly on heart disease and healthy habits. Can you ask something in that area?",
    "I’d love to help, but I specialize in heart health. Maybe ask something related to symptoms, causes, or prevention?"
]
GREETINGS = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]
def is_greeting(user_input):
    user_input_lower = user_input.strip().lower()
    return any(greet in user_input_lower for greet in GREETINGS)

def is_risk_question(user_query):
    risk_keywords = [
        "risk", "chance", "likelihood", "possibility", "odds", 
        "am I at risk", "my risk", "do I have", "will I get", "chances of"       
    ]
    user_query_lower = user_query.lower()
    return any(keyword in user_query_lower for keyword in risk_keywords)


# RAG Pipeline
def rag_pipeline(user_query, qa_csv_path, threshold=0.75):
    df = load_qa_data(qa_csv_path)
    top_match_df = retrieve_relevant_qa(user_query, df)
    if top_match_df.empty:
        return random.choice(FALLBACK_RESPONSES)
    elif top_match_df['similarity'].iloc[0] < threshold:
        return random.choice(FALLBACK_RESPONSES)
    else:
      response = generate_response_rag(user_query, top_match_df)
    return response







def generate_response(user_id: int, user_input: str, db, diabetes_model, heart_model) -> str:
    user_input = user_input.lower().strip()

    intent = get_intent(user_input)

    if intent == "greet":
        return "Hello! How can I assist you with health-related questions?"
    elif intent == "bye":
        return "Take care! If you have more questions, feel free to come back."
    elif intent == "predict_diabetes":

        predictor = DiabetesRiskPredictor(db, diabetes_model)
        risk_score = predictor.predict(user_id)

        return "Based on your profile. Your Diabetes Risk Score is:\n{:.2f}".format(risk_score * 100)

    elif intent == "predict_heart":

        print("Predicting Heart Risk through Chatbot")
        print("User: " + str(user_id))

        predictor = HeartRiskPredictor(db, heart_model)
        risk_score = predictor.predict(user_id)

        return "Based on your profile. Your Heart Disease Risk Score is: {:.2f}".format(risk_score * 100)
    
    elif intent == "exercise":
        return "Exercise Intent"
    
    user_vector = get_embedding(user_input)
    best_score = -1
    best_response = "Sorry, I don’t understand."

    current_dir = os.path.dirname(os.path.abspath(__file__)) 
    csv_path = os.path.join(current_dir, 'data', 'embeddings.csv')

    stored_embeddings = load_embeddings(csv_path)
    print(stored_embeddings)
    for question, answer, embedding in stored_embeddings:
        score = cosine_similarity(user_vector, embedding)
        print(score)
        if score > best_score:
            best_score = score
            best_response = answer

    return best_response


def generate_and_save_embeddings(input_csv_path, output_csv_path):
    df = pd.read_csv(input_csv_path)
    df.columns = df.columns.str.strip()

    embeddings = []
    for question in df['Question']:
        embedding = get_embedding(question)
        embeddings.append(embedding.tolist())  # Convert numpy array to list for CSV

    df['Embedding'] = embeddings
    df.to_csv(output_csv_path, index=False)
    print(f"✅ Embeddings saved to {output_csv_path}")

def get_intent(user_input: str) -> str:
    normalized = user_input.lower()

    if any(greet in normalized for greet in ["hi", "hello", "hey"]):
        return "greet"
    elif any(bye in normalized for bye in ["bye", "goodbye", "see you"]):
        return "bye"
    elif "predict my risk" in normalized:
        if "diabetes" in normalized:
            return "predict_diabetes"
        elif "heart disease" in normalized or "cardio" in normalized:
            return "predict_heart"
    elif any(exercise in normalized for exercise in ["exercise"]):
        return "exercise"
    
    return "embedding"
