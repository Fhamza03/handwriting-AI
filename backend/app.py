from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Application des réseaux de neurones pour la reconnaissance d'écriture manuscrite!"

if __name__ == "__main__":
    app.run(debug=True)
