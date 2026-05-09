import { useEffect, useMemo, useState, useRef } from 'react'
import './App.css'

const MatrixBackground = ({ darkMode }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>_'.split('')
    const fontSize = 14
    const columns = width / fontSize
    const drops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = darkMode ? 'rgba(0, 5, 10, 0.08)' : 'rgba(255, 250, 240, 0.08)'
      ctx.fillRect(0, 0, width, height)
      
      ctx.fillStyle = darkMode ? '#00f3ff' : '#ff6600'
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [darkMode])

  return <canvas ref={canvasRef} className="matrix-canvas" />
}

const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  
  useEffect(() => {
    let iteration = 0
    let interval = null
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\\\/[]{}—=+*^?#________'
    
    const scramble = () => {
      interval = setInterval(() => {
        setDisplayText((_) => {
          return text
            .split('')
            .map((char, index) => {
              if (index < iteration) return text[index]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        })

        if (iteration >= text.length) clearInterval(interval)
        iteration += 1 / 3
      }, 30)
    }

    if (isHovering) {
      scramble()
    } else {
      setDisplayText(text)
    }

    return () => clearInterval(interval)
  }, [text, isHovering])

  return (
    <span 
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => setIsHovering(false)}
      style={{ cursor: 'crosshair', display: 'inline-block' }}
    >
      {displayText}
    </span>
  )
}

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let frameId

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      const isInteractive = e.target.closest(
        'a, button, input, textarea, select, [role="button"], .project-card, .skill-bar-container, .filter-chip'
      )

      document.documentElement.classList.toggle(
        'cursor-interactive',
        Boolean(isInteractive)
      )

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      }
    }

    const render = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      }
      frameId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMouseMove)
    frameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(frameId)
      document.documentElement.classList.remove('cursor-interactive')
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor-dot"></div>
      <div ref={ringRef} className="cursor-ring"></div>
    </>
  )
}

const SystemHUD = () => {
  const [cpu, setCpu] = useState(12)
  const [mem, setMem] = useState(45)
  const [net, setNet] = useState(0)

  useEffect(() => {
    const int = setInterval(() => {
      setCpu(Math.floor(Math.random() * 30) + 15)
      setMem(Math.floor(Math.random() * 15) + 60)
      setNet(Math.floor(Math.random() * 999))
    }, 1500)
    return () => clearInterval(int)
  }, [])

  return (
    <div className="sys-hud-overlay">
      <div className="sys-hud-row">
        <span>CPU</span>
        <div className="sys-hud-bar"><div className="sys-hud-fill" style={{ width: `${cpu}%` }}></div></div>
        <span className="sys-hud-val">{cpu}%</span>
      </div>
      <div className="sys-hud-row">
        <span>MEM</span>
        <div className="sys-hud-bar"><div className="sys-hud-fill" style={{ width: `${mem}%` }}></div></div>
        <span className="sys-hud-val">{mem}%</span>
      </div>
      <div className="sys-hud-row">
        <span>NET</span>
        <span style={{flex: 1}}>UPLINK_OK</span>
        <span className="sys-hud-val">{net}B</span>
      </div>
    </div>
  )
}

