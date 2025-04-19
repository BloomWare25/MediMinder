# feature two will be maintained by Romyojit this will lead to the medication status 
from dotenv import load_dotenv # For getting env variables
from pymongo import MongoClient # For connecting to MongoDB Atlas
from pydantic import BaseModel # For creating data models
from fastapi import FastAPI # For creating the FastAPI application
import os
import time

app = FastAPI()

class Medication(BaseModel):
    userId: str
    medicineName: str
    dosage: str
    intakeTime: str
    notes: str
    created_at: str = time.asctime(time.localtime(time.time()))
    updated_at: str = created_at


load_dotenv(override=False) # Load environment variables from .env file

uri = os.getenv("MONGO_ATLAS_STRING") # Get the MongoDB connection string from environment variables

client = MongoClient(uri) # Create a MongoClient instance to connect to MongoDB Atlas

print(client.list_database_names()) # Print the names of all databases in the MongoDB instance

db = client["sample_mflix"] # Connect to the "sample_mflix" database

print(db.list_collection_names()) # Print the names of all collections in the database

collection = db["medications"] # Connect to the "medications" collection in the database

all = collection.find({}) # Find all documents in the "medications" collection

@app.get("/")
def first_example():
    med = Medication(
        userId="Romyojit",
        medicineName="paracetamol",
        dosage="500mg",
        intakeTime="Two times a day.",
        notes="Take with water.",
    ) # Create a new Medication object
    
    collection.insert_one(med.model_dump()) # Create the document with _id in the "medications" collection
    return {"message": "Medication added successfully!"} # Return a success message


for res in all:
    print(res) # Print each document in the collection


