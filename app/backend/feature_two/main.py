# feature two will be maintained by Romyojit this will lead to the medication status 
from dotenv import load_dotenv, dotenv_values # For getting env variables
from pymongo import MongoClient # For connecting to MongoDB Atlas
import os

load_dotenv(override=False) # Load environment variables from .env file

uri = os.getenv("MONGO_ATLAS_STRING") # Get the MongoDB connection string from environment variables

client = MongoClient(uri) # Create a MongoClient instance to connect to MongoDB Atlas

print(client.list_database_names()) # Print the names of all databases in the MongoDB instance

db = client["sample_mflix"] # Connect to the "sample_mflix" database

print(db.list_collection_names()) # Print the names of all collections in the database

collection = db["embedded_movies"] # Connect to the "embedded_movies" collection in the database

print(collection.find_one()['fullplot']) # Print one document from the collection and its 'fullplot' field
for c in client.list_database_names():
    print(c)

db = client["sample_mflix"] # Connect to the "sample_mflix" database
collection = db["embedded_movies"] # Connect to the "embedded_movies" collection in the database
