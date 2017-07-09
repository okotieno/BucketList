"""
    The innovative bucketlist app is an application that allows users  to
    record and share things they want to achieve or experience before
    reaching a certain age meeting the needs of keeping track of their
    dreams and goals
"""

# session will be used to set a session for a user
# json will be used to return data to the browser

from flask import Flask, render_template, json, request, session

#Library for using MySQL
from flask.ext.mysql import MySQL

#We need this for hashing our password before saving it in the database
import hashlib
import os

mysql = MySQL()

app = Flask(__name__)
app.secret_key = os.urandom(24)

# MySQL configurations

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'BucketList'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)

@app.route('/')
def main():
    return render_template('index.html')


@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')

@app.route('/showHome')
def showHome():
    return render_template('home.html?id = 1&page=200 ')

@app.route('/showSignIn')
def showSignIn():
    return render_template('signin.html')

# Set up the check for Sign In
@app.route('/signIn', methods=['POST', 'GET'])
def signIn():
    try:
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']

        # validate the received values
        if _email and _password:
            conn = mysql.connect()
            cursor = conn.cursor()

            #Hash the password before saving it to the database
            _hashed_password = hashlib.md5(_password.encode('utf-8')).hexdigest()
            cursor.callproc('sp_loginUser', (_email, _hashed_password))

            data = cursor.fetchall()
            session['bl_user'] = data
            return json.dumps({'login': str(data)})
        else:
            return json.dumps({'html': '<span>Enter the required fields</span>'})

    except Exception as e:

        return json.dumps({'error': str(e)})

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception as e:
            return json.dumps({'error': str(e)})

@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        _name = request.form['inputName']
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']

        # validate the received values
        if _name and _email and _password:
            # All Good, let's call MySQL

            _hashed_password = hashlib.md5(_password.encode('utf-8')).hexdigest()
            cursor.callproc('sp_createUser', (_name, _email, _hashed_password))

            data = cursor.fetchall()

            if len(data) is 0:
                conn.commit()
                return json.dumps({'message': 'User created successfully !'})
            else:
                return json.dumps({'error': str(data[0])})
        else:

            return json.dumps({'html': '<span>Enter the required fields</span>'})

    except Exception as e:

        return json.dumps({'error': str(e)})

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception as e:
            return json.dumps({'error': str(e)})


if __name__ == "__main__":
    app.run(port=5002)