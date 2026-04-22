# CoShift Backend

## Prerequisites
- Python 3.10+ or 3.11+
- pip
- (optional) virtualenv

## Getting Started

1. Create and activate a virtual environment
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env and fill in your values
```

4. Start the backend
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Running with Docker
```bash
docker-compose up --build
```

## Notes
- API will be available at `http://localhost:8000`
- Use `localhost:8000/docs` for Swagger UI
