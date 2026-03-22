import requests

url = "http://localhost:8000/api/v1/public/onboarding"
payload = {
    "full_name": "Test Investor",
    "phone": "9876543210",
    "email": "test@example.com",
    "vehicle_make": "Mahindra",
    "vehicle_model": "Thar Roxx",
    "vehicle_year": 2024,
    "reg_number": "KA01 TEST",
    "asset_value": 2000000,
    "agreement_accepted": True
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
