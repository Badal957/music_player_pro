🚀 The Ultimate Setup Guide: Running StudioPro Locally

Before you begin, ensure your system has the following core tools installed:

    Python (3.8 or higher): For the Django backend.

    Node.js (v14 or higher): For the React frontend.

    Git: To clone the repository.

Step 1: Clone the Project

First, download the code to your local machine and navigate into the project folder.

git clone https://github.com/yourusername/studiopro.git
cd studiopro

Step 2: Set Up the Backend (Django)

The backend requires an isolated Python environment and a few specific libraries to handle audio metadata, secure APIs, and cross-origin requests.

1. Create and activate a virtual environment:
If you are on Windows (PowerShell):

python -m venv myenv
.\myenv\Scripts\Activate.ps1

(If you are on Mac/Linux, use: source myenv/bin/activate)

2. Install the required Python libraries:
Run the following command to install the exact stack used for this project:

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mutagen django-filter

    *.django & djangorestframework: The core backend framework and API builder.

    *.djangorestframework-simplejwt: Handles the secure, expiring login tokens (the 401 Unauthorized fix!).

    *.django-cors-headers: Allows your React app on port 3000 to talk to Django on port 8000.

    *.mutagen: The audio engineering library that reads ID3 tags (duration, artist) from your MP3/WAV files.

    *.django-filter: Enables the advanced search and filtering in your API views.

3. Build the Database (The Digital Ledger):
Run the migrations to create the SQLite database tables (Songs, Users, Purchases).

python manage.py makemigrations
python manage.py migrate

4. Create an Admin Account:
You need a superuser account to log into the backend and upload your first songs.

python manage.py createsuperuser

5. Start the Server:

python manage.py runserver

Your backend is now securely running at http://127.0.0.1:8000.

Step 3: Set Up the Frontend (React)

Open a new, second terminal window (leave the Django server running in the first one) and navigate to the frontend folder.

1. Navigate to the frontend directory:


cd frontend


2. Install the Node modules:
This will read your package.json file and download everything React needs (including Tailwind CSS and React Router).

npm install

3. Start the React Application:

npm start

Your frontend will boot up and automatically open in your browser at http://localhost:3000.


Step 4: Your First Run (Testing the App)

To verify everything is fully connected, follow this exact loop:

    Upload Audio: Go to http://127.0.0.1:8000/admin, log in with your superuser account, and add a few tracks to the Songs database. Leave at least one track unchecked for "Is free" so it is locked.

    Create a User: Go to http://localhost:3000/register and create a test account.

    Test the Simulator: Go to your Studio Player, click the locked track, and use the test credit card 4242 4242 4242 4242 to bypass the Luhn Algorithm and unlock the track.

    Test the Engine: Hit play and watch the Web Audio API visualizer react in real-time!
