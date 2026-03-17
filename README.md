Buenas profe, lo más "complejo" que es el reporte lo genera de esta manera: en postman a la hora de darle en send, en lugar de solo enviarlo, presione send and download y se le guardará el archivo .xlsx. El .env para el auth es el siguiente:
El usuario admin para el ejemplo del trabajo es:
admin@gestor.local con contraseña : Admin1234!
NODE_ENV=development
PORT=3005
 
# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5439
DB_NAME=gestorCOPEREXDb
DB_USERNAME=postgres
DB_PASSWORD=root
DB_SQL_LOGGING=false
 
# JWT Configuration
JWT_SECRET=MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=GestorCOPEREX
JWT_AUDIENCE=GestorCOPEREX
 
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENABLE_SSL=true
SMTP_USERNAME=angelgeovannyvinasco@gmail.com
SMTP_PASSWORD=cvni eisi nwwd lqyt
EMAIL_FROM=angelgeovannyvinasco@gmail.com
EMAIL_FROM_NAME=Gestion COPEREX
 
# Cloudinary (upload de perfiles)
CLOUDINARY_CLOUD_NAME=dsvdzokcg
CLOUDINARY_API_KEY=982363467631838
CLOUDINARY_API_SECRET=s3-co7KeqtQYqSxPGnQzWDNxbKM
CLOUDINARY_BASE_URL=https://res.cloudinary.com/dsvdzokcg/image/upload/
CLOUDINARY_FOLDER=gestionCOPEREX/image
CLOUDINARY_DEFAULT_AVATAR_FILENAME=default-avatar_ewzxwx.png
 
# File Upload
UPLOAD_PATH=./uploads
 
# Frontend URL
FRONTEND_URL=http://localhost:5173
 
# Security
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ADMIN_ALLOWED_ORIGINS=http://localhost:5173
 
# Verification Tokens (en horas)
VERIFICATION_EMAIL_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1



//////////////////////


El .env para gestorCOPEREX:
NODE_ENV = development
PORT = 3006

URI_MONGO = mongodb://localhost:27017/gestorCOPEREXDb

JWT_SECRET = MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!
JWT_ISSUER = GestorCOPEREX
JWT_AUDIENCE = GestorCOPEREX

# Cloudinary
CLOUDINARY_CLOUD_NAME=dsvdzokcg
CLOUDINARY_API_KEY=982363467631838
CLOUDINARY_API_SECRET=s3-co7KeqtQYqSxPGnQzWDNxbKM
CLOUDINARY_BASE_URL=https://res.cloudinary.com/dsvdzokcg/image/upload/
CLOUDINARY_FOLDER=gestionCOPEREX/image/upload/posts

Funcionaba todo en mi compu.