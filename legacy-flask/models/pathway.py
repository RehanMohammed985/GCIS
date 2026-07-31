from datetime import datetime
from extensions import db


class Pathway(db.Model):
    __tablename__ = 'pathways'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='pathways')
    career = db.relationship('Career')
    steps = db.relationship('PathwayStep', back_populates='pathway', order_by='PathwayStep.order')

    def __repr__(self):
        return f'<Pathway user={self.user_id} career={self.career_id}>'


class PathwayStep(db.Model):
    __tablename__ = 'pathway_steps'

    id = db.Column(db.Integer, primary_key=True)
    pathway_id = db.Column(db.Integer, db.ForeignKey('pathways.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    order = db.Column(db.Integer, nullable=False, default=0)
    is_completed = db.Column(db.Boolean, default=False)
    due_date = db.Column(db.Date)

    pathway = db.relationship('Pathway', back_populates='steps')

    def __repr__(self):
        return f'<PathwayStep {self.title}>'
