# Om Vighneswaraya Namaha

from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    password = db.Column(db.String(25), nullable=False)
    snippets = db.relationship('Snippet', backref='author', lazy=True)


class Snippet(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    snippet_name = db.Column(db.String(25), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        pass
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if not user:
            flash("User with username " + username + " does not exist.")
            return redirect('login')

        if user.password != password:
            flash("Password is incorrect, please try again.")
            return redirect('login')

        request.session['user'] = username

    if 'user' in request.session:
        flash("You are already logged in.")
        return redirect('home')

    return render_template('login.html')

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
