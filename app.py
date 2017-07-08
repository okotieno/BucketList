from flask import Flask, render_template, json, request


from flask.ext.mysql import MySQL

#We need this for hashing our password before saving it in the database
from werkzeug import generate_password_hash, check_password_hash
mysql = MySQL()

app = Flask(__name__)

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
            _hashed_password = generate_password_hash(_password)
            cursor.callproc('sp_loginUser', (_email, _hashed_password))

            data = cursor.fetchall()
            return json.dumps({'login': str(data)})
        else:
            return json.dumps({'html': '<span>Enter the required fields</span>'})


    except Exception as e:

        return json.dumps({'error': str(e)})

    finally:

        cursor.close()

        conn.close()


@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    try:

        _name = request.form['inputName']
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']

        # validate the received values
        if _name and _email and _password:
            # All Good, let's call MySQL

            conn = mysql.connect()
            cursor = conn.cursor()
            _hashed_password = generate_password_hash(_password)
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

        cursor.close()

        conn.close()


if __name__ == "__main__":
    app.run(port=5002)