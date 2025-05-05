import os
import numpy as np
import pandas as pd
from .embeddings import load_embeddings
from .models.distilbert import get_embedding
from .models.utils import cosine_similarity
from app.prediction_models.diabetes_prediction import DiabetesRiskPredictor
from app.prediction_models.heart_prediction import HeartRiskPredictor
# from app.chatbot.exercise_recommendation_v4_7 import get_exercise_plan_summary,generate_exercise_plan
from app.chatbot.updated_exercise_recommendation_v4_7 import create_guidelines_graph,get_exercise_plan_summary
from app.models import UserGeneralData, UserClinicalMeasurement, UserLifeStyleInformation, UserMedicalHistory, UserHealthScore, UserDiabetesPredictionHistory

import numpy as np
from ast import literal_eval
from scipy.spatial.distance import cosine
from openai import OpenAI
from dotenv import load_dotenv
import random
import asyncio
import json

GREETINGS_RESPONSES = [
    "👋 Hello! How can I assist you today? You can ask about heart health, diabetes risk, exercise tips, or healthy habits! 😊",
    "Hi there! 🌟 I'm here to help with your health-related questions. Ask me about heart disease, diabetes, or staying active! 💪",
    "Hey! 👋 Ready to chat about health? Ask me anything about fitness, healthy living, or managing risks! 🏃‍♂️🍎",
    "Hello! 🤖 I'm your friendly health assistant. Let's talk about heart health, diabetes prevention, or lifestyle tips! ❤️",
    "Hi! 👋 Need advice on staying healthy? I'm here to help with heart disease, diabetes, or fitness tips! 🩺",
    "Hey there! 🌈 How can I help you today? Ask me about healthy habits, exercise, or managing health risks! 🥗",
    "Hello! 👋 I'm here to make health fun and easy. Ask me about heart health, diabetes, or fitness tips! 🚴‍♀️",
]

def is_greeting(user_input):
    user_input_lower = user_input.strip().lower()
    return any(greet in user_input_lower for greet in GREETINGS)

def get_greeting_response():
    return random.choice(GREETINGS_RESPONSES)
def initialize_user_profile(age=None, gender=None, height=None, weight=None,
                            bp_systolic=None, bp_diastolic=None, glucose=None,
                            cholesterol=None, fitness_level=None, fitness_goal=None,
                            sessions_per_week=None, equipment=None):
        """Initialize or collect user profile with defaults

        Args:
            age: User's age (default: 40)
            gender: User's gender (default: "not specified")
            height: User's height in cm (default: 170.0)
            weight: User's weight in kg (default: 70.0)
            bp_systolic: Systolic blood pressure (default: 120)
            bp_diastolic: Diastolic blood pressure (default: 80)
            glucose: Blood glucose level (default: 100)
            cholesterol: Blood cholesterol level (default: 180)
            fitness_level: User's fitness level (default: "beginner")
            fitness_goal: User's fitness goal (default: "general")
            sessions_per_week: Number of weekly workout sessions (default: 3)
            equipment: Available equipment (default: ["Bodyweight"])

        Returns:
            Dict: Complete user profile with derived metrics
        """
        # Initialize with provided values or defaults
        profile = {
            "demographics": {
                "age": age if age is not None else 40,
                "gender": gender.lower() if gender is not None else "not specified"
            },
            "body_metrics": {
                "height": height if height is not None else 170.0,  # cm
                "weight": weight if weight is not None else 70.0    # kg
            },
            "health_metrics": {
                "bp_systolic": bp_systolic if bp_systolic is not None else 120,
                "bp_diastolic": bp_diastolic if bp_diastolic is not None else 80,
                "glucose": glucose if glucose is not None else 100,
                "cholesterol": cholesterol if cholesterol is not None else 180
            },
            "fitness_info": {
                "fitness_level": fitness_level.lower() if fitness_level is not None else "beginner",
                "fitness_goal": fitness_goal.lower() if fitness_goal is not None else "general",
            },
            "preferences": {
                "sessions_per_week": sessions_per_week if sessions_per_week is not None else 3,
                "equipment": equipment if equipment is not None else ["Bodyweight"]
            }
        }

        # Calculate BMI
        height_m = profile["body_metrics"]["height"] / 100  # convert cm to m
        profile["body_metrics"]["bmi"] = round(profile["body_metrics"]["weight"] / (height_m * height_m), 1)

        # Determine health condition flags
        profile["health_conditions"] = {
            "has_hypertension": (profile["health_metrics"]["bp_systolic"] >= 130 or
                            profile["health_metrics"]["bp_diastolic"] >= 85),
            "has_diabetes": profile["health_metrics"]["glucose"] >= 126,  # Fasting glucose ≥126 mg/dL
            "has_high_cholesterol": profile["health_metrics"]["cholesterol"] >= 200,
            "has_obesity": profile["body_metrics"]["bmi"] >= 30 if profile["body_metrics"]["bmi"] else False
        }

        # Calculate age-related max heart rate
        profile["exercise_parameters"] = {
            "max_heart_rate": 220 - profile["demographics"]["age"] if profile["demographics"]["age"] else 180,
            "target_heart_rate_zone": {}
        }

        # Calculate target heart rate zones
        max_hr = profile["exercise_parameters"]["max_heart_rate"]
        profile["exercise_parameters"]["target_heart_rate_zone"] = {
            "low_intensity": [int(max_hr * 0.5), int(max_hr * 0.6)],
            "moderate_intensity": [int(max_hr * 0.6), int(max_hr * 0.7)],
            "high_intensity": [int(max_hr * 0.7), int(max_hr * 0.85)]
        }

        return profile
