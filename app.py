from flask import Flask
from config import Config
from extensions import db, login_manager
from models.user import User
from models.career import Career, Skill, CareerSkill, AssessmentQuestion
from models.pathway import Pathway, PathwayStep

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'

    from routes.auth import auth_bp
    from routes.main import main_bp
    from routes.assessment import assessment_bp
    from routes.careers import careers_bp
    from routes.pathways import pathways_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(assessment_bp)
    app.register_blueprint(careers_bp)
    app.register_blueprint(pathways_bp)

    with app.app_context():
        db.create_all()
        from seed import seed_data
        seed_data(app)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
