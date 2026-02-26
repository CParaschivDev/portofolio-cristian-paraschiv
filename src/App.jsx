import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeSection, setActiveSection] = useState('about')

  const projects = [
    {
      title: 'Exploratory Data Analysis — Superstore 2019–2022',
      description:
        'Cleaned and analyzed a retail dataset (9,996 rows, 19 attributes) to uncover sales trends, profitability by category/region, and the impact of discounts. Applied missing-value checks, duplicate removal, outlier analysis, and log transformation to deliver actionable insights.',
      tags: ['Power BI', 'EDA', 'Data Cleaning'],
      link: 'https://www.youtube.com/watch?v=bTwgL6FEaE8&ab_channel=CristianParaschiv',
      linkLabel: 'View presentation',
      categories: ['Data', 'Visualization'],
      highlights: [
        'Audited data quality and resolved duplicates/outliers',
        'Built region and category insights for profitability',
        'Delivered actionable recommendations for pricing',
      ],
      caseStudy: {
        problem:
          'Stakeholders needed a clear view of sales trends, profit drivers, and discount impact across regions and categories.',
        solution:
          'Delivered a full EDA workflow with data cleansing, log transformation, and targeted visual analysis in Power BI.',
        impact:
          'Revealed pricing and regional strategy opportunities with practical recommendations.',
        stack: ['Power BI', 'Data Cleaning', 'EDA'],
      },
    },
    {
      title: 'Profit Forecasting with Ensemble Models',
      description:
        'Built and evaluated Random Forest and Gradient Boosting models to predict SuperStore profit, with full preprocessing, feature engineering, and metric-driven comparison (RMSE, MAE, R²).',
      tags: ['Python', 'Power BI', 'Random Forest', 'Gradient Boosting'],
      link: 'https://youtu.be/pR_8gQ6yyVc',
      linkLabel: 'View demo',
      categories: ['ML', 'Data'],
      highlights: [
        'Compared ensemble models with RMSE, MAE, and R2',
        'Engineered features for margin and discount impact',
        'Translated model results into business strategy',
      ],
      caseStudy: {
        problem:
          'Needed a reliable way to forecast profit and understand which variables drive performance.',
        solution:
          'Built Random Forest and Gradient Boosting pipelines with preprocessing, aggregation, and evaluation dashboards.',
        impact:
          'Identified the most stable model and clarified discount vs margin influence on profit.',
        stack: ['Python', 'Power BI', 'Random Forest', 'Gradient Boosting'],
      },
    },
    {
      title: 'Plant Leaf Disease Classification',
      description:
        'Built a custom residual CNN and fine-tuned EfficientNetV2 to classify 22 plant-leaf disease classes, with class weighting, Optuna tuning, and strong AUC/accuracy results.',
      tags: ['TensorFlow', 'Keras', 'EfficientNetV2', 'Optuna'],
      link: 'https://www.youtube.com/watch?v=Ta5A5H2d3yQ',
      linkLabel: 'View demo',
      categories: ['ML'],
      highlights: [
        '22-class classifier with 95%+ validation accuracy',
        'Class weighting to address imbalance',
        'Transfer learning vs custom CNN comparison',
      ],
      caseStudy: {
        problem:
          'Classify plant leaf diseases across 22 classes with high accuracy under class imbalance.',
        solution:
          'Trained a residual CNN and EfficientNetV2 with class weighting and Optuna tuning.',
        impact:
          'Achieved 95%+ validation accuracy and strong AUC across classes.',
        stack: ['TensorFlow', 'Keras', 'EfficientNetV2', 'Optuna'],
      },
    },
    {
      title: 'Explainable ML for Bank Marketing Campaigns',
      description:
        'End-to-end Streamlit app for predicting term-deposit subscriptions with LIME and SHAP explainability, model comparison, and batch prediction workflows.',
      tags: ['Streamlit', 'LIME', 'SHAP', 'Scikit-learn'],
      link: 'https://github.com/CParaschivDev/Explainable-ML-Bank-Marketing-Campaigns',
      linkLabel: 'View repo',
      categories: ['ML', 'Apps'],
      highlights: [
        'Local and global explanations (LIME, SHAP)',
        'Model comparison and ensemble confidence',
        'Batch upload with schema validation',
      ],
      caseStudy: {
        problem:
          'Marketing teams needed transparent predictions and a workflow they could trust and audit.',
        solution:
          'Delivered a Streamlit app with explainability, model comparison, batch scoring, and schema validation.',
        impact:
          'Improved decision confidence with interpretable predictions and downloadable reports.',
        stack: ['Streamlit', 'Scikit-learn', 'LIME', 'SHAP'],
      },
    },
  ]

  const filters = ['All', 'ML', 'Data', 'Apps', 'Visualization']

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects
    return projects.filter((project) => project.categories.includes(activeFilter))
  }, [activeFilter, projects])

  useEffect(() => {
    const sections = ['about', 'projects', 'skills', 'contact']
    const observers = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const skillGroups = [
    {
      title: 'Machine Learning',
      skills: [
        'Scikit-learn',
        'TensorFlow',
        'Keras',
        'Model Evaluation',
        'Feature Engineering',
        'Imbalanced Learning',
        'Explainability (SHAP, LIME)',
      ],
    },
    {
      title: 'Data & Analytics',
      skills: [
        'Python',
        'Pandas',
        'NumPy',
        'SQL',
        'Power BI',
        'Data Visualization',
        'Exploratory Analysis',
      ],
    },
    {
      title: 'Apps & Delivery',
      skills: [
        'Streamlit',
        'React',
        'Vite',
        'API Integration',
        'Automation',
        'Git & GitHub',
      ],
    },
    {
      title: 'Product & UX',
      skills: [
        'Dashboard Design',
        'Information Architecture',
        'User-Centered Design',
        'Responsive Layouts',
        'Presentation Storytelling',
      ],
    },
  ]

  return (
    <div className="page">
      <header className="nav">
        <div className="brand">Cristian Paraschiv</div>
        <nav className="nav-links">
          <a
            href="#about"
            className={activeSection === 'about' ? 'nav-active' : ''}
          >
            About
          </a>
          <a
            href="#projects"
            className={activeSection === 'projects' ? 'nav-active' : ''}
          >
            Projects
          </a>
          <a
            href="#skills"
            className={activeSection === 'skills' ? 'nav-active' : ''}
          >
            Skills
          </a>
          <a
            href="#contact"
            className={activeSection === 'contact' ? 'nav-active' : ''}
          >
            Contact
          </a>
        </nav>
        <a className="nav-cta" href="mailto:paraschiv.cristian93@outlook.com">
          Let's talk
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Data & ML Developer • Analytics</p>
            <h1>
              Building reliable ML systems and dashboards that drive decisions.
            </h1>
            <p className="hero-subtitle">
              I help teams move from raw data to clear actions. My work blends
              machine learning, explainability, and clean interfaces so results
              are understandable and usable.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#projects">
                View projects
              </a>
              <a className="btn ghost" href="#contact">
                Quick contact
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <span className="stat">8+</span>
                <span className="stat-label">applied ML projects</span>
              </div>
              <div>
                <span className="stat">4+</span>
                <span className="stat-label">model families</span>
              </div>
              <div>
                <span className="stat">100%</span>
                <span className="stat-label">explainability focus</span>
              </div>
            </div>
          </div>
          <div className="hero-card" aria-hidden="true">
            <div className="card-header">
              <span>Recent project</span>
              <span className="dot" />
            </div>
            <h3>Explainable ML</h3>
            <p>Transparent predictions with LIME/SHAP and audit-ready outputs.</p>
            <div className="card-tags">
              <span>Streamlit</span>
              <span>SHAP</span>
              <span>MLOps</span>
            </div>
          </div>
        </section>

        <section id="about" className="section about">
          <div>
            <h2>About me</h2>
            <p>
              I specialize in explainable ML, predictive modeling, and decision
              support dashboards. My focus is accuracy, clarity, and practical
              impact for stakeholders.
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <h3>Working style</h3>
              <p>Structured delivery, clear documentation, and measurable outcomes.</p>
            </div>
            <div className="about-card">
              <h3>Focus</h3>
              <p>Explainable models, evaluation rigor, and trustworthy insights.</p>
            </div>
            <div className="about-card">
              <h3>Collaboration</h3>
              <p>Transparent progress, review checkpoints, and stakeholder alignment.</p>
            </div>
          </div>
        </section>

        <section id="projects" className="section projects">
          <div className="section-head">
            <h2>Selected projects</h2>
            <p>
              A focused set of projects that highlight my data, ML, and product
              thinking.
            </p>
          </div>
          <div className="project-filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-chip ${
                  activeFilter === filter ? 'active' : ''
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <article key={project.title} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul className="project-highlights">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <a href={project.link} className="project-link">
                    {project.linkLabel}
                  </a>
                  <button
                    type="button"
                    className="project-cta"
                    onClick={() => setSelectedProject(project)}
                  >
                    Case study
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        {selectedProject ? (
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-card">
              <div className="modal-header">
                <h3>{selectedProject.title}</h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <span className="modal-label">Problem</span>
                  <p>{selectedProject.caseStudy.problem}</p>
                </div>
                <div>
                  <span className="modal-label">Solution</span>
                  <p>{selectedProject.caseStudy.solution}</p>
                </div>
                <div>
                  <span className="modal-label">Impact</span>
                  <p>{selectedProject.caseStudy.impact}</p>
                </div>
                <div>
                  <span className="modal-label">Stack</span>
                  <div className="modal-tags">
                    {selectedProject.caseStudy.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={selectedProject.link}
                  className="btn primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedProject.linkLabel}
                </a>
              </div>
            </div>
          </div>
        ) : null}

        <section id="skills" className="section skills">
          <div className="section-head">
            <h2>Skills</h2>
            <p>A focused stack that supports end-to-end ML delivery.</p>
          </div>
          <div className="skills-cards">
            {skillGroups.map((group) => (
              <div key={group.title} className="skills-card">
                <h3>{group.title}</h3>
                <div className="skills-grid">
                  {group.skills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <div>
            <h2>Contact</h2>
            <p>Have a project or idea? Send a message and let's talk.</p>
          </div>
          <div className="contact-card">
            <div>
              <span className="contact-label">Email</span>
              <a href="mailto:paraschiv.cristian93@outlook.com">
                paraschiv.cristian93@outlook.com
              </a>
            </div>
            <div>
              <span className="contact-label">GitHub</span>
              <a href="https://github.com/CParaschivDev" target="_blank" rel="noreferrer">
                github.com/CParaschivDev
              </a>
            </div>
            <div>
              <span className="contact-label">LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/cristian-constantin-paraschiv-6002b0257/"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/cristian-constantin-paraschiv-6002b0257
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© 2026 Cristian Paraschiv. All rights reserved.</span>
      </footer>
    </div>
  )
}

export default App