async def generate_response_openai_async(user_id: int, user_input: str, db, diabetes_model, heart_model) -> str:
    user_input = user_input.lower().strip()
    current_dir = os.path.dirname(os.path.abspath(__file__)) 
    csv_path = os.path.join(current_dir, 'data', 'cardio_and_diabetes_qa_embeddings.csv')
    csv_path_exercise = os.path.join(current_dir, 'data', 'combined_exercise_embeddings.csv')
    csv_path_exercise_dataset = os.path.join(current_dir, 'data', 'combined_exercise_dataset.csv')
    combined_prompt = ""

    # Handle diabetes self-assessment
    if is_diabetes_self_assessment(user_input):
        diabetes_predictor = DiabetesRiskPredictor(db, diabetes_model)
        diabetes_risk_score, diabetes_user_info = diabetes_predictor.predict_with_details(user_id)

        # Handle missing user info
        if diabetes_user_info is None:
            print("⚠️ Warning: Unable to retrieve user information for diabetes prediction.")
            combined_prompt += "⚠️ Unable to process your diabetes self-assessment due to incomplete or invalid data. Please ensure your profile is complete.\n"
        else:
            # Form the prompt with user info
            diabetes_prompt = form_user_info_prompt(diabetes_user_info)
            combined_prompt += f"""{diabetes_prompt}\n\nUser Diabetes Risk Score is: {diabetes_risk_score * 100:.2f}%.\n
            Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n"""

    # Handle heart self-assessment
    elif is_heart_self_assessment(user_input):
        heart_predictor = HeartRiskPredictor(db, heart_model)
        heart_risk_score, heart_user_info = heart_predictor.predict_with_details(user_id)

        # Handle missing user info
        if heart_user_info is None:
            print("⚠️ Warning: Unable to retrieve user information for heart disease prediction.")
            combined_prompt += "⚠️ Unable to process your heart disease self-assessment due to incomplete or invalid data. Please ensure your profile is complete.\n"
        else:
            # Form the prompt with user info
            heart_prompt = form_heart_disease_prompt(heart_user_info)
            combined_prompt += f"""{heart_prompt}\n\nUser Heart Disease Risk Score is: {heart_risk_score * 100:.2f}%. 
            Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n"""
    elif is_analyze_user_total_health(user_input):
            heart_predictor = HeartRiskPredictor(db, heart_model)
            heart_risk_score, heart_user_info = heart_predictor.predict_with_details(user_id)

            # Handle missing user info
            if heart_user_info is None:
                print("⚠️ Warning: Unable to retrieve user information for heart disease prediction.")
                combined_prompt += "⚠️ Unable to process your heart disease self-assessment due to incomplete or invalid data. Please ensure your profile is complete.\n"
            else:
                # Form the prompt with user info
                heart_prompt = form_heart_disease_prompt(heart_user_info)
                combined_prompt += f"""{heart_prompt}\n\nUser Heart Disease Risk Score is: {heart_risk_score * 100:.2f}%. 
                Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n"""
            diabetes_predictor = DiabetesRiskPredictor(db, diabetes_model)
            diabetes_risk_score, diabetes_user_info = diabetes_predictor.predict_with_details(user_id)

            # Handle missing user info
            if diabetes_user_info is None:
                print("⚠️ Warning: Unable to retrieve user information for diabetes prediction.")
                combined_prompt += "⚠️ Unable to process your diabetes self-assessment due to incomplete or invalid data. Please ensure your profile is complete.\n"
            else:
                # Form the prompt with user info
                diabetes_prompt = form_user_info_prompt(diabetes_user_info)
                combined_prompt += f"""{diabetes_prompt}\n\nUser Diabetes Risk Score is: {diabetes_risk_score * 100:.2f}%.\n
                Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n"""    
    elif is_exercise_question(user_input):
        print("Exercise Intent")
        # This will return the exercise plan based on the user profile
        # user_profile = {
        #     "demographics": {"age": 30, "gender": "male"},
        #     "body_metrics": {"height": 180, "weight": 80},
        #     "health_metrics": {"bp_systolic": 120, "bp_diastolic": 80, "glucose": 100, "cholesterol": 190},
        #     "fitness_info": {"fitness_level": "beginner", "fitness_goal": "weight loss"},
        #     "preferences": {"sessions_per_week": 3, "equipment": ["Bodyweight"]},
        #     "health_conditions": {"has_hypertension": False, "has_diabetes": False, "has_high_cholesterol": False, "has_obesity": False}
        # }
        general = db.query(UserGeneralData).filter_by(id=user_id).first()
        clinical = db.query(UserClinicalMeasurement).filter_by(id=user_id).first()
        lifestyle = db.query(UserLifeStyleInformation).filter_by(id=user_id).first()
        # history = db.query(UserMedicalHistory).filter_by(id=user_id).first()
        # score = db.query(UserHealthScore).filter_by(id=user_id).first()
        USER_PROFILE = initialize_user_profile(
            age=general.age,
            gender=general.gender,
            height=clinical.height,
            weight=clinical.weight,
            bp_systolic=clinical.systolic_bp,
            bp_diastolic=clinical.diastolic_bp,
            glucose=clinical.glucose_level,
            cholesterol=clinical.cholesterol_total,
            fitness_level="intermediate" if lifestyle.active_lifestyle == 1 else "beginner",  # Map 1 to "Intermediate" and 0 to "Beginner"
            fitness_goal="weight loss",
            sessions_per_week=3,
            equipment=["Bodyweight"]
            
        )
        exercise_dataset_path = csv_path_exercise_dataset# "path/to/combined_exercise_dataset.csv"

        # plan = generate_exercise_plan(USER_PROFILE, exercise_dataset_path)
        # exercise_plan_result = get_exercise_plan_summary(plan)

        # graph = create_guidelines_graph(plan, exercise_dataset_path)
        exercise_plan_result = get_exercise_plan_summary(USER_PROFILE)

        try:
            parsed = json.loads(exercise_plan_result)
            answer = parsed.get("answer", "")        
        except Exception as e:
            answer = exercise_plan_result     
        return {"answer": answer}
        
        
        combined_prompt += "🏋️‍♂️ You are a helpful and friendly medical assistant 🤖. Use the UserInformation and context below to answer the user's question clearly and accurately with a positive tone. \n"
        combined_prompt += "Use the context to provide a personalized response.\n"
        combined_prompt += "Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n"
    elif is_healthy_habits_question(user_input):
        combined_prompt += "🏋️‍♂️ You are a helpful and friendly medical assistant 🤖. Use the UserInformation and context below to answer the user's question clearly and accurately with a positive tone. \n"
        combined_prompt += "Use the context to provide a personalized response.\n"
        combined_prompt += "Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n"
    # Add user query to the combined prompt
    # else:
    #     fallback_message = random.choice(FALLBACK_RESPONSES)
    #     return {"answer": fallback_message}
    combined_prompt += f"\nUser Query: {user_input}"

    # Pass the combined prompt to the RAG pipeline for further suggestions
    response = await rag_pipeline_async(user_input, combined_prompt, csv_path, csv_path_exercise)
    return response

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)
# Initialize the OpenAI client (uses environment variable OPENAI_API_KEY or pass api_key directly)
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
# Global in-memory storage for QA data
qa_data = None
qa_data_diabetes_heart = None
qa_data_exercise = None

