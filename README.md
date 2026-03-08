# 🎧 StudioPro: High-Fidelity Audio Engine & Digital Storefront

![StudioPro Banner](https://via.placeholder.com/1200x400/05050A/8A58FC?text=StudioPro+Architecture)

> A full-stack React and Django REST application demonstrating advanced Web Audio API integration, secure JWT authentication, and client-side financial transaction simulation.

## 🚀 Project Overview

StudioPro is a simulated premium digital audio platform built for portfolio demonstration and cybersecurity research. It goes beyond a standard media player by integrating a custom-built audio manipulation engine and a fully functional mock e-commerce gateway. 

The application architecture demonstrates how to securely manage digital assets, validate simulated financial data using standard cryptographic algorithms, and manipulate HTML5 audio nodes in real-time.

### ✨ Key Technical Features

* **Advanced Audio Engine (Web Audio API):** Bypasses the standard HTML5 audio player to route audio through a custom node graph, featuring a real-time frequency visualizer and a fully functional 3-band parametric EQ (Bass, Mid, Treble).
* **Financial Transaction Simulator:** Integrates a secure mock payment gateway utilizing the **Luhn Algorithm** for client-side credit card validation before processing API requests.
* **Secure Digital Ledger:** Backend `Purchase` models track unlocked assets tied securely to authenticated users, conditionally rendering premium UI states.
* **Automated Metadata Extraction:** Django backend utilizes the `mutagen` library to automatically extract ID3 tags (Title, Artist, Duration) from uploaded lossless audio files.
* **JWT Authentication:** Secure user sessions using JSON Web Tokens to protect premium API endpoints and media URLs.

---

## 🛠 Tech Stack

**Frontend:**
* React.js (Hooks, Context, React Router v6)
* Tailwind CSS (Glassmorphism, Custom Animations)
* Web Audio API (Canvas rendering, BiquadFilterNodes)

**Backend:**
* Python / Django
* Django REST Framework (DRF)
* SQLite (Easily swappable to PostgreSQL)
* Mutagen (Audio Metadata Extraction)

---

## ⚙️ Installation & Setup

Follow these steps to run the application and the simulated secure server locally.

### 1. Backend Setup (Django)

```bash
# Clone the repository
git clone [https://github.com/yourusername/studiopro.git](https://github.com/yourusername/studiopro.git)
cd studiopro/backend

# Create and activate a virtual environment (Windows/PowerShell)
python -m venv myenv
.\myenv\Scripts\Activate.ps1

# Install required dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mutagen django-filter

# Apply database migrations to build the secure ledger
python manage.py makemigrations
python manage.py migrate

# Create a superuser to access the Admin Panel
python manage.py createsuperuser

# Start the development server
python manage.py runserver


2. Frontend Setup (React)

Open a new terminal window and navigate to the frontend directory:

cd studiopro/frontend

# Install node modules
npm install

# Start the React development server
npm start

🧪 Testing the Financial Simulator

To fully experience the e-commerce loop, follow these steps:

    Log into the React application and navigate to the Library.

    Click on a track marked with the golden LOCKED badge.

    Click Unlock. The secure checkout modal will appear.

    Validation Test: Enter any random 16-digit number. The client-side Luhn Algorithm will actively block the transaction and throw an error.

    Success Test: Enter a mathematically valid test card (e.g., 4242 4242 4242 4242). The system will process the simulated payment, post the token to the Django API, record the transaction in the ledger, and permanently unlock the track for your user account.


📁 Core Project Structure


studiopro/
├── backend/                  # Django REST API
│   ├── api/
│   │   ├── models.py         # Includes Song, Album, Playlist, & Purchase Ledger
│   │   ├── serializers.py    # Calculates dynamic 'has_purchased' states
│   │   ├── views.py          # Secure transaction endpoints
│   │   └── urls.py
│   └── studiopro_core/       # Core Django settings (CORS, JWT)
│
└── frontend/                 # React Application
    ├── src/
    │   ├── pages/
    │   │   ├── StudioPlayer.jsx    # Web Audio API engine & Visualizer
    │   │   ├── SongDetailPage.jsx  # Mock Payment Gateway (Luhn validation)
    │   │   ├── ProfilePage.jsx     # Digital Ledger & User Stats
    │   │   ├── SignupPage.jsx      # Strict Regex validation
    │   │   └── LoginPage.jsx       
    │   └── App.jsx
    └── tailwind.config.js



⚠️ Disclaimer

This application is a simulation built for educational and research purposes. No real financial transactions are processed on this platform. The payment gateway is a controlled local simulator designed specifically for testing security logic and client-side validation routing. Do not enter real credit card information or sensitive data into this environment.


***





