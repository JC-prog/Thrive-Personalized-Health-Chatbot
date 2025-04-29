CREATE DATABASE IF NOT EXISTS healthcare_chatbot;
USE healthcare_chatbot;

-- Table: Patients
CREATE TABLE IF NOT EXISTS Patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Medical_History
CREATE TABLE IF NOT EXISTS Medical_History (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    condition_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE,
    treatment VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE
);

-- Table: Symptoms
CREATE TABLE IF NOT EXISTS Symptoms (
    symptom_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    symptom_name VARCHAR(255) NOT NULL,
    severity ENUM('Mild', 'Moderate', 'Severe'),
    duration VARCHAR(50),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE
);

-- Table: Lifestyle
CREATE TABLE IF NOT EXISTS Lifestyle (
    lifestyle_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    smoking ENUM('Yes', 'No', 'Former Smoker'),
    alcohol ENUM('Never', 'Occasionally', 'Frequently'),
    exercise ENUM('Sedentary', 'Light', 'Moderate', 'Active'),
    diet TEXT,
    sleep_hours INT,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE
);

-- Table: Risk_Assessment
CREATE TABLE IF NOT EXISTS Risk_Assessment (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    risk_level ENUM('Low', 'Moderate', 'High'),
    recommendations TEXT,
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE
);

-- Table: Chat_Interactions
CREATE TABLE IF NOT EXISTS Chat_Interactions (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    message TEXT NOT NULL,
    response TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE
);

-- Table: Appointments
CREATE TABLE IF NOT EXISTS Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    appointment_date DATETIME NOT NULL,
    doctor_name VARCHAR(255),
    status ENUM('Scheduled', 'Completed', 'Canceled') DEFAULT 'Scheduled',
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE
);
