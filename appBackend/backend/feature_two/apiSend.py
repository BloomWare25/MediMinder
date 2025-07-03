import requests

# Replace with the actual ObjectId string you want to query
medication_id = "My Name Romyo"  # This should be the userId or any other identifier you are using

# Replace with your FastAPI server URL if different
url = f"http://127.0.0.1:8000/data?id={medication_id}"

response = requests.get(url)

if response.status_code == 200:
    print("Status:", response.json())
else:
    print("Error:", response.status_code, response.text)