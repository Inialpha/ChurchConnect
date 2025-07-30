# Church Management API

A comprehensive FastAPI backend application for managing churches, ministers, and authentication using MySQL, SQLAlchemy, and OAuth2 with JWT tokens.

## Features

- **Complete CRUD operations** for Churches, Ministers, and Admins
- **OAuth2 authentication** with JWT tokens
- **MySQL database** with SQLAlchemy ORM
- **Clean, scalable project structure**
- **Public GET endpoints** for church and minister search
- **Protected POST/PUT/DELETE endpoints** requiring authentication
- **Search functionality** by name, state, and other criteria
- **Relationship management** between churches and ministers

## Project Structure

```
backend/
├── app/
│   ├── core/                 # Configuration and settings
│   │   ├── __init__.py
│   │   ├── settings.py       # Pydantic Settings class
│   │   └── database.py       # Database connection
│   ├── models/               # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── church.py
│   │   ├── minister.py
│   │   └── admin.py
│   ├── schemas/              # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── church.py
│   │   ├── minister.py
│   │   └── admin.py
│   ├── services/             # Business logic
│   │   ├── __init__.py
│   │   ├── church.py
│   │   ├── minister.py
│   │   └── admin.py
│   ├── routes/               # API routers
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── church.py
│   │   └── minister.py
│   ├── auth/                 # Authentication utilities
│   │   ├── __init__.py
│   │   └── utils.py
│   ├── __init__.py
│   └── main.py               # FastAPI app instance
├── requirements.txt
├── .env.example
└── README.md
```

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE church_db;
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=mysql+pymysql://your_username:your_password@localhost/church_db
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Run the Application

Start the development server:

```bash
# From the backend directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive docs**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new admin
- `POST /auth/login` - Login admin (returns JWT token)

### Churches (Public read, Protected write)
- `GET /churches/` - List all churches (supports filtering by state, name)
- `GET /churches/{id}` - Get specific church
- `POST /churches/` - Create church (🔒 Protected)
- `PUT /churches/{id}` - Update church (🔒 Protected)
- `DELETE /churches/{id}` - Delete church (🔒 Protected)

### Ministers (Public read, Protected write)
- `GET /ministers/` - List all ministers (supports filtering by church_id, name)
- `GET /ministers/{id}` - Get specific minister
- `POST /ministers/` - Create minister (🔒 Protected)
- `PUT /ministers/{id}` - Update minister (🔒 Protected)
- `DELETE /ministers/{id}` - Delete minister (🔒 Protected)

## Data Models

### Church
- **Basic Info**: name, description, year_established
- **Location**: state, lga, community, address
- **Contact**: website, email, phone, facebook, youtube
- **Structure**: services (JSON array), programs (JSON array)
- **Relationships**: ministers (one-to-many)

### Minister
- **Personal**: first_name, last_name, email, phone, bio, profile_picture
- **Professional**: role, education, experience, specializations
- **Social**: website, facebook
- **Church**: church_id (foreign key)

### Admin
- **Basic**: first_name, last_name, email
- **Security**: hashed_password

## Authentication Flow

1. **Register Admin**: `POST /auth/signup`
2. **Login**: `POST /auth/login` with email/password
3. **Receive JWT Token**: Use in Authorization header
4. **Access Protected Routes**: `Authorization: Bearer <token>`

## Usage Examples

### 1. Register Admin
```bash
curl -X POST "http://localhost:8000/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{
       "first_name": "John",
       "last_name": "Doe", 
       "email": "admin@example.com",
       "password": "securepassword"
     }'
```

### 2. Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=admin@example.com&password=securepassword"
```

### 3. Create Church (Protected)
```bash
curl -X POST "http://localhost:8000/churches/" \
     -H "Authorization: Bearer <your_token>" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Grace Baptist Church",
       "description": "A community church serving since 1995",
       "year_established": 1995,
       "state": "Lagos",
       "lga": "Ikeja",
       "community": "Allen Avenue",
       "email": "info@gracebaptist.org",
       "services": [
         {"day": "Sunday", "time": "9:00 AM", "type": "Morning Service"},
         {"day": "Wednesday", "time": "6:00 PM", "type": "Bible Study"}
       ],
       "programs": ["Youth Ministry", "Women Fellowship"]
     }'
```

### 4. Search Churches (Public)
```bash
# Search by state
curl "http://localhost:8000/churches/?state=Lagos"

# Search by name
curl "http://localhost:8000/churches/?name=Baptist"
```

## Development Notes

- **Snake_case**: All Python variables and database fields use snake_case
- **Relationships**: Churches and Ministers are properly linked via foreign keys
- **Validation**: Pydantic models provide comprehensive request/response validation
- **Security**: Passwords are hashed using bcrypt, JWT tokens for authentication
- **CORS**: Enabled for all origins (configure for production)
- **Error Handling**: Comprehensive HTTP status codes and error messages

## Production Considerations

1. **Environment Variables**: Update SECRET_KEY and database credentials
2. **CORS**: Restrict allowed origins to your frontend domain
3. **Database**: Use connection pooling and proper indexing
4. **Logging**: Add proper logging configuration
5. **Rate Limiting**: Implement API rate limiting
6. **SSL**: Use HTTPS in production
7. **Database Migrations**: Consider using Alembic for schema migrations

## Technologies Used

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **MySQL**: Relational database
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **Passlib**: Password hashing library
- **Uvicorn**: ASGI server implementation
