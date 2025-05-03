# Thrive Chatbot

# Docker Installation
## Build:
docker-compose build --no-cache

## Run:
docker-compose build --no-cache

# Local Installation
## Prerequisite
1. Python 3.10.11 or higher
2. Node v23.10.0
3. npm v10.9.2

## Build:
### Frontend:
1. cd to frontend
2. npm install

### Backend:
1. cd to backend
2. python -m venv venv-310
3. .\venv\Scripts\activate  # This activates the Python environment
4. pip install -r requirements.txt
5. Create a .env file the the root directory /backend
6. Add your OpenAI API key like this 
	OPENAI_API_KEY=your-api-key-here

### Database 
Install and setup MySQL:
1. Create a new schema named "thrive_db"

## Run
### Frontend
1. npm run dev

### Backend
1. uvicorn app.main:app --reload
