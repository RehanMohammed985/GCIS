from flask import Blueprint, render_template
from flask_login import login_required
from models.career import AssessmentQuestion

assessment_bp = Blueprint('assessment', __name__, url_prefix='/assessment')


@assessment_bp.route('/')
@login_required
def start():
    questions = AssessmentQuestion.query.all()
    return f"Assessment page - {len(questions)} questions loaded (template coming soon)"
