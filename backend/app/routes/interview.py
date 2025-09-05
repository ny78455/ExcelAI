from flask import Blueprint, request, jsonify
from app.services.interview_service import process_interview

interview_bp = Blueprint("interview", __name__)

@interview_bp.route("/", methods=["POST"])
def interview():
    data = request.json
    response = process_interview(data.get("user_message", ""))
    return jsonify(response)