# Load CSV data once into memory
def load_qa_data_once(diabetes_heart_filepath, exercise_filepath):
    """
    Load QA data for diabetes/heart and exercise into memory once.
    """
    global qa_data_diabetes_heart, qa_data_exercise

    # Load diabetes and heart-related QA data
    if qa_data_diabetes_heart is None:
        df_diabetes_heart = pd.read_csv(diabetes_heart_filepath)
        df_diabetes_heart['embedding'] = df_diabetes_heart['embedding'].apply(eval)  # Convert string to list
        qa_data_diabetes_heart = df_diabetes_heart

    # Load exercise-related QA data
    if qa_data_exercise is None:
        df_exercise = pd.read_csv(exercise_filepath)
        df_exercise['embedding'] = df_exercise['embedding'].apply(eval)  # Convert string to list
        qa_data_exercise = df_exercise

    return qa_data_diabetes_heart, qa_data_exercise

# Asynchronous function to get OpenAI embedding
async def get_openai_embedding_async(text, model="text-embedding-ada-002"):
    response = await asyncio.to_thread(
        client.embeddings.create,
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

# Asynchronous function to retrieve most similar question-answer pair
async def retrieve_relevant_qa_async(user_query, qa_data, top_k=1):
    """
    Retrieve the most relevant QA pair from the specified dataset.
    """
    query_vec = await get_openai_embedding_async(user_query)
    qa_data['similarity'] = qa_data['embedding'].apply(lambda x: 1 - cosine(query_vec, x))
    top_matches = qa_data.sort_values('similarity', ascending=False).head(top_k)
    return top_matches

def load_prompt(prompt_path: str) -> str:
    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()

# Generate response using OpenAI GPT model
async def generate_response_rag_async(user_query, combined_prompt, retrieved_df):
    context = "\n".join(
        [f"Q: {row['Question']}\nA: {row['Answer']}" for _, row in retrieved_df.iterrows()]
    )
    
    # if is_risk_question(user_query) :        
    #     prompt = f"""⚠️ You are a helpful and friendly medical assistant 🤖. The user is asking about personal health risk. Use the context below to answer the user's question clearly and accurately with a positive tone. 
    #     If information is not enough then use a few sample from the context below to ask user to provide more information in a bulleted point format.
    #     Use the context to provide a personalized response. Add relevant emojis in the response where suitable. 
    #     If the context is unrelated or does not help answer the question reply {random.choice(FALLBACK_RESPONSES)}
        
    #     Context:
    #     {context}

    #     Question: {user_query}
    #     Answer:"""
    # if is_diabetes_self_assessment(user_query) or is_heart_self_assessment(user_query):
    # system_prompt = f"""⚠️ You are a helpful and friendly medical assistant bsed in singapore🤖.\n\n
    #     The user is asking about personal health risk.\n\n
    #     Use the context below to answer the user's question clearly and accurately with a positive tone.\n\n
    #     If the question involves steps, tips, plan or advice, use a numbered list.\n\n
    #     Otherwise, break the answer into short readable paragraphs for clarity.\n\n
    #     Format the entire response as JSON with a single key: 'answer'.\n\n
        
    #     Tone and formatting:
    #     - Use a conversational and supportive Singaporean tone
    #     - Avoid being too formal — phrases like “can try...”, “best is...”, or “good to avoid…” are okay
    #     - Include emojis where suitable (🩺 🏃‍♀️ 🥗 ❤️ etc.)
    #     - Use short paragraphs or numbered steps for readability
    #     - After the answer, suggest three follow-up questions the user might ask next. Write them as natural, chatbot-style questions (not bullets or arrays).



    #     You are a friendly and knowledgeable medical assistant based in Singapore 🇸🇬.

    #     You will receive a health-related user question and their profile. Please do the following:

    #     1. Detect the intent:
    #     - General health advice or information
    #     - Self-assessment or risk check
    #     - Lifestyle/wellness tips
    #     - Exercise plan recommendation (specific body area or mental condition)
    #     - Greetings or farewells
    #     - If the context is unrelated or does not help answer the question reply {random.choice(FALLBACK_RESPONSES)}

    #     2. Respond accordingly:
    #     - Give warm, helpful advice using the profile and question.
    #     - If self-assessment is involved, briefly explain prediction results (e.g., high/low risk), and highlight 3 main contributing factors in natural language.
    #     - For lifestyle or workout plans, give relevant tips users can try easily.
    #     - Use a Singaporean tone — polite, casual, clear. Use local phrasing like "best is", "can try", "better to avoid", etc.
    #     - Include helpful emojis for warmth and clarity 🩺🍎💪🧘
    #     - Suggest 2-3 follow-up questions that feel natural, as if the user typed it.

    #     Format all output in natural conversational text, no need to wrap in JSON format.

    #     ---

    #     🧪 Few-shot Examples:

    #     1. Diabetes Self-Assessment  
    #     User Question: Am I at risk for diabetes?  
    #     User Profile: Age 52, Female, Overweight, Family history of diabetes

    #     Answer: Based on your profile, there’s a moderate risk of developing Type 2 diabetes. Having a family history and being overweight are strong indicators. Best is to go for regular screenings and maintain a balanced diet 🍲, exercise regularly 🏃‍♀️, and manage weight. Watch out for symptoms like frequent thirst, fatigue, or slow wound healing.

    #     Top contributing factors:  
    #     1. Family history — inherited risk can raise chances  
    #     2. BMI — extra weight can lead to insulin resistance  
    #     3. Age — after 45, risk starts to climb

    #     Next you might ask:  
    #     What are early symptoms of diabetes?  
    #     Can losing weight help prevent diabetes?  
    #     What blood test should I take to check for diabetes?

    #     ---

    #     2. Heart Disease Self-Assessment  
    #     User Question: Do I have a high risk of heart disease?  
    #     User Profile: Age 58, Male, Smoker, High blood pressure

    #     Answer: With high blood pressure and smoking habit, you’re in the high-risk group for heart disease ❤️‍🔥. Best is to manage your BP, cut down or quit smoking 🚭, and keep your cholesterol levels in check. Going for a heart screening test is also a good step.

    #     Top contributing factors:  
    #     1. Smoking — damages blood vessels and heart health  
    #     2. High BP — strains your heart over time  
    #     3. Age — risk goes up after 50s

    #     Next you might ask:  
    #     What foods help lower heart disease risk?  
    #     How can I quit smoking safely?  
    #     Should I do an ECG test?

    #     ---

    #     3. Healthy Lifestyle Recommendation  
    #     User Question: How to live a healthier lifestyle?  
    #     User Profile: Age 40, Female, No major health issues

    #     Answer: That’s a great goal! Can try eating more fresh food 🍎, less processed stuff, sleep 7–8 hours 🛌, and move daily — even a 30-min brisk walk helps. Also, take time to relax your mind — meditation or hobbies are good too 🧘.

    #     Next you might ask:  
    #     What’s a simple healthy meal plan for busy people?  
    #     How to stay motivated to exercise daily?  
    #     Is sleeping late bad for health?

    #     ---

    #     4. Workout Plan Based on Physical or Mental Condition  
    #     User Question: Can I get a workout plan to reduce belly fat and stress?  
    #     User Profile: Age 35, Male, Desk job, Stressed

    #     Answer: Sure! Can try morning walks or jogs 🏃‍♂️ and include core workouts like planks and crunches. For stress, best is to add stretching and yoga 🧘. Start small — 20–30 mins daily is a good start. Reduce sugary snacks and get proper sleep also helps.

    #     Next you might ask:  
    #     What are simple core exercises for beginners?  
    #     How does yoga help with stress?  
    #     Is HIIT effective for belly fat?

    #     ---

    #     5. General Health Info: Diabetes & Heart Health  
    #     User Question: Can I get diabetes and heart disease at the same time?  
    #     User Profile: Age 50, Male, Obese, High cholesterol

    #     Answer: Yes, it’s possible and actually quite common. Diabetes can increase the risk of heart disease if not managed well. Best is to monitor your blood sugar regularly, manage your weight 🍽️, and keep cholesterol under control. Regular exercise and healthy food go a long way 💪.

    #     Next you might ask:  
    #     What’s the connection between sugar and heart disease?  
    #     Can I take medication for both at once?  
    #     Is plant-based diet good for diabetes?

    #     ---

    #     6. Greeting / Farewell  
    #     User Question: Hello!  
    #     Answer: Hello! 👋 How can I help you today with your health or wellness?

    #     Next you might ask:  
    #     How to manage stress?  
    #     What foods are good for heart health?  
    #     Can you help with a workout plan?

    #     User Question: Thank you, bye!  
    #     Answer: No problem! Take care and stay healthy! 👋 Hope to see you again soon!

    #     ---

    #     Now respond to the user using the same tone, format, friendly tone, and structure.
    #     """
    system_prompt = load_prompt("app/chatbot/prompts/few_shot_localised_v1.prompt")
    prompt=f"""
    {combined_prompt}
    Context:
    {context}
    Question: {user_query}
    Asnwer:"""
    # elif is_exercise_question(user_query):
    #     system_prompt = f"""🏋️‍♂️ You are a helpful and friendly medical assistant 🤖.\n\n
    #     Use the context below to answer the user's question clearly and accurately with a positive tone.\n\n   
    #     If the question involves steps, tips, plan or advice, use a numbered list.\n\n
    #     Otherwise, break the answer into short readable paragraphs for clarity.\n\n
    #     Use the context to provide a personalized response.\n\n
    #     Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n\n
    #     Format the entire response as JSON with a single key: 'answer'.\n\n
    #     If the context is unrelated or does not help answer the question reply {random.choice(FALLBACK_RESPONSES)}"""
    #     prompt = f"""
    #     Context:
    #     {context}

    #     Question: {user_query}
    #     Answer:"""
    # elif is_healthy_habits_question(user_query):
    #     system_prompt = f"""🥗 You are a helpful and friendly medical assistant 🤖.\n\n 
    #     Use the context below to answer the user's question clearly and accurately with a positive tone.\n\n
    #     If the question involves steps, tips, plan or advice, use a numbered list.\n\n
    #     Otherwise, break the answer into short readable paragraphs for clarity.\n\n
    #     Use the context to provide a personalized response.\n\n
    #     Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n\n
    #     Format the entire response as JSON with a single key: 'answer'.\n\n
    #     If the context is unrelated or does not help answer the question reply {random.choice(FALLBACK_RESPONSES)}"""
    #     prompt = f"""
    #     Context:
    #     {context}

    #     Question: {user_query}
    #     Answer:""" 
    # else:
    #     system_prompt = f"""💬 You are a helpful and friendly medical assistant 🤖.\n\n
    #     Use the context below to answer the user's question clearly and accurately with a positive tone.\n\n 
    #     If the question involves steps, tips, plan or advice, use a numbered list.\n\n
    #     Otherwise, break the answer into short readable paragraphs for clarity.\n\n
    #     Use the context to provide a personalized response.\n\n
    #     Add relevant emojis in the response where suitable. Include helpful lifestyle recommendation in your answer.\n\n
    #     Format the entire response as JSON with a single key: 'answer'.\n\n
    #     If the context is unrelated or does not help answer the question reply {random.choice(FALLBACK_RESPONSES)}"""
    #     prompt = f"""
    #     Context:
    #     {context}

    #     Question: {user_query}
    #     Answer:"""

    # system_prompt = load_prompt("app/chatbot/prompts/few_shot_localised_v1.prompt")
   # Run the synchronous method in a thread to avoid blocking
    response = await asyncio.to_thread(
        client.chat.completions.create,
        model="gpt-3.5-turbo",  # or "gpt-4"
        messages=[{ "role": "system","content": system_prompt },                  
                  { "role": "user", "content": prompt}],
        temperature=0.2
    )

    gpt_reply = response.choices[0].message.content.strip()

    try:
        parsed = json.loads(gpt_reply)
        answer = parsed.get("answer", "")        
    except Exception as e:
        answer = gpt_reply     
    return {"answer": answer}

    # return response.choices[0].message.content

import random

FALLBACK_RESPONSES = [
    "Hmm, I'm not sure about that. Could you try asking something related to heart disease, diabetes, exercise, or healthy living?",
    "I’m sorry, I don’t have enough information on that topic. Try rephrasing your question with heart, diabetes, or healthy habits in mind!",
    "That's a bit outside what I can help with. Let’s try something about cardiovascular health, diabetes risk, or healthy habits!",
    "Oops! I’m trained mainly on heart disease, diabetes, healthy lifestyle, and healthy habits. Can you ask something in that area?",
    "I’d love to help, but I specialize in heart and diabetes risk prevention. Maybe ask something related to symptoms, causes, or prevention?"
]
GREETINGS = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "how are you", "what's up", "what's up"]  
def is_greeting(user_input):
    user_input_lower = user_input.strip().lower()
    return any(greet in user_input_lower for greet in GREETINGS)

