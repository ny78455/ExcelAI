from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # allow frontend to call APIs

    # Register Blueprints
    from app.routes.interview import interview_bp
    from app.routes.report import report_bp

    app.register_blueprint(interview_bp, url_prefix="/api/interview")
    app.register_blueprint(report_bp, url_prefix="/api/report")

    @app.route("/")
    def home():
        return {"message": "Excel AI Interviewer Backend (Flask) is running 🚀"}

    return app
