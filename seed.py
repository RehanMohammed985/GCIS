from extensions import db
from models.career import Career, Skill, CareerSkill, AssessmentQuestion


def seed_data(app):
    # Only seed if the database is empty, so we don't duplicate data every restart
    if Career.query.first():
        return

    print("Seeding starter data...")

    # A couple of sample skills
    python_skill = Skill(name='Python')
    research_skill = Skill(name='Research')
    db.session.add_all([python_skill, research_skill])

    # A sample career
    data_analyst = Career(
        title='Data Analyst',
        description='Analyzes data to help organizations make decisions.',
        salary_range='$60,000 - $90,000',
        job_outlook='Growing faster than average',
        visa_notes='Commonly sponsored for OPT/CPT students.'
    )
    db.session.add(data_analyst)
    db.session.flush()  # so data_analyst.id exists before linking

    db.session.add(CareerSkill(career_id=data_analyst.id, skill_id=python_skill.id))
    db.session.add(CareerSkill(career_id=data_analyst.id, skill_id=research_skill.id))

    # A sample quiz question
    db.session.add(AssessmentQuestion(
        question_text='Do you enjoy working with numbers and spreadsheets?',
        related_skill_id=python_skill.id
    ))

    db.session.commit()
    print("Seeding complete.")
