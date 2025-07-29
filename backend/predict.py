import sys
import joblib
import json

# Load model and vectorizer
model = joblib.load('spam_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

# Get input email text
input_text = sys.argv[1]

# Transform and predict
features = vectorizer.transform([input_text])
prediction = model.predict(features)

# Output result
print(json.dumps(int(prediction[0])))