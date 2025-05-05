import os
import pandas as pd
import numpy as np
import ast
import traceback

def load_embeddings(file_path):
    try:
        print(f"Loading embeddings from: {file_path}") 

        if not os.path.exists(file_path):
            print("File not found!")
            return []

        # Load the CSV using pandas
        df = pd.read_csv(file_path)
        df.columns = df.columns.str.strip()  # Strip any whitespace from column names
        print("✅ CSV columns:", df.columns.tolist())

        # Initialize a list to store embeddings
        stored_embeddings = []

        # Loop through each row in the DataFrame
        for _, row in df.iterrows():
            try:
                question = row['Question']
                answer = row['Answer']
                embedding = np.array(ast.literal_eval(row['Embedding']))  # Convert string to list then np.array
                stored_embeddings.append((question, answer, embedding))
            except KeyError as ke:
                print(f"Missing column in row: {ke}")
            except ValueError:
                print(f"Skipping row due to invalid embedding format: {row.get('Embedding', '')}")
                continue

        print(f"✅ Loaded {len(stored_embeddings)} embeddings.")
        return stored_embeddings

    except FileNotFoundError:
        print(f"Error: The file at {file_path} was not found.")
        return []
    except pd.errors.EmptyDataError:
        print("Error: The CSV file is empty.")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        traceback.print_exc()
        return []
