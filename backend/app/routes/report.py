from flask import Blueprint, jsonify
from app.services.report_service import generate_report

report_bp = Blueprint("report", __name__)

@report_bp.route("/", methods=["GET"])
def report():
    return jsonify(generate_report())
