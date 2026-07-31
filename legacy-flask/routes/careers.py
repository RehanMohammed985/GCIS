from flask import Blueprint, render_template
from models.career import Career

careers_bp = Blueprint('careers', __name__, url_prefix='/careers')


@careers_bp.route('/')
def list_careers():
    careers = Career.query.all()
    return f"Careers page - {len(careers)} careers loaded (template coming soon)"


@careers_bp.route('/<int:career_id>')
def career_detail(career_id):
    career = Career.query.get_or_404(career_id)
    return f"Career detail: {career.title} (template coming soon)"
