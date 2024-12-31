from flask import Flask, request, jsonify
import easyocr
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Activer les CORS pour permettre les requêtes depuis le front-end

# Définir le dossier pour sauvegarder les fichiers uploadés
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return "Application des réseaux de neurones pour la reconnaissance d'écriture manuscrite!"

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Vérifiez si un fichier est envoyé avec la requête
        if 'image' not in request.files:
            return jsonify({'error': 'Aucune image téléchargée'}), 400

        # Récupérez le fichier et sauvegardez-le temporairement
        file = request.files['image']
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        print(f"Image saved at {file_path}")

        # Initialisez EasyOCR et traitez l'image
        reader = easyocr.Reader(['en'], gpu=False)
        result = reader.readtext(file_path)
        print(f"EasyOCR Result: {result}")

        # Extraire et concaténer le texte détecté
        if result:
            extracted_text = ' '.join([text for _, text, _ in result])
            response = jsonify({'text': extracted_text})
            print(f"Response sent to front-end: {response.json}")
            return response, 200
        else:
            return jsonify({'text': 'Aucun texte détecté'}), 200

    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
