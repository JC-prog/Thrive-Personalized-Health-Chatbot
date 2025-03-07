from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Initialize FastAPI app
app = FastAPI()

# Load ClinicalBERT model and tokenizer (or replace with another pre-trained model)
model_name = "medicalai/ClinicalBERT"  # Example for ClinicalBERT
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Define Pydantic model for incoming request
class ChatRequest(BaseModel):
    text: str

# Define endpoint for chatbot responses
@app.post("/chat")
async def chat(request: ChatRequest):
    user_input = request.text

    if not user_input.strip():
        return {"response": "No input received."}

    # Tokenize the user input
    inputs = tokenizer(user_input, return_tensors="pt", truncation=True, padding=True, max_length=512)

    # Perform inference
    with torch.no_grad():  # Disable gradient calculations
        outputs = model(**inputs)
        logits = outputs.logits

    print("Logits shape:", logits.shape)  # Debugging: Check logits shape
    print("Logits:", logits)  # Debugging: Print logits

    # Get the predicted class from the logits (index of max logit)
    predicted_class = torch.argmax(logits, dim=1).item()

    # Create a response with predicted class
    response = {
        "response": f"Received input: {user_input}",
        "predicted_class": predicted_class
    }

    return response

# Health check endpoint (optional)
@app.get("/health")
def health():
    return {"status": "ok"}
