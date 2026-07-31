from extensions import db


class Career(db.Model):
    __tablename__ = 'careers'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    salary_range = db.Column(db.String(100))
    job_outlook = db.Column(db.String(255))
    visa_notes = db.Column(db.Text)

    skills = db.relationship('CareerSkill', back_populates='career')

    def __repr__(self):
        return f'<Career {self.title}>'


class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    careers = db.relationship('CareerSkill', back_populates='skill')

    def __repr__(self):
        return f'<Skill {self.name}>'


class CareerSkill(db.Model):
    __tablename__ = 'career_skills'

    id = db.Column(db.Integer, primary_key=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)

    career = db.relationship('Career', back_populates='skills')
    skill = db.relationship('Skill', back_populates='careers')


class AssessmentQuestion(db.Model):
    __tablename__ = 'assessment_questions'

    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.Text, nullable=False)
    related_skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'))

    related_skill = db.relationship('Skill')

    def __repr__(self):
        return f'<AssessmentQuestion {self.id}>'