def is_risk_question(user_query):
    risk_keywords = [
        "risk","reduce", "chance", "likelihood", "possibility", "odds", 
        "am I at risk", "my risk", "do I have", "will I get", "chances of", "predict", "check"
    ]
    user_query_lower = user_query.lower()
    return any(keyword in user_query_lower for keyword in risk_keywords)

def is_diabetes_self_assessment(user_query):
    diabetes_self_assessment_keywords = [
         "diabetes risk assessment", "my diabetes risk", "am I at risk for diabetes",
         "diabetes risk test", "diabetes risk questionnaire"
         ]
    user_query_lower = user_query.lower()
    return any(keyword in user_query_lower for keyword in diabetes_self_assessment_keywords)

def is_heart_self_assessment(user_query):
    heart_self_assessment_keywords = [
         "heart risk assessment", "my heart risk", "am I at risk for heart disease",
         "heart disease risk test", "heart disease risk questionnaire", "heart disease risk calculator"
    ]
    user_query_lower = user_query.lower()
    return any(keyword in user_query_lower for keyword in heart_self_assessment_keywords)
def is_exercise_question(user_query):
    exercise_keywords = [
        "exercise recommendations" 
    ]
    user_query_lower = user_query.lower()
    return any(keyword in user_query_lower for keyword in exercise_keywords)
