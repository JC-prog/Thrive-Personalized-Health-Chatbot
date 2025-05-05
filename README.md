## Section 1: Project Title

## Thrive: Diabetes & Heart Diagnosis and Recommendation System

## Section 2: Executive Summary

**Thrive** is a user-focused, intelligent healthcare application designed to assess and reduce the risk of chronic diseases—specifically heart disease and diabetes. The app leverages a robust machine learning model to predict an individual’s risk level using personal and health-related inputs. Complementing this predictive capability is a lifestyle-based recommendation engine, which delivers personalized health plans through an intuitive chatbot interface.

Built with a React frontend for seamless user interaction and a FastAPI backend for high-performance and scalable communication, Thrive integrates OpenAI’s GPT model to power its chatbot. The model has been fine-tuned using embeddings to align responses with the app's specific context and medical goals. This ensures that user conversations remain both relevant and aligned with evidence-based healthcare strategies. Thrive demonstrates a successful fusion of predictive analytics, conversational AI, and modern software design to empower users in managing their health proactively.

## Section 3: Project Contribution

| Full Name              | Student ID  | Work Items                                                                         | Email              |
|------------------------|-------------|------------------------------------------------------------------------------------|--------------------|
| Ye Htut                | A0315376B   | Diabetes Model Training, Chatbot Feature Development                               | _To be filled_     |
| Chong Loh Loy Fatt     | A0314461M   | System Design and App Integration and Development                                  | 1503303@u.nus.edu  |
| Loke Yuen Ying, Jodie  | A0310555M   | Exercise Recommender Feature Development                                           | _To be filled_     |
| Wang Ze Yu             | A0126110A   | Heart Disease Risk Model Training, Finetuning and Prediction Class Development     | _To be filled_     |

## Section 4: System Demo

Refer to the `Videos/` folder for system modeling and use case demonstration recordings.

## Section 5: User Guide

For a full user guide, see **Appendix 7.3 - Appendix C** in the project report.

### Docker Installation

**Build:**
```bash
docker-compose build --no-cache
```

**Run:**
```bash
docker-compose up
```

### Local Installation

#### Prerequisites

- Python 3.10.11 or higher  
- Node.js v23.10.0  
- npm v10.9.2  

#### Build Instructions

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
python -m venv venv-310
.venv\Scripts\activate      
pip install -r requirements.txt
```

Create a `.env` file in the `/backend` directory and add your OpenAI API key:

```env
OPENAI_API_KEY=your-api-key-here
```

**Database (MySQL):**
1. Install MySQL
2. Create a schema named `thrive_db`

#### Run Instructions

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
uvicorn app.main:app --reload
```

## Section 6: Project Report

Refer to the `ProjectReport/` folder for the complete and formatted project documentation.

## Section 7: Miscellaneous

Additional resources and files are available in the root and relevant subdirectories of this repository.