const MissionRail = ({ activeSection, sections, onNavigate }) => {
  const activeIndex = Math.max(
    sections.findIndex((section) => section.id === activeSection),
    0
  )
  const progress = sections.length > 1
    ? (activeIndex / (sections.length - 1)) * 100
    : 0

  return (
    <aside className="mission-rail" aria-label="Mission navigation">
      <div className="mission-rail-title">MISSION MAP</div>
      <div className="mission-track" aria-hidden="true">
        <span style={{ height: `${progress}%` }} />
      </div>
      <div className="mission-items">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`mission-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onNavigate(section.id)}
          >
            <span className="mission-code">{section.code}</span>
            <span className="mission-dot" aria-hidden="true" />
            <span className="mission-label">{section.label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

const projectsData = {
  en: [
    {
      title: '3Ks Judo Club Website',
      description:
        'Volunteer Full-Stack Web Developer project - built the official club website from scratch with domain registration, cloud hosting, DNS configuration, and performance optimization.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'WebP', 'Lazy Loading'],
      link: 'https://3ksjudo.co.uk',
      linkLabel: 'View live site',
      categories: ['Apps', 'Web'],
      metrics: ['30% faster load', 'WebP optimization', 'Interactive modules'],
      highlights: [
        'Full-stack development with HTML5, CSS3, JavaScript, and PHP',
        'Domain registration, cloud hosting, and DNS configuration',
        'Performance optimization with WebP assets and lazy loading',
        'Interactive modules: maps, grading info, media gallery',
      ],
      caseStudy: {
        problem:
          '3Ks Judo Club needed a professional online presence to showcase their club information, class schedules, grading system, and media gallery.',
        solution:
          'Built an end-to-end solution including design, development, deployment, and handover with full documentation for client independence.',
        impact:
          'Delivered a 30% reduction in page load time through WebP optimization and lazy loading, with clear documentation enabling long-term maintainability.',
        stack: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'GitHub'],
      },
    },
    {
      title: 'AI-Powered 3D Facial Recognition for Crime Intelligence',
      description:
        'Designed an end-to-end research prototype that combines 3D facial reconstruction, recognition embeddings, object detection, and crime forecasting into a unified intelligence dashboard.',
      tags: ['PyTorch', 'YOLOv8', 'FastAPI', 'React'],
      link: 'https://github.com/CParaschivDev/AI-Powered-3D-Facial-Recognition-for-Crime-Intelligence-via-Reconstructive-and-Predictive-Methods',
      linkLabel: 'View repo',
      categories: ['ML', 'Apps', 'Data', 'Visualization'],
      metrics: ['AUC 0.84', 'Latency 150ms', '530 IDs'],
      highlights: [
        '3D-aware pipeline with landmarks, reconstruction, and recognition',
        'Crime forecasting with Prophet and analytics dashboards',
        'Governance layer with bias monitoring and audit logging',
      ],
      caseStudy: {
        problem:
          'Bridge the gap between face recognition outputs and crime-intelligence analytics in a single workflow.',
        solution:
          'Built a modular stack with YOLOv8 detection, 3D reconstruction, embeddings, and a FastAPI + React dashboard.',
        impact:
          'Demonstrated feasibility of a unified research-only prototype with governance and fairness checks.',
        stack: ['PyTorch', 'YOLOv8', 'FastAPI', 'React', 'Prophet'],
      },
    },
    {
      title: 'Exploratory Data Analysis — Superstore 2019–2022',
      description:
        'Cleaned and analyzed a retail dataset (9,996 rows, 19 attributes) to uncover sales trends, profitability by category/region, and the impact of discounts.',
      tags: ['Power BI', 'EDA', 'Data Cleaning'],
      link: 'https://www.youtube.com/watch?v=bTwgL6FEaE8&ab_channel=CristianParaschiv',
      linkLabel: 'View presentation',
      categories: ['Data', 'Visualization'],
      metrics: ['9,996 rows', '19 features', '5010 records'],
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
        'Built and evaluated Random Forest and Gradient Boosting models to predict SuperStore profit, with full preprocessing, feature engineering, and metric-driven comparison.',
      tags: ['Python', 'Power BI', 'Random Forest', 'Gradient Boosting'],
      link: 'https://youtu.be/pR_8gQ6yyVc',
      linkLabel: 'View demo',
      categories: ['ML', 'Data'],
      metrics: ['RMSE 15.33', 'R2 0.83', 'MAE 6.61'],
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
      metrics: ['Val Acc 95%+', 'AUC 0.997', '22 classes'],
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
      title: 'Traditional ML for Image Classification',
      description:
        'Benchmarked SVM, Decision Tree, and KNN on Fashion MNIST and CIFAR-10 with PCA-driven dimensionality reduction and GridSearchCV tuning.',
      tags: ['SVM', 'KNN', 'Decision Tree', 'PCA'],
      link: 'https://www.youtube.com/watch?v=y57xK7s8nX0',
      linkLabel: 'View demo',
      categories: ['ML', 'Data'],
      metrics: ['SVM 89.65%', 'CIFAR 52.59%', 'PCA 50 comps'],
      highlights: [
        'Compared classic ML models across two datasets',
        'Applied PCA for faster, cleaner feature space',
        'Analyzed accuracy vs training time trade-offs',
      ],
      caseStudy: {
        problem:
          'Evaluate how classic ML algorithms perform on image datasets with different complexity.',
        solution:
          'Built a consistent pipeline with PCA, normalization, and GridSearchCV tuning.',
        impact:
          'Showed SVM as top performer on Fashion MNIST and the limits on CIFAR-10.',
        stack: ['SVM', 'KNN', 'Decision Tree', 'PCA'],
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
      metrics: ['F1 0.956', 'ROC-AUC 0.994', '41,188 rows'],
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
  ],
  ro: [
    {
      title: 'Site Web 3Ks Judo Club',
      description:
        'Proiect de voluntar ca Full-Stack Web Developer - am construit site-ul oficial al clubului de la zero cu înregistrare domeniu, hosting cloud, configurare DNS și optimizare performanță.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'WebP', 'Lazy Loading'],
      link: 'https://3ksjudo.co.uk',
      linkLabel: 'Vezi site',
      categories: ['Apps', 'Web'],
      metrics: ['30% mai rapid', 'optimizare WebP', 'module interactive'],
      highlights: [
        'Dezvoltare full-stack cu HTML5, CSS3, JavaScript și PHP',
        'Înregistrare domeniu, hosting cloud și configurare DNS',
        'Optimizare performanță cu asset-uri WebP și lazy loading',
        'Module interactive: hărți, informații grading, galerie media',
      ],
      caseStudy: {
        problem:
          '3Ks Judo Club avea nevoie de o prezență online profesională pentru a prezenta informațiile clubului, programul claselor, sistemul de grading și galeria media.',
        solution:
          'Am construit o soluție end-to-end incluzând design, dezvoltare, deployment și handover cu documentație completă pentru independența clientului.',
        impact:
          'Am livrat o reducere de 30% a timpului de încărcare prin optimizare WebP și lazy loading, cu documentație clară pentru mentenanță pe termen lung.',
        stack: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'GitHub'],
      },
    },
    {
      title: 'Recunoaștere Facială 3D cu AI pentru Inteligența Criminalistică',
      description:
        'Am proiectat un prototip de cercetare end-to-end care combină reconstrucția facială 3D, embeddings de recunoaștere, detectare obiecte și prognoză criminalistică într-un dashboard unificat.',
      tags: ['PyTorch', 'YOLOv8', 'FastAPI', 'React'],
      link: 'https://github.com/CParaschivDev/AI-Powered-3D-Facial-Recognition-for-Crime-Intelligence-via-Reconstructive-and-Predictive-Methods',
      linkLabel: 'Vezi repo',
      categories: ['ML', 'Apps', 'Data', 'Visualization'],
      metrics: ['AUC 0.84', 'Latency 150ms', '530 ID-uri'],
      highlights: [
        'Pipeline 3D cu landmarks, reconstrucție și recunoaștere',
        'Prognoză criminalistică cu Prophet și dashboard-uri analitice',
        'Strat de guvernanță cu monitorizare bias și audit logging',
      ],
      caseStudy: {
        problem:
          'Bridge the gap between face recognition outputs and crime-intelligence analytics in a single workflow.',
        solution:
          'Built a modular stack with YOLOv8 detection, 3D reconstruction, embeddings, and a FastAPI + React dashboard.',
        impact:
          'Demonstrated feasibility of a unified research-only prototype with governance and fairness checks.',
        stack: ['PyTorch', 'YOLOv8', 'FastAPI', 'React', 'Prophet'],
      },
    },
    {
      title: 'Analiză de Date Exploratorie — Superstore 2019–2022',
      description:
        'Am curățat și analizat un set de date retail (9,996 rânduri, 19 atribute) pentru a descoperi tendințe de vânzări, profitabilitate pe categorie/regiune și impactul discounturilor.',
      tags: ['Power BI', 'EDA', 'Data Cleaning'],
      link: 'https://www.youtube.com/watch?v=bTwgL6FEaE8&ab_channel=CristianParaschiv',
      linkLabel: 'Vezi prezentare',
      categories: ['Data', 'Visualization'],
      metrics: ['9,996 rânduri', '19 features', '5010 înregistrări'],
      highlights: [
        'Am auditat calitatea datelor și am rezolvat duplicate/outliers',
        'Am construit insights pe regiuni și categorii pentru profitabilitate',
        'Am livrat recomandări acționabile pentru prețuri',
      ],
      caseStudy: {
        problem:
          'Părțile interesate aveau nevoie de o vedere clară a tendințelor de vânzări, factorilor de profit și impactului discounturilor pe regiuni și categorii.',
        solution:
          'Am livrat un flux complet EDA cu curățare date, transformare log și analiză vizuală țintită în Power BI.',
        impact:
          'Am dezvăluit oportunități de strategie de prețuri și regionale cu recomandări practice.',
        stack: ['Power BI', 'Data Cleaning', 'EDA'],
      },
    },
    {
      title: 'Prognoză Profit cu Modele Ensemble',
      description:
        'Am construit și evaluat modele Random Forest și Gradient Boosting pentru a prognoza profitul SuperStore, cu preprocessing complet, feature engineering și comparație bazată pe metrici.',
      tags: ['Python', 'Power BI', 'Random Forest', 'Gradient Boosting'],
      link: 'https://youtu.be/pR_8gQ6yyVc',
      linkLabel: 'Vezi demo',
      categories: ['ML', 'Data'],
      metrics: ['RMSE 15.33', 'R2 0.83', 'MAE 6.61'],
      highlights: [
        'Am comparat modele ensemble cu RMSE, MAE și R2',
        'Am creat features pentru impactul marjei și discountului',
        'Am tradus rezultatele modelelor în strategie de business',
      ],
      caseStudy: {
        problem:
          'Aveam nevoie de o modalitate fiabilă de a prognoza profitul și de a înțelege ce variabile conduc performanța.',
        solution:
          'Am construit pipeline-uri Random Forest și Gradient Boosting cu preprocessing, agregare și dashboard-uri de evaluare.',
        impact:
          'Am identificat cel mai stabil model și am clarificat influența discountului vs marjei asupra profitului.',
        stack: ['Python', 'Power BI', 'Random Forest', 'Gradient Boosting'],
      },
    },
    {
      title: 'Clasificare Boli Frunze Plante',
      description:
        'Am construit un CNN rezidual personalizat și am fine-tunat EfficientNetV2 pentru a clasifica 22 de clase de boli ale frunzelor plantelor, cu class weighting, tuning Optuna și rezultate bune AUC/accuracy.',
      tags: ['TensorFlow', 'Keras', 'EfficientNetV2', 'Optuna'],
      link: 'https://www.youtube.com/watch?v=Ta5A5H2d3yQ',
      linkLabel: 'Vezi demo',
      categories: ['ML'],
      metrics: ['Val Acc 95%+', 'AUC 0.997', '22 clase'],
      highlights: [
        'Clasificator cu 22 de clase cu 95%+ acuratețe de validare',
        'Class weighting pentru a aborda dezechilibrul',
        'Comparație transfer learning vs CNN personalizat',
      ],
      caseStudy: {
        problem:
          'Clasificarea bolilor frunzelor plantelor pe 22 de clase cu acuratețe ridicată sub dezechilibru de clase.',
        solution:
          'Am antrenat un CNN rezidual și EfficientNetV2 cu class weighting și tuning Optuna.',
        impact:
          'Am obținut 95%+ acuratețe de validare și AUC puternic pe clase.',
        stack: ['TensorFlow', 'Keras', 'EfficientNetV2', 'Optuna'],
      },
    },
    {
      title: 'ML Tradițional pentru Clasificare Imagini',
      description:
        'Am comparat SVM, Decision Tree și KNN pe Fashion MNIST și CIFAR-10 cu reducere dimensională PCA și tuning GridSearchCV.',
      tags: ['SVM', 'KNN', 'Decision Tree', 'PCA'],
      link: 'https://www.youtube.com/watch?v=y57xK7s8nX0',
      linkLabel: 'Vezi demo',
      categories: ['ML', 'Data'],
      metrics: ['SVM 89.65%', 'CIFAR 52.59%', 'PCA 50 comps'],
      highlights: [
        'Am comparat modele ML clasice pe două dataset-uri',
        'Am aplicat PCA pentru spațiu de features mai rapid și mai curat',
        'Am analizat trade-off-ul acuratețe vs timp de antrenare',
      ],
      caseStudy: {
        problem:
          'Evaluarea modului în care algoritmii ML clasici performează pe dataset-uri de imagini cu complexitate diferită.',
        solution:
          'Am construit un pipeline consistent cu PCA, normalizare și tuning GridSearchCV.',
        impact:
          'Am arătat SVM ca performerul top pe Fashion MNIST și limitele pe CIFAR-10.',
        stack: ['SVM', 'KNN', 'Decision Tree', 'PCA'],
      },
    },
    {
      title: 'ML Explicabil pentru Campanii de Marketing Bancar',
      description:
        'Aplicație Streamlit end-to-end pentru prognozarea subscripțiilor de depozite cu explicabilitate LIME și SHAP, comparație modele și fluxuri de predicție batch.',
      tags: ['Streamlit', 'LIME', 'SHAP', 'Scikit-learn'],
      link: 'https://github.com/CParaschivDev/Explainable-ML-Bank-Marketing-Campaigns',
      linkLabel: 'Vezi repo',
      categories: ['ML', 'Apps'],
      metrics: ['F1 0.956', 'ROC-AUC 0.994', '41,188 rânduri'],
      highlights: [
        'Explicații locale și globale (LIME, SHAP)',
        'Comparație modele și încredere ensemble',
        'Upload batch cu validare schemă',
      ],
      caseStudy: {
        problem:
          'Echipele de marketing aveau nevoie de predicții transparente și un flux de lucru în care să aibă încredere și pe care să-l auditeze.',
        solution:
          'Am livrat o aplicație Streamlit cu explicabilitate, comparație modele, scoring batch și validare schemă.',
        impact:
          'Am îmbunătățit încrederea în decizii cu predicții interpretabile și rapoarte descărcabile.',
        stack: ['Streamlit', 'Scikit-learn', 'LIME', 'SHAP'],
      },
    },
  ],
}

const certificationsData = {
  en: [
    { title: 'Machine Learning Specialization', issuer: 'Stanford Online', year: '2024', credential: 'Coursera' },
    { title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', year: '2024', credential: 'Coursera' },
    { title: 'Google Data Analytics Professional Certificate', issuer: 'Google', year: '2023', credential: 'Coursera' },
    { title: 'TensorFlow Developer Certificate', issuer: 'Google', year: '2024', credential: 'TensorFlow' },
  ],
  ro: [
    { title: 'Specializare Machine Learning', issuer: 'Stanford Online', year: '2024', credential: 'Coursera' },
    { title: 'Specializare Deep Learning', issuer: 'DeepLearning.AI', year: '2024', credential: 'Coursera' },
    { title: 'Certificat Profesional Google Data Analytics', issuer: 'Google', year: '2023', credential: 'Coursera' },
    { title: 'Certificat Dezvoltator TensorFlow', issuer: 'Google', year: '2024', credential: 'TensorFlow' },
  ],
}

const translations = {
  en: {
    about: 'About',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    contact: 'Contact',
    letsTalk: "Let's talk",
    viewProjects: 'View projects',
    quickContact: 'Quick contact',
    status: 'Status',
    openToRoles: 'Open to roles',
    focus: 'Focus',
    timezone: 'Timezone',
    eet: 'EET',
    appliedML: 'applied ML projects',
    degrees: 'degrees in tech',
    explainabilityFocus: 'explainability focus',
    recentProject: 'Recent project',
    aboutTitle: 'About me',
    aboutText: 'I specialize in explainable ML, predictive modeling, and decision support dashboards. My focus is accuracy, clarity, and practical impact for stakeholders.',
    workingStyle: 'Working style',
    workingStyleText: 'Structured delivery, clear documentation, and measurable outcomes.',
    focusSkill: 'Focus',
    focusText: 'Explainable models, evaluation rigor, and trustworthy insights.',
    collaboration: 'Collaboration',
    collaborationText: 'Transparent progress, review checkpoints, and stakeholder alignment.',
    educationTitle: 'Education',
    educationSubtitle: 'Academic foundation in cloud, data science, and AI.',
    bsc: 'BSc Cloud Computing',
    bscGrade: 'First Class',
    msc: 'MSc Data Science & Artificial Intelligence',
    mscGrade: 'Recent graduate',
    projectsTitle: 'Selected projects',
    projectsSubtitle: 'A focused set of projects that highlight my data, ML, and product thinking.',
    caseStudy: 'Case study',
    problem: 'Problem',
    solution: 'Solution',
    impact: 'Impact',
    stack: 'Stack',
    close: 'Close',
    skillsTitle: 'Skills',
    skillsSubtitle: 'A focused stack that supports end-to-end ML delivery.',
    core: 'Core',
    advanced: 'Advanced',
    familiar: 'Familiar',
    machineLearning: 'Machine Learning',
    dataAnalytics: 'Data & Analytics',
    appsDelivery: 'Apps & Delivery',
    productUX: 'Product & UX',
    contactTitle: 'Contact',
    contactText: 'Have a project or idea? Send a message and let\'s talk.',
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    certifications: 'Certifications',
    certificationsSubtitle: 'Professional certifications and continuous learning.',
    name: 'Name',
    message: 'Message',
    sendMessage: 'Send message',
    sending: 'Sending...',
    sent: 'Sent!',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    heroEyebrow: 'MSc Data Science and Artificial Intelligence',
    heroH1: 'Building reliable ML systems and dashboards that drive decisions.',
    heroSubtitle: 'I help teams move from raw data to clear actions. My work blends machine learning, explainability, and clean interfaces so results are understandable and usable.',
    heroEdu: 'BSc Cloud Computing (First Class) • MSc Data Science & Artificial Intelligence',
    explainableAI: 'Explainable AI',
    footer: '© 2026 Cristian Paraschiv. All rights reserved.',
  },
  ro: {
    about: 'Despre',
    education: 'Educație',
    projects: 'Proiecte',
    skills: 'Competențe',
    contact: 'Contact',
    letsTalk: 'Să vorbim',
    viewProjects: 'Vezi proiecte',
    quickContact: 'Contact rapid',
    status: 'Status',
    openToRoles: 'Disponibil pentru roluri',
    focus: 'Focus',
    timezone: 'Fus orar',
    eet: 'EET',
    appliedML: 'proiecte ML aplicate',
    degrees: 'diplome în tech',
    explainabilityFocus: 'focus pe explicabilitate',
    recentProject: 'Proiect recent',
    aboutTitle: 'Despre mine',
    aboutText: 'Specializez în ML explicabil, modelare predictivă și tablouri de bord pentru decizii. Focusul meu este acuratețea, claritatea și impactul practic pentru părți interesate.',
    workingStyle: 'Stil de lucru',
    workingStyleText: 'Livrare structurată, documentație clară și rezultate măsurabile.',
    focusSkill: 'Focus',
    focusText: 'Modele explicabile, rigoare în evaluare și insights de încredere.',
    collaboration: 'Colaborare',
    collaborationText: 'Progres transparent, puncte de verificare și alinierea cu părțile interesate.',
    educationTitle: 'Educație',
    educationSubtitle: 'Fundament academic în cloud, știința datelor și AI.',
    bsc: 'BSc Cloud Computing',
    bscGrade: 'Prima Clasă',
    msc: 'MSc Știința Datelor și Inteligența Artificială',
    mscGrade: 'Absolvent recent',
    projectsTitle: 'Proiecte selectate',
    projectsSubtitle: 'Un set concentrat de proiecte care evidențiază gândirea mea în date, ML și produs.',
    caseStudy: 'Studiu de caz',
    problem: 'Problema',
    solution: 'Soluția',
    impact: 'Impactul',
    stack: 'Tehnologii',
    close: 'Închide',
    skillsTitle: 'Competențe',
    skillsSubtitle: 'Un stack concentrat care susține livrare ML end-to-end.',
    core: 'De bază',
    advanced: 'Avansat',
    familiar: 'Familiar',
    machineLearning: 'Machine Learning',
    dataAnalytics: 'Date & Analiză',
    appsDelivery: 'Aplicații & Livrare',
    productUX: 'Produs & UX',
    contactTitle: 'Contact',
    contactText: 'Ai un proiect sau o idee? Trimite un mesaj și să vorbim.',
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    certifications: 'Certificări',
    certificationsSubtitle: 'Certificări profesionale și învățare continuă.',
    name: 'Nume',
    message: 'Mesaj',
    sendMessage: 'Trimite mesaj',
    sending: 'Se trimite...',
    sent: 'Trimis!',
    darkMode: 'Mod întunecat',
    lightMode: 'Mod luminos',
    heroEyebrow: 'MSc Știința Datelor și Inteligența Artificială',
    heroH1: 'Construiesc sisteme ML fiabile și tablouri de bord care susțin deciziile.',
    heroSubtitle: 'Ajut echipele să treacă de la date brute la acțiuni clare. Munca mea îmbină machine learning, explicabilitate și interfețe curate astfel încât rezultatele să fie înțelese și utilizabile.',
    heroEdu: 'BSc Cloud Computing (Prima Clasă) • MSc Știința Datelor și Inteligența Artificială',
    explainableAI: 'AI Explicabil',
    footer: '© 2026 Cristian Paraschiv. Toate drepturile rezervate.',
  },
}

function App() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [formStatus, setFormStatus] = useState(null)
  const [activeSection, setActiveSection] = useState('about')
  const [darkMode, setDarkMode] = useState(true)
  const [lang, setLang] = useState('en')
  const [booting, setBooting] = useState(true)
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')

  const t = translations[lang]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    // Simulate boot sequence
    const timer = setTimeout(() => {
      setBooting(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      const tagName = event.target?.tagName
      const isTyping =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) ||
        event.target?.isContentEditable

      if (event.key === 'Escape') {
        setCommandOpen(false)
        return
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((open) => !open)
        return
      }

      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        setCommandOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('sending')
    const form = e.target
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    }
    
    try {
      const response = await fetch('https://formspree.io/f/xaqdvzvk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setFormStatus('sent')
        form.reset()
        setTimeout(() => setFormStatus(null), 3000)
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      setFormStatus('error')
    }
  }

  const filters = ['All', 'ML', 'Data', 'Apps', 'Web', 'Visualization']

  const projectsLang = projectsData[lang]
  const certifications = certificationsData[lang]

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projectsLang
    return projectsLang.filter((project) => project.categories.includes(activeFilter))
  }, [activeFilter, projectsLang])

  useEffect(() => {
    const sections = ['about', 'projects', 'skills', 'contact', 'education']
    const observers = []
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-30% 0px -55% 0px', threshold: 0.15 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % projectsLang.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [projectsLang.length])

  useEffect(() => {
    const scrollElements = document.querySelectorAll('.scroll-fade')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    scrollElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const skillMatrix = [
    {
      title: 'Core',
      skills: [
        'Python',
        'Scikit-learn',
        'Pandas',
        'SQL',
        'Model Evaluation',
        'Explainability (SHAP, LIME)',
      ],
    },
    {
      title: 'Advanced',
      skills: [
        'TensorFlow',
        'PyTorch',
        'Keras',
        'Feature Engineering',
        'Imbalanced Learning',
        'Time-Series Forecasting',
        'Object Detection (YOLO)',
      ],
    },
    {
      title: 'Familiar',
      skills: [
        'Power BI',
        'Streamlit',
        'React',
        'FastAPI',
        'PHP',
        'Docker',
        'GitHub Actions',
      ],
    },
  ]

  const navigateTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(id)
  }

  const commandItems = [
    {
      code: 'NAV/ABOUT',
      label: lang === 'en' ? 'Open profile dossier' : 'Deschide dosarul profilului',
      shortcut: 'A',
      action: () => navigateTo('about'),
    },
    {
      code: 'NAV/PROJECTS',
      label: lang === 'en' ? 'Open project matrix' : 'Deschide matricea proiectelor',
      shortcut: 'P',
      action: () => navigateTo('projects'),
    },
    {
      code: 'NAV/SKILLS',
      label: lang === 'en' ? 'Scan skill modules' : 'Scaneaza modulele de skill-uri',
      shortcut: 'S',
      action: () => navigateTo('skills'),
    },
    {
      code: 'NAV/CONTACT',
      label: lang === 'en' ? 'Open contact uplink' : 'Deschide conexiunea de contact',
      shortcut: 'C',
      action: () => navigateTo('contact'),
    },
    {
      code: 'SYS/THEME',
      label: darkMode
        ? lang === 'en'
          ? 'Switch to amber diagnostics'
          : 'Comuta pe diagnostice amber'
        : lang === 'en'
          ? 'Switch to cyan night ops'
          : 'Comuta pe operatiuni cyan',
      shortcut: 'T',
      action: () => setDarkMode((mode) => !mode),
    },
    {
      code: 'SYS/LANGUAGE',
      label: lang === 'en' ? 'Switch interface to Romanian' : 'Schimba interfata in English',
      shortcut: 'L',
      action: () => setLang((current) => (current === 'en' ? 'ro' : 'en')),
    },
    {
      code: 'UPLINK/EMAIL',
      label: lang === 'en' ? 'Transmit email signal' : 'Trimite semnal email',
      shortcut: 'E',
      action: () => {
        window.location.href = 'mailto:paraschiv.cristian93@outlook.com'
      },
    },
    {
      code: 'UPLINK/GITHUB',
      label: lang === 'en' ? 'Open GitHub uplink' : 'Deschide uplink GitHub',
      shortcut: 'G',
      action: () => {
        window.open('https://github.com/CParaschivDev', '_blank', 'noreferrer')
      },
    },
  ]

  const visibleCommands = commandItems.filter((item) => {
    const query = commandQuery.trim().toLowerCase()
    if (!query) return true
    return `${item.code} ${item.label}`.toLowerCase().includes(query)
  })

  const runCommand = (item) => {
    item.action()
    setCommandOpen(false)
    setCommandQuery('')
  }

  const missionSections = [
    { id: 'about', code: '01', label: t.about },
    { id: 'education', code: '02', label: t.education },
    { id: 'projects', code: '03', label: t.projects },
    { id: 'skills', code: '04', label: t.skills },
    { id: 'contact', code: '05', label: t.contact },
  ]

  return (
    <>
      {booting && (
        <div className="boot-screen">
          <div className="boot-text">
            <p>INITIALIZING SYSTEM...</p>
            <p>LOADING KERNEL v2.0.26...</p>
            <p>MOUNTING AI MODULES [OK]</p>
            <p>ESTABLISHING SECURE CONNECTION...</p>
            <p className="boot-blink">ACCESS GRANTED █</p>
          </div>
        </div>
      )}
      <div className={`page ${booting ? 'hidden' : ''}`}>
        <MatrixBackground darkMode={darkMode} />
        <CustomCursor />
        <SystemHUD />
        <MissionRail
          activeSection={activeSection}
          sections={missionSections}
          onNavigate={navigateTo}
        />
        <div className="screen-reticle reticle-tl"></div>
        <div className="screen-reticle reticle-tr"></div>
        <div className="screen-reticle reticle-bl"></div>
        <div className="screen-reticle reticle-br"></div>
        {commandOpen && (
          <div
            className="command-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Cyber command palette"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setCommandOpen(false)
            }}
          >
            <div className="command-panel">
              <div className="command-panel-head">
                <span>COMMAND PALETTE</span>
                <button
                  type="button"
                  className="command-close"
                  onClick={() => setCommandOpen(false)}
                >
                  ESC
                </button>
              </div>
              <div className="command-input-wrap">
                <span className="command-prompt">/</span>
                <input
                  autoFocus
                  className="command-input"
                  value={commandQuery}
                  onChange={(event) => setCommandQuery(event.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'Search navigation, system commands, uplinks...'
                      : 'Cauta navigare, comenzi de sistem, uplink-uri...'
                  }
                />
              </div>
              <div className="command-list">
                {visibleCommands.length ? (
                  visibleCommands.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className="command-item"
                      onClick={() => runCommand(item)}
                    >
                      <span className="command-code">{item.code}</span>
                      <span className="command-label">{item.label}</span>
                      <span className="command-shortcut">{item.shortcut}</span>
                    </button>
                  ))
                ) : (
                  <div className="command-empty">
                    {lang === 'en' ? 'NO COMMAND FOUND' : 'NICIO COMANDA GASITA'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <header className="nav">
        <div className="brand">Cristian Paraschiv</div>
        <nav className="nav-links">
          <a
            href="#about"
            className={activeSection === 'about' ? 'nav-active' : ''}
            onClick={() => setActiveSection('about')}
          >
            {t.about}
          </a>
          <a
            href="#education"
            className={activeSection === 'education' ? 'nav-active' : ''}
            onClick={() => setActiveSection('education')}
          >
            {t.education}
          </a>
          <a
            href="#projects"
            className={activeSection === 'projects' ? 'nav-active' : ''}
            onClick={() => setActiveSection('projects')}
          >
            {t.projects}
          </a>
          <a
            href="#skills"
            className={activeSection === 'skills' ? 'nav-active' : ''}
            onClick={() => setActiveSection('skills')}
          >
            {t.skills}
          </a>
          <a
            href="#contact"
            className={activeSection === 'contact' ? 'nav-active' : ''}
            onClick={() => setActiveSection('contact')}
          >
            {t.contact}
          </a>
        </nav>
        <div className="nav-controls">
          <button
            className="command-trigger"
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
          >
            CTRL K
          </button>
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? t.lightMode : t.darkMode}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button 
            className="lang-toggle"
            onClick={() => setLang(lang === 'en' ? 'ro' : 'en')}
          >
            {lang === 'en' ? 'RO' : 'EN'}
          </button>
          <a className="nav-cta" href="mailto:paraschiv.cristian93@outlook.com">
            {t.letsTalk}
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1>
              {t.heroH1}
            </h1>
            <p className="hero-subtitle">
              {t.heroSubtitle}
            </p>
            <p className="hero-edu">
              {t.heroEdu}
            </p>
            <div className="hero-signal">
              <div>
                <span className="signal-label">{t.status}</span>
                <span className="signal-value">{t.openToRoles}</span>
              </div>
              <div>
                <span className="signal-label">{t.focus}</span>
                <span className="signal-value">{t.explainableAI}</span>
              </div>
              <div>
                <span className="signal-label">{t.timezone}</span>
                <span className="signal-value">{t.eet}</span>
              </div>
            </div>
            <div className="hero-actions">
              <a className="btn primary" href="#projects">
                {t.viewProjects}
              </a>
              <a className="btn ghost" href="#contact">
                {t.quickContact}
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <span className="stat">7</span>
                <span className="stat-label">{t.appliedML}</span>
              </div>
              <div>
                <span className="stat">2</span>
                <span className="stat-label">{t.degrees}</span>
              </div>
              <div>
                <span className="stat">100%</span>
                <span className="stat-label">{t.explainabilityFocus}</span>
              </div>
            </div>
          </div>
          <div className="hero-card" aria-hidden="true">
            <div className="card-header">
              <span>{t.recentProject}</span>
              <span className="dot" />
            </div>
            <div className="neural-core">
              <div className="neural-scan" />
              <div className="neural-ring neural-ring-a" />
              <div className="neural-ring neural-ring-b" />
              <div className="neural-ring neural-ring-c" />
              <span className="neural-node neural-node-a" />
              <span className="neural-node neural-node-b" />
              <span className="neural-node neural-node-c" />
              <span className="neural-node neural-node-d" />
              <div className="neural-pulse" />
              <div className="neural-label">AI CORE ACTIVE</div>
            </div>
            <h3>{projectsLang[currentProjectIndex].title}</h3>
            <p>{projectsLang[currentProjectIndex].description}</p>
            <div className="card-tags">
              {projectsLang[currentProjectIndex].tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section about">
          <div>
            <h2><ScrambleText text={t.aboutTitle} /></h2>
            <p>
              {t.aboutText}
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <h3>{t.workingStyle}</h3>
              <p>{t.workingStyleText}</p>
            </div>
            <div className="about-card">
              <h3>{t.focusSkill}</h3>
              <p>{t.focusText}</p>
            </div>
            <div className="about-card">
              <h3>{t.collaboration}</h3>
              <p>{t.collaborationText}</p>
            </div>
          </div>
        </section>

        <section id="education" className="section education">
          <div className="section-head">
            <h2><ScrambleText text={t.educationTitle} /></h2>
            <p>{t.educationSubtitle}</p>
          </div>
          <div className="education-grid">
            <div className="education-card">
              <h3>{t.bsc}</h3>
              <p>{t.bscGrade}</p>
            </div>
            <div className="education-card">
              <h3>{t.msc}</h3>
              <p>{t.mscGrade}</p>
            </div>
          </div>
        </section>

        {/* <section id="certifications" className="section certifications">
          <div className="section-head">
            <h2><ScrambleText text={t.certifications} /></h2>
            <p>{t.certificationsSubtitle}</p>
          </div>
          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="certification-card">
                <h3>{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <div className="cert-meta">
                  <span>{cert.year}</span>
                  <span>{cert.credential}</span>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        <section id="projects" className="section projects">
          <div className="section-head">
            <h2><ScrambleText text={t.projectsTitle} /></h2>
            <p>
              {t.projectsSubtitle}
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
                <div className="project-metrics">
                  {project.metrics.map((metric) => (
                    <span key={metric} className="metric-chip">
                      {metric}
                    </span>
                  ))}
                </div>
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
                    {t.caseStudy}
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
                  {t.close}
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <span className="modal-label">{t.problem}</span>
                  <p>{selectedProject.caseStudy.problem}</p>
                </div>
                <div>
                  <span className="modal-label">{t.solution}</span>
                  <p>{selectedProject.caseStudy.solution}</p>
                </div>
                <div>
                  <span className="modal-label">{t.impact}</span>
                  <p>{selectedProject.caseStudy.impact}</p>
                </div>
                <div>
                  <span className="modal-label">{t.stack}</span>
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
            <h2><ScrambleText text={t.skillsTitle} /></h2>
            <p>{t.skillsSubtitle}</p>
          </div>
          <div className="skill-matrix">
            {[
              { title: t.core, skills: ['Python', 'Scikit-learn', 'Pandas', 'SQL', 'Model Evaluation', 'Explainability (SHAP, LIME)'] },
              { title: t.advanced, skills: ['TensorFlow', 'PyTorch', 'Keras', 'Feature Engineering', 'Imbalanced Learning', 'Time-Series Forecasting', 'Object Detection (YOLO)'] },
              { title: t.familiar, skills: ['Power BI', 'Streamlit', 'React', 'FastAPI', 'PHP', 'Docker', 'GitHub Actions'] },
            ].map((group) => (
              <div key={group.title} className="matrix-card">
                <div className="matrix-title">{group.title}</div>
                <div className="skills-grid-bars">
                  {group.skills.map((skill) => {
                    const percentage = Math.min(98, Math.max(65, skill.length * 5 + 40));
                    return (
                      <div className="skill-bar-container" key={skill}>
                        <div className="skill-bar-header">
                          <span>{skill}</span>
                          <span className="skill-bar-hex">0x{percentage.toString(16).toUpperCase()}</span>
                        </div>
                        <div className="skill-bar-track">
                          <div className="skill-bar-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="skills-cards">
            {[
              { title: t.machineLearning, skills: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'Model Evaluation', 'Feature Engineering', 'Imbalanced Learning', 'Explainability (SHAP, LIME)'] },
              { title: t.dataAnalytics, skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Power BI', 'Data Visualization', 'Exploratory Analysis'] },
              { title: t.appsDelivery, skills: ['Streamlit', 'React', 'Vite', 'API Integration', 'Automation', 'Git & GitHub'] },
              { title: t.productUX, skills: ['Dashboard Design', 'Information Architecture', 'User-Centered Design', 'Responsive Layouts', 'Presentation Storytelling'] },
            ].map((group) => (
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
            <h2><ScrambleText text={t.contactTitle} /></h2>
            <p>{t.contactText}</p>
          </div>
          <div className="contact-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">{t.name}</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t.message}</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn primary" disabled={formStatus === 'sending'}>
                {formStatus === 'sending' ? t.sending : formStatus === 'sent' ? t.sent : t.sendMessage}
              </button>
            </form>
            <div className="contact-card">
              <div>
                <span className="contact-label">{t.email}</span>
                <a href="mailto:paraschiv.cristian93@outlook.com">
                  paraschiv.cristian93@outlook.com
                </a>
              </div>
              <div>
                <span className="contact-label">{t.github}</span>
                <a href="https://github.com/CParaschivDev" target="_blank" rel="noreferrer">
                  github.com/CParaschivDev
                </a>
              </div>
              <div>
                <span className="contact-label">{t.linkedin}</span>
                <a
                  href="https://www.linkedin.com/in/cristian-constantin-paraschiv-6002b0257/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/cristian-constantin-paraschiv-6002b0257
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>{t.footer}</span>
      </footer>
      </div>
    </>
  )
}

export default App
