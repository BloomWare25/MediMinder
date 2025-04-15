# feature two will be maintained by Romyojit this will lead to the medication status 
from dotenv import load_dotenv, dotenv_values # For getting env variables
from pymongo import MongoClient # For connecting to MongoDB Atlas
import os

load_dotenv()

print(os.getenv("MONGO_ATLAS_STRING"))