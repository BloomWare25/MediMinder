# feature two will be maintained by Romyojit this will lead to the medication status 
from dotenv import load_dotenv # For getting env variables
from pymongo import MongoClient # For connecting to MongoDB Atlas
import os
import time

load_dotenv(override=False) # Load environment variables from .env file

uri = os.getenv("MONGO_ATLAS_STRING") # Get the MongoDB connection string from environment variables

client = MongoClient(uri) # Create a MongoClient instance to connect to MongoDB Atlas

print(client.list_database_names()) # Print the names of all databases in the MongoDB instance

db = client["sample_mflix"] # Connect to the "sample_mflix" database

print(db.list_collection_names()) # Print the names of all collections in the database

collection = db["users"] # Connect to the "users" collection in the database

post = {
    '_id': 1,
    'name': 'Romyojit',
    "email": "test@gmail.com",
    "password": "test123",
    "updated_at": time.asctime(time.localtime(time.time())),
}
collection.update_one({'_id': 1}, {'$set': post}) # Update the document with _id 1 in the "users" collection


all = collection.find({}) # Find all documents in the "users" collection
for res in all:
    print(res) # Print each document in the collection


