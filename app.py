from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_lyrics')
def get_lyrics():
    lirik = [
        {"time": 0.8, "text": "She said, Careful, or you'll lose it"},
        {"time": 3.5, "text": "But, girl, I'm only human"},
        {"time": 6.5, "text": "And I know there's a blade where your heart is"},
        {"time": 9.5, "text": "And you know how to use it"},
        {"time": 12.5, "text": "And you can take my flesh if you want girl"},
        {"time": 15.5, "text": "But, baby, don't abuse it (Calm down)"},
        {"time": 19.0, "text": "These voices in my head screaming, Run now (Don't run)"},
        {"time": 21.5, "text": "I'm praying that they're human"},
    ]
    return jsonify(lirik)

if __name__ == '__main__':
    app.run(debug=True)