# url-shortener-backend

PROJECT SETUP 

Your will need 

1 Database installed (PostgreSQL,MySQL), and maybe PgAdmin or your favorite GUI for easy database interaction

 Then clone the repository

- git clone https://github.com/Jeanndo/url-shortener-backend
- cd url-shortener-backend
- npm install (to install dependences from package.json)
- create .env file and add variables available in .env.example then customize accordingly.
- npm run start:dev (to start the development server)
- npm run create (to create database)
- npm run migrate (to insert table migration into the database)

# API testing

 - Authentication
 
   - POST: /api/v1/users/auth/register : registering a new user
   - POST: /api/v1/users/auth/login : login when a user is registered

 - URL SHORTENING AND LISTING
    - POST: /api/v1/urls/shorten  : shortening a long url
    - GET: /api/v1/urls/  : get all individual urls
    - GET: /api/v1/urls//analytics/:shortUrl : get a url analytics (this includes clicks and devices visited a url)
    - GET: /api/v1/urls/:code  : this api will redirect a user to original url NB: code is short url
    
 
# SECURITY

  - CSRF PROTECTION
     - GET: /api/v1/csrf  : this api sends csrf token on frontend and get back on every request from client and get verified on backend
