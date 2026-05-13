.PHONY: install dev seed test lint

install:
    cd frontend && npm install
    cd backend && pip install -r requirements.txt

dev:
    cd frontend && npm run dev &
    cd backend && uvicorn app.main:app --reload --port 8000

seed:
    cd backend && python scripts/seed_products.py

test:
    cd backend && pytest tests/ -v
    cd e2e && npx playwright test

lint:
    cd frontend && npx next lint
    cd backend && ruff check app/

clean:
    rm -rf frontend/node_modules frontend/.next
    rm -rf backend/__pycache__ backend/*.egg-info