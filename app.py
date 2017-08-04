"""
    The innovative bucketlist app is an application that allows users  to
    record and share things they want to achieve or experience before
    reaching a certain age meeting the needs of keeping track of their
    dreams and goals
"""

class BucketList:
    def __init__(self, bl_username, bl_name=None):
        self.bl_name = bl_name
        self.conn = mysql.connect()
        self.cursor = conn.cursor()
        self.bl_category_user_id = None
        self.username = bl_username[1]
        self.get_user_id()

    def get_user_id(self):

        self.bl_category_user_id = 1
        global conn, cursor
        try:
            conn = mysql.connect()
            cursor = conn.cursor()

            cursor.callproc('sp_user_id', [self.username])


            #
            data = cursor.fetchall()

            #
            self.bl_category_user_id = data[0][0]

            return json.dumps({'user_id': self.bl_category_user_id})

        except Exception as e:

            return json.dumps({'error': str(e)})

        finally:
            cursor.close()
            conn.close()

    def add_category(self):
        try:
            global conn, cursor
            conn = mysql.connect()
            cursor = conn.cursor()

            #return json.dumps({'id': self.bl_category_user_id,'name':self.bl_name})

            cursor.callproc('sp_Add_Bl_Category', (self.bl_name, self.bl_category_user_id))


            data = cursor.fetchall()

            if len(data) is 0:
                conn.commit()
                return json.dumps({'message': 'Category Created successfully !'})
            else:
                return json.dumps({'error': str(data[0])})
        except Exception as e:

            return json.dumps({'error': str(e)})

        finally:
            cursor.close()
            conn.close()

    def edit_category(self):
        self.bl_name  = "Set to database"

    def delete_category(self):
        self.bl_name = "Set to database"

    def add_activity(self,bl_id, bl_activity_name):
        try:
            global conn, cursor
            conn = mysql.connect()
            cursor = conn.cursor()

            # return json.dumps({'id': self.bl_category_user_id,'name':self.bl_name})

            cursor.callproc('sp_Add_Bl_Activity', ( bl_activity_name, bl_id))

            data = cursor.fetchall()

            if len(data) is 0:
                conn.commit()
                return json.dumps({'message': 'Activity Created successfully !'})
            else:
                return json.dumps({'error': str(data[0])})
        except Exception as e:

            return json.dumps({'error': str(e)})

        finally:
            cursor.close()
            conn.close()

    def delete_activity(self):
        self.bl_name = "Set to database"

    def edit_activity(self):
        self.bl_name = "Set to database"


# session will be used to set a session for a user
# json will be used to return data to the browser

from flask import Flask, render_template, json, request, session

# Library for using MySQL
from flask.ext.mysql import MySQL

# We need this for hashing our password before saving it in the database
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

@app.route('/showBucketListEdit')
def showBucketListEdit():
    return render_template('bucketListManagement.html')



@app.route('/')
def main():
    return render_template('index.html')


@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')


@app.route('/showBucketListView')
@app.route('/showHome')
def showHome():
    return render_template('home.html')


@app.route('/showSignIn')
def showSignIn():
    return render_template('signin.html')


# Set up the check for Sign In

@app.route('/getsession')
def getsession():
    try:
        if session['bl_user'] == None:
            return json.dumps({'loggedin': 0})
        elif 'bl_user' in session:
            return json.dumps({'loggedin': 1, 'user': session['bl_user']})
        else:
            return json.dumps({'loggedin': 0})
    except Exception as e:
        return json.dumps({'error': str(e)})


@app.route('/allActivity', methods=['POST', 'GET'])
def allActivity():
    _id = request.form['id']
    return json.dumps({'empty_data': 1, 'data': _id})


@app.route('/allBlCategory')
def allBlCategory():
    global conn, cursor
    try:
        conn = mysql.connect()
        cursor = conn.cursor()

        cursor.callproc('sp_all_bl_category', [session['bl_user'][0]])
        data = cursor.fetchall()
        if data[0][0] == 'Nothing Found !!':
            return json.dumps({'empty_data':1,'data': data})

        else:

            return json.dumps({'empty_data':0,'data': data})

    except Exception as e:
        return json.dumps({'empty_data':1,'error': str(e)})
    finally:
        cursor.close()
        conn.close()

@app.route('/addNewCategory', methods=['POST', 'GET'])
def addNewCategory():

    global conn, cursor
    try:

        _blNewName = request.form['bl_new_name']

        if _blNewName:
            myNewBucketList = BucketList(session['bl_user'], _blNewName)
            return myNewBucketList.add_category()

    except Exception as e:
        return json.dumps({'error': str(e)})

    finally:
        cursor.close()
        conn.close()

@app.route('/addNewActivity', methods=['POST', 'GET'])
def addNewActivity():

    _bl_id = request.form['bl_id']
    _bl_activity_new_name = request.form['bl_activity_new_name']

    if _bl_id and _bl_activity_new_name:
        myNewBucketList = BucketList(session['bl_user'])
        return myNewBucketList.add_activity(_bl_id,_bl_activity_new_name)

    #_date = request.form['date']
    #Date feature still pending



    return "okay";

@app.route('/logOut')
def logOut():
    session['bl_user'] = None
    return json.dumps({'logged_in': '0'})

@app.route('/signIn', methods=['POST', 'GET'])
def signIn():
    global conn, cursor
    try:
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']

        # validate the received values
        if _email and _password:
            conn = mysql.connect()
            cursor = conn.cursor()

            # Hash the password before saving it to the database
            _hashed_password = hashlib.md5(_password.encode('utf-8')).hexdigest()
            cursor.callproc('sp_loginUser', (_email, _hashed_password))

            data = cursor.fetchall()
            if data[0][0] == 'Invalid username or password !':
                return json.dumps({'loggedin': 0, 'user': data[0]})
            else:
                session['bl_user'] = data[0]
                return json.dumps({'loggedin': 1, 'user': data[0]})
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
    global conn, cursor
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


                #myNewBucketList = BucketList(session['bl_user'], _blNewName)

                #new_user_bucket_list = BucketList([1,_email])
                #user_id = new_user_bucket_list.get_user_id();

                #user_id = 1;

                #
                conn.commit()
                user_id = 1
                session['bl_user'] = [user_id, _email]
                new_user_bucket_list = BucketList(session['bl_user'])
                user_id = new_user_bucket_list.bl_category_user_id
                session['bl_user'] = [user_id, _email]

                return json.dumps({'message': 'User created successfully !','id':1})
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
            ""


if __name__ == "__main__":
    app.run(port=5006)