def is_healthy_habits_question(user_query):
    healthy_habits_keywords = [
        "healthy habits", "lifestyle changes", "nutrition", 
        "wellness", "self-care", "mental health", "stress management for me",
        "my diet", "healthy eating", "healthy lifestyle", "healthy choices for me",
        "healthy living", "healthy recipes", "healthy meal plan","my nutrition","my eating habits",
        "for me to be healthy","healthy food","healthy diet for me","healthy lifestyle for me"
    ]
    user_query_lower = user_query.lower()
    return any(keyword in user_query_lower for keyword in healthy_habits_keywords)
def is_analyze_user_total_health(user_query):
    analyze_user_total_health_keywords = [
        "analyze my total health", "analyze my health", "analyze my profile",
        "analyze my data", "analyze my lifestyle", "analyze my habits",
        "analyze my health data", "analyze my health profile"
    ]
    user_query_lower = user_query.lower()
    return any(keyword in user_query_lower for keyword in analyze_user_total_health_keywords)

# Asynchronous RAG pipeline
async def rag_pipeline_async(user_query, combined_prompt, diabetes_heart_filepath, exercise_filepath, threshold=0.75):
    """
    Asynchronous RAG pipeline to retrieve relevant QA data and generate a response.
    """
    # Load QA data into memory once
    qa_data_diabetes_heart, qa_data_exercise = load_qa_data_once(diabetes_heart_filepath, exercise_filepath)

    # Retrieve relevant QA for diabetes/heart
    top_match_df_diabetes_heart = await retrieve_relevant_qa_async(user_query, qa_data_diabetes_heart)

    # Retrieve relevant QA for exercise
    top_match_df_exercise = await retrieve_relevant_qa_async(user_query, qa_data_exercise)

    # Combine results or prioritize based on similarity
    if not top_match_df_diabetes_heart.empty and top_match_df_diabetes_heart['similarity'].iloc[0] >= threshold:
        response = await generate_response_rag_async(user_query, combined_prompt, top_match_df_diabetes_heart)
    elif not top_match_df_exercise.empty and top_match_df_exercise['similarity'].iloc[0] >= threshold:
        response = await generate_response_rag_async(user_query, combined_prompt, top_match_df_exercise)
    else:
        response = random.choice(FALLBACK_RESPONSES)
        return {"answer": response}
    return response

