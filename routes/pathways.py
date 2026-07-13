from flask import Blueprint, render_template
from flask_login import login_required, current_user
from models.pathway import Pathway

pathways_bp = Blueprint('pathways', __name__, url_prefix='/pathways')


@pathways_bp.route('/')
@login_required
def my_pathways():
    pathways = Pathway.query.filter_by(user_id=current_user.id).all()
    return f"My pathways - {len(pathways)} pathways loaded (template coming soon)"
