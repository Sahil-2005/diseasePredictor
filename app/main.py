from fastapi import FastAPI
from api.predict import router as predict_router

app = FastAPI(title="Crop Disease ML Service")

app.include_router(predict_router, prefix="/predict")