def form_user_info_prompt(user_info: pd.DataFrame) -> str:
    """
    Form a prompt using user information for diabetes or heart risk prediction.
    Converts binary values (0 or 1) to 'Yes' or 'No' for specific fields.
    """
    # Extract the first row of the dataframe as a dictionary
    user_data = user_info.iloc[0].to_dict()

    # Map binary values to 'Yes' or 'No'
    binary_fields = ["Smoker", "Stroke", "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies", "HvyAlcoholConsump"]
    for field in binary_fields:
        user_data[field] = "Yes" if user_data[field] == 1 else "No"

    # Form the prompt
    prompt = (
        # f"You are a helpful and friendly medical assistant 🤖. The user is asking about personal health risk. Use the UserInformation and context below to answer the user's question clearly and accurately with a positive tone.\n"
        f"UserInformation:\n"
        f"- High Blood Pressure: {user_data['HighBP']}\n"
        f"- High Cholesterol: {user_data['HighChol']}\n"
        f"- Cholesterol Check: {user_data['CholCheck']}\n"
        f"- BMI: {user_data['BMI']:.2f}\n"
        f"- Smoker: {user_data['Smoker']}\n"
        f"- Stroke: {user_data['Stroke']}\n"
        f"- Heart Disease or Attack: {user_data['HeartDiseaseorAttack']}\n"
        f"- Physically Active: {user_data['PhysActivity']}\n"
        f"- Eats Fruits: {user_data['Fruits']}\n"
        f"- Eats Vegetables: {user_data['Veggies']}\n"
        f"- Heavy Alcohol Consumption: {user_data['HvyAlcoholConsump']}\n"
        f"- General Health: {user_data['GenHlth']}\n"
        f"- Mental Health: {user_data['MentHlth']}\n"
        f"- Physical Health: {user_data['PhysHlth']}\n"
        f"- Difficulty Walking: {user_data['DiffWalk']}\n"
        f"- Gender: {'Male' if user_data['Sex'] == 1 else 'Female'}\n"
        f"- Age: {user_data['Age']}\n"
    )

    return prompt

