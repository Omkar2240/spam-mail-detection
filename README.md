# 📧 Spam Mail Prediction using Logistic Regression

A full-stack machine learning project to detect whether an email is **Spam or Not Spam**, using **TF-IDF**, **Logistic Regression**, and integrated with a **Node.js backend** and **Next.js frontend**.

---

## 🧠 ML Model Overview

- **Algorithm**: Logistic Regression
- **Feature Extraction**: TfidfVectorizer (with stopword removal & lowercasing)
- **Dataset**: SMS Spam Collection Dataset ([Download](https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset))
- **Accuracy**: ~97%+

---

## 📁 Project Structure

```
spam-mail-detector/
│
├── backend/
│   ├── spam_model.pkl
│   ├── vectorizer.pkl
│   ├── predict.py
│   └── index.js
│
├── frontend/
│   └── (Next.js app here)
│
└── README.md
```

---

## 🛠 Installation

### Backend (Node.js + Python)
```bash
cd backend
npm install express cors
```

### Python Environment
```bash
pip install pandas scikit-learn joblib
```

---

---

## 🚀 Start Servers

### Backend
```bash
node backend/index.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Output
- `spam_model.pkl` - Trained Logistic Regression model
- `vectorizer.pkl` - TF-IDF feature extractor
