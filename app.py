# Om Vighneswaraya Namaha

from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "superdupersecret"

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(25), nullable=False)
    snippets = db.relationship('Snippet', backref='author', lazy=True)


class Snippet(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    name = db.Column(db.String(25), nullable=False)
    html = db.Column(db.Text, default="")
    css = db.Column(db.Text, default="")
    js = db.Column(db.Text, default="")
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        if User.query.filter_by(username=username).first():
            flash("Username is taken.")
            return redirect(url_for('register'))

        if email != '' and User.query.filter_by(email=email).first():
            flash("Account with this email is already registered. Please log in.")
            return redirect(url_for('register'))

        if email == '':
            email = None

        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()

        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if not user:
            flash("User with username " + username + " does not exist.")
            return redirect(url_for('login'))

        if user.password != password:
            flash("Password is incorrect, please try again.")
            return redirect(url_for('login'))

        session['user'] = username

        flash("Successfully logged in.")
        return redirect(url_for('home'))

    if 'user' in session:
        flash("You are already logged in.")
        return redirect(url_for('home'))

    return render_template('login.html')


@app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user', None)
        flash("Succesfully logged out.")
    else:
        flash("You are not logged in.")

    return redirect(url_for('home'))


@app.route('/new-snippet')
def new_snippet():
    if 'user' not in session:
        flash("You must be logged in to create a new snippet.")
        return redirect(url_for('home'))

    snippet = Snippet(name="New Snippet", author_id=User.query.filter_by(username=session['user']).first().id)

    db.session.add(snippet)
    db.session.commit()
    
    return redirect(url_for('snippet', snippet_id=snippet.id))


@app.route('/snippet/<snippet_id>')
def snippet(snippet_id):
    snippet = Snippet.query.filter_by(id=snippet_id).first()
    return render_template('snippet.html', html=snippet.html, css=snippet.css, js=snippet.js)


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