def form_heart_disease_prompt(user_info: pd.DataFrame) -> str:
    """
    Form a prompt using user information for heart disease risk prediction.
    Converts binary values (0 or 1) to 'Yes' or 'No' for specific fields.
    """
    # Extract the first row of the dataframe as a dictionary
    user_data = user_info.iloc[0].to_dict()

    # Map binary values to 'Yes' or 'No'
    binary_fields = ["smoke", "alco", "active"]
    for field in binary_fields:
        if field in user_data:
            user_data[field] = "Yes" if user_data[field] == 1 else "No"

    # Form the prompt
    prompt = (
        # f"You are a helpful and friendly medical assistant 🤖. The user is asking about personal health risk. Use the UserInformation and context below to answer the user's question clearly and accurately with a positive tone.\n"
        f"UserInformation:\n"
        f"- Age: {user_data['age']}\n"
        f"- Height: {user_data['height']} cm\n"
        f"- Weight: {user_data['weight']} kg\n"
        f"- Gender: {'Male' if user_data['gender'] == 1 else 'Female'}\n"
        f"- Systolic Blood Pressure (ap_hi): {user_data['ap_hi']}\n"
        f"- Diastolic Blood Pressure (ap_lo): {user_data['ap_lo']}\n"
        f"- Cholesterol Level: {user_data['cholesterol']}\n"
        f"- Glucose Level: {user_data['gluc']}\n"
        f"- Smoker: {user_data['smoke']}\n"
        f"- Alcohol Consumption: {user_data['alco']}\n"
        f"- Physically Active: {user_data['active']}\n"
        f"- BMI Category: {user_data['BMI']}\n"
        f"- Blood Pressure Category: {user_data['BP']}\n"
    )

    return prompt

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
