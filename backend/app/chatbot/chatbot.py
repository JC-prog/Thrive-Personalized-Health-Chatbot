import os
import numpy as np
import pandas as pd
from .embeddings import load_embeddings
from .models.distilbert import get_embedding
from .models.utils import cosine_similarity
from app.prediction_models.diabetes_prediction import DiabetesRiskPredictor
from app.prediction_models.heart_prediction import HeartRiskPredictor

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

        return "Your Diabetes Risk Score is: {}".format(risk_score)

    elif intent == "predict_heart":

        print("Predicting Heart Risk through Chatbot")
        print("User: " + str(user_id))

        predictor = HeartRiskPredictor(db, heart_model)
        risk_score = predictor.predict(user_id)

        return "Your Heart Disease Risk Score is: {}".format(risk_score)
    
    elif intent == "exercice":
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
