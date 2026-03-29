export interface Module {
  id: string;
  title: string;
  duration: string;
  content: string;
  activity: {
    title: string;
    description: string;
    tasks: string[];
  };
  videoUrl: string;
  moduleQuiz: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

export interface GradeContent {
  grade: number;
  title: string;
  modules: Module[];
  quiz: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

const MODULE_TITLES = [
  { id: "m1", title: "E-Classroom Management", duration: "60 min" },
  { id: "m2", title: "How to Conduct Activities", duration: "65 min" },
  { id: "m3", title: "Child Behaviour & Psychology", duration: "70 min" },
  { id: "m4", title: "Managing Classroom Environment", duration: "60 min" },
  { id: "m5", title: "Building Positive Relationships", duration: "65 min" },
  { id: "m6", title: "Inclusive Education Practices", duration: "70 min" },
  { id: "m7", title: "Student Engagement Strategies", duration: "60 min" },
  { id: "m8", title: "Effective Communication", duration: "65 min" },
  { id: "m9", title: "Assessment for Learning", duration: "70 min" },
  { id: "m10", title: "Professional Reflection & Growth", duration: "60 min" },
];

function buildModules(grade: number): Module[] {
  const g = grade;
  return [
    {
      id: "m1",
      videoUrl: "https://www.youtube.com/embed/qlS9qLCqL3A",
      title: "E-Classroom Management",
      duration: "60 min",
      content: `Digital and physical classroom management are two sides of the same coin for Grade ${g} teachers. E-Classroom Management involves establishing clear digital norms, leveraging technology platforms purposefully, and maintaining student focus in hybrid or technology-enhanced environments.

**Setting Up Digital Rules:** Begin the year by co-creating a classroom technology charter with students. For Grade ${g}, this means age-appropriate agreements about screen time, device use during instruction, and digital citizenship. Post rules visibly — both physically in the room and as a pinned message in your LMS.

**Organizing the Digital Classroom:** Use a consistent LMS (Learning Management System) structure so students always know where to find assignments, resources, and submission portals. In Grade ${g}, folder organization should be intuitive: label folders by subject and week. Use color-coding for categories like "Today's Work," "Resources," and "Completed."

**Managing Screen Time Mindfully:** Research shows that 20-30 minute screen segments followed by offline tasks optimize attention for Grade ${g} learners. Use a visual timer projected on the board. Incorporate 'screen-off' signals — a bell, a hand gesture — so transitions are predictable and calm.

**Digital Distraction Prevention:** Proactive strategies include using full-screen focus mode on student devices, random classroom walk-throughs during independent work, and assigning offline components alongside digital tasks. For younger grades, device management apps with teacher dashboards allow real-time monitoring.

**Blended Learning Models:** Understanding the Rotation Model (Station Rotation, Lab Rotation) is essential for Grade ${g}. Design stations so one group works digitally while another works with the teacher directly. This ensures technology enhances — not replaces — teacher-student interaction.

**Troubleshooting Common Issues:** Technical failures happen. Always have a 'Plan B' that requires no technology. Teach students a 3-step tech-trouble protocol: check connection, restart device, raise hand quietly. This prevents whole-class disruption during individual tech issues.

**Data Privacy and Safety:** Teachers must model responsible data practices. Never require students to share personal information on public platforms. Use school-approved tools only. For Grade ${g}, this is also a teachable moment in digital literacy.

**Assessment in E-Classrooms:** Use Google Forms, Kahoot, Mentimeter, or built-in LMS quizzes for formative checks. These provide instant data for differentiation. Ensure assessments are accessible across device types used in your school.

**Parent Communication via Technology:** Platforms like ClassDojo, Seesaw, or Remind bridge school and home. For Grade ${g} families, weekly digital newsletters summarizing learning and upcoming events build trust and engagement.

**Reflection:** At the end of each week, ask yourself: Did technology serve the learning goal, or did the learning serve the technology? Keep technology as a tool, not a goal.`,
      activity: {
        title: "Digital Classroom Audit",
        description:
          "Reflect on your current classroom technology setup and identify areas for improvement.",
        tasks: [
          "List 3 digital tools you currently use in your classroom",
          "Identify one technology-related challenge you face weekly",
          "Write a 2-sentence digital classroom rule you would introduce",
          "Sketch a simple rotation model for your class using 3 stations",
        ],
      },
      moduleQuiz: [
        {
          question: "What does LMS stand for?",
          options: [
            "Learning Management System",
            "Lesson Module Scheduler",
            "Language Monitoring System",
            "Learning Module Setup",
          ],
          answer: 0,
        },
        {
          question: "How long should screen segments be for optimal attention?",
          options: [
            "10-15 minutes",
            "20-30 minutes",
            "45-60 minutes",
            "5-10 minutes",
          ],
          answer: 1,
        },
        {
          question: "What is the 3-step tech-trouble protocol?",
          options: [
            "Ask teacher, wait, restart",
            "Check connection, restart device, raise hand",
            "Turn off, wait, turn on",
            "Call IT, wait, use phone",
          ],
          answer: 1,
        },
        {
          question: "Which model involves Station Rotation?",
          options: [
            "Flipped Classroom",
            "Project-Based Learning",
            "Blended Learning Rotation Model",
            "Inquiry Learning",
          ],
          answer: 2,
        },
        {
          question: "What should teachers always have for tech failures?",
          options: [
            "Extra devices",
            "A Plan B requiring no technology",
            "A tech support number",
            "Student helpers",
          ],
          answer: 1,
        },
      ],
    },
    {
      id: "m2",
      videoUrl: "https://www.youtube.com/embed/V4NJo2Mfvrc",
      title: "How to Conduct Activities",
      duration: "65 min",
      content: `Well-designed activities are the heartbeat of Grade ${g} learning. This module covers the complete lifecycle of an activity — from planning and preparation to facilitation and debrief.

**Activity Design Principles:** Effective activities for Grade ${g} must have a clear learning intention, success criteria students understand, and relevance to their lives. Use Bloom's Taxonomy as a design scaffold: ensure activities move from recall (lower-order) to creation and evaluation (higher-order).

**Types of Activities by Purpose:** Use icebreakers to build community, inquiry tasks to develop thinking, collaborative challenges to build teamwork, reflection activities to consolidate learning, and creative tasks to allow expression. For Grade ${g}, a healthy weekly mix includes at least one of each type.

**Preparation Checklist:** Before any activity — physical or digital — prepare: all materials counted and accessible, instructions written in student-friendly language, anticipated misconceptions noted with your response plan, timing planned with buffer, grouping decided in advance.

**Giving Instructions Effectively:** The 'KISS' principle applies — Keep Instructions Short and Simple. For Grade ${g}, limit spoken instructions to 3-4 steps. Use a combination of: verbal instructions, written steps on the board, and a visual demonstration. Check for understanding before releasing students to work.

**Grouping Strategies:** Random groups build community but may need more scaffolding. Strategic groups (by skill level) allow targeted differentiation. Mixed groups build peer learning. For Grade ${g}, vary grouping across the week. Avoid always grouping by ability, which can create fixed mindsets.

**Facilitating, Not Lecturing:** During activities, your role shifts from teacher to facilitator. Move around the room using a 'hovering' technique — pause near groups, listen for 30 seconds before speaking. Ask probing questions: 'What have you tried so far?' 'What does [student] think?' 'Can you show me your reasoning?'

**Managing Noise and Energy Levels:** Activities generate productive noise. Teach students the difference between 'working noise' and disruptive noise from Day 1. Use a noise meter visual. For high-energy activities, schedule them before breaks or transitions. For deep-thinking activities, set a quiet atmosphere with soft background music.

**Debrief and Reflection:** The debrief is where learning solidifies. Spend 10-15% of activity time on debrief. Use structured protocols: Think-Pair-Share, Round Robin sharing, or a 'gallery walk' where students view each other's work. Anchor back to the learning intention: 'So what did we learn about [topic]?'

**Adapting Activities Mid-Flight:** If an activity is not working, it is professional and skilled to adapt in real-time. Have 'early finisher' extensions ready. If the whole class is stuck, call a 'class huddle' for a 5-minute re-teach before returning to work.

**Documentation and Iteration:** After every major activity, make a brief note: What worked? What flopped? What would I change? This professional habit transforms a one-time lesson into a continuously improving pedagogical asset.`,
      activity: {
        title: "Activity Design Workshop",
        description:
          "Design a mini-activity for your class using the principles from this module.",
        tasks: [
          "Write a clear learning intention for one upcoming activity",
          "List the materials needed and check availability",
          "Write step-by-step instructions in 4 steps or fewer",
          "Plan a 5-minute debrief question for the activity",
        ],
      },
      moduleQuiz: [
        {
          question: "What does KISS stand for in giving instructions?",
          options: [
            "Keep It Short and Simple",
            "Keep Instructions Structured and Sequential",
            "Keep It Smart and Specific",
            "Keep It Simple and Scalable",
          ],
          answer: 0,
        },
        {
          question:
            "What percentage of activity time should be spent on debrief?",
          options: ["5%", "10-15%", "25%", "50%"],
          answer: 1,
        },
        {
          question: "Which grouping strategy is best for building community?",
          options: [
            "Ability grouping",
            "Teacher-selected grouping",
            "Random grouping",
            "Self-selected grouping",
          ],
          answer: 2,
        },
        {
          question: "What is the teacher's role during activities?",
          options: [
            "Lecturer",
            "Observer only",
            "Facilitator",
            "Administrator",
          ],
          answer: 2,
        },
        {
          question: "What should you have ready for early finishers?",
          options: [
            "More of the same work",
            "Extension tasks",
            "Free time",
            "Help other students",
          ],
          answer: 1,
        },
      ],
    },
    {
      id: "m3",
      videoUrl: "https://www.youtube.com/embed/hFR6UT13c5M",
      title: "Child Behaviour & Psychology",
      duration: "70 min",
      content: `Understanding the psychological foundations of child behavior empowers Grade ${g} teachers to respond wisely rather than react impulsively. Behavior is always communication — the teacher's job is to decode the message.

**Developmental Psychology of Grade ${g} Learners:** Children in Grade ${g} are at a specific cognitive and emotional stage. ${g <= 3 ? "At this age (roughly 5-9), children are in Piaget's Concrete Operational stage — they learn best through tangible, hands-on experiences and think very literally." : g <= 6 ? "At this age (roughly 9-12), children are transitioning toward formal operational thought — they can begin handling abstractions and hypotheticals, but still benefit greatly from concrete anchoring." : "At this age (roughly 12-16), students are in or entering formal operational thought — they can reason about abstract concepts, hypotheticals, and moral dilemmas, but emotional volatility from adolescent development often overrides logical thinking."}

**Maslow's Hierarchy in the Classroom:** Before students can learn, basic needs must be met. Check: Is a student behaving oddly because they are hungry, sleep-deprived, or anxious about home? Physical safety, emotional safety, belonging, and esteem all come before cognitive engagement. Your classroom must address all these layers.

**Understanding the Behavior Iceberg:** What we see (the behavior) is only the tip. Below the surface: triggers (what happened just before), underlying emotions (fear, shame, frustration, boredom), unmet needs (connection, control, competence), and history (past experiences in school). Train yourself to ask 'Why might this student be doing this?' before responding.

**Common Behavioral Patterns in Grade ${g}:** ${g <= 3 ? "Impulsivity, difficulty waiting their turn, tattling, tears during frustration, and hyperactivity are developmentally normal. They are not defiance — they are the result of an immature prefrontal cortex." : g <= 6 ? "Social comparison, exclusion behaviors, testing limits, and emotional outbursts when embarrassed are common. Students are navigating peer identity and need belonging more than ever." : "Defiance of authority, mood swings, social drama, risk-taking, and disengagement can appear. These are driven by adolescent brain development — not personal attacks on the teacher."}

**The ABCs of Behavior:** Antecedent (what came before) → Behavior (what occurred) → Consequence (what followed). Teachers can intervene at any point: modify the antecedent (change the setup), teach an alternative behavior, or adjust consequences to reinforce desired behavior. ABC analysis is a professional tool used by school psychologists that every teacher should know.

**Stress Response and the Threat Brain:** When students feel threatened (academically, socially, or emotionally), the amygdala activates a fight-flight-freeze response. In this state, the prefrontal cortex — responsible for rational thought and learning — is offline. No learning happens in a threat state. Your job is to help students feel safe before expecting engagement.

**Attachment and Teacher Relationships:** Secure attachment with at least one trusted adult is the single greatest protective factor for at-risk students. Even brief, genuine daily check-ins ('How are you doing?') build this attachment. Students learn more from teachers they feel connected to.

**Trauma-Informed Teaching:** ${g <= 5 ? "Even young children carry trauma. ACEs (Adverse Childhood Experiences) affect brain development and learning." : "Adolescents may have complex trauma histories. Triggers can be subtle."} Key trauma-informed principles: safety, trustworthiness, choice, collaboration, and empowerment. Avoid power struggles — offer controlled choices instead.

**Emotional Regulation Strategies:** Teach students to identify emotions using a 'feeling thermometer.' Use co-regulation first (your calm regulates their nervous system), then teach self-regulation strategies: deep breathing, counting to 10, a 'calm corner' space in the classroom. This is not soft teaching — it is neuroscience-based best practice.

**When to Refer:** Know when behavior requires specialist support. Signs: persistent aggression, self-harm, extreme withdrawal, major academic regression, or disclosure of abuse. Document observations, follow school protocols, and involve the school counselor or psychologist promptly.`,
      activity: {
        title: "Behaviour Reflection Journal",
        description:
          "Analyze a recent classroom behaviour incident using psychological principles.",
        tasks: [
          "Describe one behaviour challenge you observed recently (no names)",
          "Identify the possible unmet need behind the behaviour",
          "Write one proactive strategy you could use next time",
          "Reflect: How did your own emotion affect your response?",
        ],
      },
      moduleQuiz: [
        {
          question: "Behaviour is always a form of what?",
          options: ["Defiance", "Communication", "Attention-seeking", "Habit"],
          answer: 1,
        },
        {
          question:
            "Which psychologist developed the theory of cognitive stages?",
          options: ["Vygotsky", "Freud", "Piaget", "Maslow"],
          answer: 2,
        },
        {
          question: "What does a trauma-informed classroom prioritize?",
          options: [
            "Strict rules",
            "Safety and predictability",
            "Academic performance",
            "Competition",
          ],
          answer: 1,
        },
        {
          question:
            "What is the first step when a student displays challenging behaviour?",
          options: [
            "Punish immediately",
            "Stay calm and observe",
            "Call parents",
            "Send to principal",
          ],
          answer: 1,
        },
        {
          question: "Positive reinforcement means?",
          options: [
            "Ignoring bad behaviour",
            "Rewarding good behaviour",
            "Punishing mistakes",
            "Removing privileges",
          ],
          answer: 1,
        },
      ],
    },
    {
      id: "m4",
      videoUrl: "https://www.youtube.com/embed/jTH3ob1IRFo",
      title: "Managing Classroom Environment",
      duration: "60 min",
      content: `The physical and emotional environment of a classroom profoundly affects learning. Research by Robert Marzano identifies classroom management — including environment design — as accounting for 50% of the variance in student achievement.

**Physical Space Design:** For Grade ${g}, consider the flow of movement. Can students move between activities without bottlenecks? Are desks arranged to support the dominant activity type (rows for independent work, clusters for collaboration, a circle for discussion)? Flexible furniture options are ideal; if unavailable, plan how desks can be rearranged quickly and quietly.

**Seating Arrangements and Their Purposes:** Rows signal individual accountability. Clusters signal collaboration. A horseshoe or circle signals whole-class discussion. U-shapes allow eye contact while retaining writing surfaces. For Grade ${g}, vary your arrangement at least once a week to signal different modes of learning.

**Classroom Zones:** Create distinct zones if space allows: a 'learning zone' at desks for instruction, a 'quiet zone' for individual reading or reflection, a 'collaborative zone' for group work, and a 'calm corner' with sensory tools for students needing emotional regulation. Clear visual boundaries (rugs, labels, low furniture) help students navigate independently.

**Displays and Visual Environment:** Research by the University of Salford found that well-designed visual environments can boost learning by up to 25%. For Grade ${g}: display student work (not just exemplars — process work too), post anchor charts created collaboratively, ensure displays are current and relevant. Avoid cluttered 'wallpaper' displays that overwhelm sensory systems.

**Lighting and Sound:** Natural light improves mood and attention. If you have windows, maximize their use. Fluorescent overhead lighting can be harsh — use lamps, warm bulbs, or natural light where possible. Sound management: carpet reduces noise. Background music during independent work (60-70 BPM instrumental) can improve focus for many learners.

**Temperature and Air Quality:** Stuffy classrooms reduce oxygen, increasing fatigue and reducing cognitive performance. Open windows when possible. Teach students the '3-minute airing' habit. Ideal classroom temperature for learning is 18-21°C.

**Emotional Climate:** The most important 'environment' is the emotional one. Is your classroom a place where mistakes are welcomed as learning? Are all students valued equally? Do students feel physically safe from bullying? Emotional safety is the foundation — without it, physical design is irrelevant.

**Routines as Environmental Structure:** Predictable routines reduce cognitive load (students don't have to think about 'what do I do now?') and anxiety. For Grade ${g}, establish: arrival routine, transition signal, materials distribution system, noise level expectations, end-of-day pack-up routine. Practice these until they are automatic.

**Managing Transitions:** Transitions (between activities, subjects, or locations) are the highest-risk moments for behavioral disruption. Time them carefully. Use countdowns ('You have 2 minutes to finish and pack away'). Have the next activity ready to start immediately — dead time breeds chaos.

**Restorative Space vs. Punishment Space:** A 'calm corner' is not a naughty corner. It is a restorative space where students can self-regulate before returning to learning. Equip it with: breathing prompt cards, stress balls, a feelings chart, and noise-canceling headphones if available. Frame its use positively: 'Do you need a moment to reset?'`,
      activity: {
        title: "Classroom Design Challenge",
        description:
          "Plan an improved physical or virtual classroom setup for better learning.",
        tasks: [
          "Draw a simple map of your current classroom seating",
          "Identify one area that causes disruption or distraction",
          "Propose one change to the physical setup",
          "List 3 classroom routines that save time and reduce transitions",
        ],
      },
      moduleQuiz: [
        {
          question: "What is the ideal classroom temperature for learning?",
          options: [
            "Below 18 degrees",
            "18-22 degrees Celsius",
            "25-30 degrees",
            "Above 30 degrees",
          ],
          answer: 1,
        },
        {
          question: "Which seating arrangement best promotes collaboration?",
          options: [
            "Rows facing board",
            "U-shape or clusters",
            "Individual desks spaced apart",
            "No fixed arrangement",
          ],
          answer: 1,
        },
        {
          question: "Classroom routines help by?",
          options: [
            "Making the day predictable",
            "Reducing teacher workload only",
            "Limiting student choices",
            "Creating boredom",
          ],
          answer: 0,
        },
        {
          question: "Environmental print refers to?",
          options: [
            "Printing assignments",
            "Posters and labels that support literacy",
            "Digital displays",
            "Bulletin boards only",
          ],
          answer: 1,
        },
        {
          question: "Good classroom acoustics matter most for?",
          options: [
            "Decoration",
            "Student safety",
            "Communication and listening",
            "Technology use",
          ],
          answer: 2,
        },
      ],
    },
    {
      id: "m5",
      videoUrl: "https://www.youtube.com/embed/l_Vqp1dPuPo",
      title: "Building Positive Relationships",
      duration: "65 min",
      content: `Relationship-based teaching is not a soft skill — it is the most evidence-backed driver of student success. John Hattie's Visible Learning meta-analysis found teacher-student relationships have an effect size of 0.72 (extremely high). For Grade ${g} teachers, this module is foundational.

**The Relationship Investment Framework:** Think of relationships like bank accounts. Every positive interaction (a genuine greeting, a word of encouragement, noticing an interest) is a deposit. Every correction, criticism, or negative interaction is a withdrawal. For relationships to sustain the inevitable withdrawals (corrections, difficult feedback), you need a substantial surplus. Aim for a 5:1 positive-to-corrective ratio.

**Learning Student Names Correctly:** Pronouncing names correctly communicates respect. For Grade ${g}, invest time in the first week learning every student's name and how they prefer to be called. Use name cards, name games, and mnemonic strategies. Nothing starts a relationship on the wrong foot faster than consistently mispronouncing a student's name.

**Daily Check-Ins:** The '2x10 Strategy' by Raymond Wlodkowski: spend 2 minutes per day for 10 consecutive days in genuine, non-academic conversation with a student who is struggling relationally. Research shows this transforms even the most challenging relationships. Apply this proactively — not just reactively.

**Noticing and Validating:** Develop the habit of noticing positive things: effort, improvement, kindness, creativity, perseverance. Verbalize what you notice specifically: 'I noticed how you helped [student] when they were stuck — that showed real generosity.' Vague praise ('Good job') is far less effective than specific observation.

**Student Interest Inventories:** Complete interest surveys at the start of the year and again at mid-year. ${g <= 5 ? `For Grade ${g} students, ask about: favourite subjects, hobbies, pets, family, favourite books, what they find hard, what they want to learn.` : `For Grade ${g} students, explore: passions, career interests, favourite media, learning strengths, challenges, and aspirations.`} Use this data to personalize examples, check-ins, and recommendations.

**Class Community Building:** Strong peer relationships support the teacher-student relationship. Use community circles, collaborative projects, and class agreements to build belonging. A class that feels like a community is easier to teach and manage.

**Navigating Difficult Relationships:** Some students will push back. Do not take it personally — it is often a test of safety ('Will this adult give up on me like others have?'). Use the '2x10 strategy.' Remain consistent, warm, and boundaried. Never engage in power struggles. Brief, calm, private conversations are more effective than public confrontations.

**Cultural Humility:** Understand your own cultural lens and its limitations. Seek to understand students' cultural backgrounds, family structures, and values. Avoid deficit thinking (what students lack) in favor of asset thinking (what students bring). Build relationships across cultural differences with genuine curiosity, not assumptions.

**Staff-Student Boundaries:** Positive relationships require professional boundaries. Maintain appropriate physical boundaries, avoid personal disclosures that center the teacher, and follow school policy on social media contact with students. Warm relationships within clear professional boundaries are both possible and essential.

**Repair After Conflict:** Even the best teachers lose patience occasionally. When this happens, model repair: a brief, genuine acknowledgment ('I was frustrated yesterday and I raised my voice — I shouldn't have done that. I'm sorry.') builds trust enormously and models conflict resolution for students.`,
      activity: {
        title: "Relationship Mapping",
        description:
          "Reflect on your relationships with students and identify growth areas.",
        tasks: [
          "Name 3 students you connect with easily and why",
          "Name 2 students you find it harder to connect with",
          "Identify one action to strengthen a challenging relationship this week",
          "Write a personal affirmation about your role as a teacher",
        ],
      },
      moduleQuiz: [
        {
          question:
            "What is the foundation of positive teacher-student relationships?",
          options: [
            "Strictness",
            "Trust and respect",
            "Academic excellence",
            "Discipline",
          ],
          answer: 1,
        },
        {
          question:
            "High expectations with high support describes which approach?",
          options: [
            "Authoritarian",
            "Permissive",
            "Authoritative or Warm Demander",
            "Neglectful",
          ],
          answer: 2,
        },
        {
          question: "Greeting students at the door achieves?",
          options: [
            "Wasting time",
            "Building connection and setting tone",
            "Following rules",
            "Improving attendance data",
          ],
          answer: 1,
        },
        {
          question: "Active listening involves?",
          options: [
            "Waiting for your turn to speak",
            "Giving full attention and reflecting back",
            "Nodding without processing",
            "Solving the problem immediately",
          ],
          answer: 1,
        },
        {
          question: "Repair after conflict with a student means?",
          options: [
            "Pretending it did not happen",
            "Holding a grudge",
            "Acknowledging the incident and moving forward together",
            "Writing a report",
          ],
          answer: 2,
        },
      ],
    },
    {
      id: "m6",
      videoUrl: "https://www.youtube.com/embed/Iq2FqJn2uLM",
      title: "Inclusive Education Practices",
      duration: "70 min",
      content: `Every classroom is diverse. Inclusive education means ensuring all students — regardless of ability, background, language, or need — have genuine access to quality learning. For Grade ${g} teachers, inclusion is not an add-on; it is the baseline expectation.

**The UDL Framework (Universal Design for Learning):** UDL, developed at CAST, provides three principles for inclusive design: Multiple Means of Representation (present information in multiple formats), Multiple Means of Action & Expression (let students respond in multiple ways), and Multiple Means of Engagement (provide multiple ways to motivate and sustain effort). Design every lesson with UDL in mind before making individual accommodations.

**Identifying Diverse Learning Needs in Grade ${g}:** ${g <= 3 ? "Look for: students not yet reading at grade level, difficulty with fine motor tasks, language development differences, attention challenges, and social communication differences." : g <= 6 ? "Look for: processing difficulties, working memory challenges, dyslexia, dyscalculia, anxiety, ADHD, giftedness, and English Language Learners." : "Look for: undiagnosed learning disabilities presenting as behavior, anxiety, executive function challenges, gifted students who are disengaged, and students with IEPs or 504 plans."}

**Differentiation Strategies:** Differentiate by Content (what students learn), Process (how they learn it), Product (how they demonstrate learning), and Environment (where/how conditions support learning). Use tiered tasks, choice boards, scaffolded resources, and extension menus. Differentiation does not mean different work for every student — it means flexible pathways to the same learning goal.

**Supporting English Language Learners (ELL):** Key strategies: visuals to accompany all verbal instruction, sentence frames for speaking and writing, peer translation where possible, extra processing time, vocabulary pre-teaching, and culturally responsive content. Celebrate bilingualism as an asset.

**Supporting Students with ADHD:** Preferential seating (near teacher, away from distractions), frequent movement breaks, chunked tasks with clear checkpoints, fidget tools, visual schedules, and reduced working memory demands. Clear and concise instructions, visual checklists, and immediate feedback are particularly effective.

**Gifted Students:** Giftedness requires challenge, not just speed. Avoid simply giving more of the same work. Offer: depth (more complex aspects of the same topic), breadth (connections to other disciplines), acceleration (only when appropriate and desired), and creative/open-ended challenges. Gifted students have social-emotional needs too — belonging and avoiding perfectionism.

**Collaborating with Support Staff:** If your school has learning support officers (LSOs), special education teachers, or ELL support staff, view them as co-teachers, not aides. Plan together, debrief together, and ensure they are positioned to support all students, not only the students they are assigned to.

**The IEP and Its Classroom Implications:** For students with Individual Education Plans, read and understand their plans before the school year begins. Know: the student's goals, accommodations, modifications, and how progress is measured. Implement consistently and document as required.

**Avoiding Exclusion in Group Work:** Watch group dynamics carefully. Students with learning differences are often subtly excluded from group contributions. Assign specific roles, ensure equitable contribution expectations, and debrief on teamwork explicitly. Intervene immediately when exclusion occurs.

**Reflection on Bias:** Every teacher carries implicit biases about which students are 'good' learners. Use data (grades, participation records, who you call on) to identify patterns. Actively redistribute attention, challenge, and recognition equitably. Inclusion requires ongoing self-examination.`,
      activity: {
        title: "Inclusion Audit",
        description:
          "Evaluate how inclusive your current teaching practice is.",
        tasks: [
          "List 3 students in your class with diverse learning needs",
          "Identify one adaptation you currently make for a specific learner",
          "Find one new inclusive strategy from this module to try next week",
          "Reflect: Does every student in my class feel they belong?",
        ],
      },
      moduleQuiz: [
        {
          question: "Inclusive education means?",
          options: [
            "Separate classrooms for different needs",
            "All students learning together with appropriate support",
            "Only students with disabilities get extra help",
            "Gifted students are fast-tracked",
          ],
          answer: 1,
        },
        {
          question: "UDL stands for?",
          options: [
            "Unified Design for Learning",
            "Universal Design for Learning",
            "Unique Differentiated Learning",
            "United Digital Learning",
          ],
          answer: 1,
        },
        {
          question: "Which of these is a reasonable accommodation?",
          options: [
            "Easier tests for all",
            "Extra time for a student with dyslexia",
            "Skipping content for struggling students",
            "Allowing some students to not participate",
          ],
          answer: 1,
        },
        {
          question: "Differentiation means?",
          options: [
            "Teaching the same way to everyone",
            "Adjusting instruction to meet diverse needs",
            "Giving different marks to different students",
            "Having separate lesson plans for every student",
          ],
          answer: 1,
        },
        {
          question: "The social model of disability says?",
          options: [
            "Disability is a medical problem",
            "Society creates barriers that disable people",
            "People with disabilities cannot learn",
            "Teachers cannot support students with disabilities",
          ],
          answer: 1,
        },
      ],
    },
    {
      id: "m7",
      videoUrl: "https://www.youtube.com/embed/LZ5spXfDYo0",
      title: "Student Engagement Strategies",
      duration: "60 min",
      content: `Engagement is not compliance. A student sitting quietly is not necessarily learning. True engagement — intellectual curiosity, emotional investment, and active processing — requires deliberate design. This module gives Grade ${g} teachers a practical toolkit.

**The Three Dimensions of Engagement:** Behavioral engagement (on-task behavior), Cognitive engagement (deep processing, questioning), and Emotional engagement (caring about the learning). Compliance gives you behavioral engagement. Genuine teaching creates all three.

**The Hook: Opening Lesson Engagement:** The first 5 minutes determine the cognitive and emotional tone of the lesson. Use: a provocative question, an anomaly or surprising fact, a short video clip, a challenge or puzzle, or a connection to students' lives. For Grade ${g}, the hook should be immediately accessible — no front-loading of concepts.

**Active Learning Structures:** Replace passive listening with: Think-Pair-Share, Turn-and-Talk, jigsaws, numbered heads together, inside-outside circles, quiz-quiz-trade, and classroom debates. These structures ensure every student processes every idea, not just confident volunteerers.

**Cold Calling vs. No Opt Out:** Avoid patterns where only eager volunteers answer. Use equity sticks (random name selection), No Opt Out (if a student says 'I don't know,' redirect to a peer who does, then return to the original student), and wait time (5+ seconds) to increase all students' cognitive engagement.

**Questioning Strategies:** Use Bloom's taxonomy to vary question types: knowledge (recall), comprehension (explain), application (use in a new context), analysis (compare/contrast), synthesis (create), evaluation (judge with criteria). For Grade ${g}, scaffold questioning from lower to higher order within a lesson.

**Choice and Autonomy:** ${g <= 4 ? "Even young learners are highly motivated by small choices: which book to read, which strategy to use, where to sit during independent work." : "Older students are highly motivated by genuine choice in topics, formats, and processes."} Autonomy-supportive teaching predicts higher intrinsic motivation and achievement.

**Relevance and Real-World Connections:** Regularly ask and answer: 'When would you use this in real life?' For Grade ${g}, connect learning to students' immediate world — their interests, family, community, and current events. Abstract content with no relevance quickly loses student engagement.

**The Zeigarnik Effect:** Humans remember uncompleted tasks better than completed ones. Use cliffhangers: end lessons before fully resolving a problem. Start the next lesson returning to the unresolved question. This creates intellectual tension that pulls students into learning.

**Re-engagement After Disengagement:** When a student disengages, a private, quiet check-in is more effective than public redirection. Whisper: 'I noticed you've drifted a little — is everything okay? What part of this is hard for you?' This is a relationship-first approach that respects dignity and gathers information.

**Tracking Engagement Data:** Use participation tracking over time to ensure equity. Note: who volunteers, who you call on, who participates in group work. Patterns reveal invisible students. Make visible students visible by creating structured opportunities for their voice and contribution.`,
      activity: {
        title: "Engagement Experiment",
        description:
          "Plan and commit to trying one new engagement strategy this week.",
        tasks: [
          "Identify one lesson where student engagement is usually low",
          "Choose one strategy from this module to try in that lesson",
          "Predict what might happen when you try it",
          "After trying it, note what changed (this is a reflection task to revisit)",
        ],
      },
      moduleQuiz: [
        {
          question: "Student engagement has how many dimensions?",
          options: [
            "1 - behavioural",
            "2 - behavioural and emotional",
            "3 - behavioural, emotional, cognitive",
            "4 - physical, emotional, social, academic",
          ],
          answer: 2,
        },
        {
          question: "The Zeigarnik Effect says students remember?",
          options: [
            "Completed tasks better",
            "Incomplete tasks better",
            "Visual information better",
            "Auditory information better",
          ],
          answer: 1,
        },
        {
          question: "Exit tickets are used for?",
          options: [
            "Taking attendance",
            "Checking understanding at end of lesson",
            "Homework reminders",
            "Grading participation",
          ],
          answer: 1,
        },
        {
          question: "Cold calling works best when?",
          options: [
            "Used as punishment",
            "Combined with wait time and psychological safety",
            "Used only for easy questions",
            "Students can opt out",
          ],
          answer: 1,
        },
        {
          question: "Gamification in education means?",
          options: [
            "Playing video games in class",
            "Using game elements like points and levels to motivate learning",
            "Only using board games",
            "Replacing lessons with games",
          ],
          answer: 1,
        },
      ],
    },
    {
      id: "m8",
      videoUrl: "https://www.youtube.com/embed/HAnw168huqA",
      title: "Effective Communication",
      duration: "65 min",
      content: `Communication is the medium through which all teaching happens. How you speak, listen, and respond shapes the intellectual and emotional culture of your Grade ${g} classroom. This module covers communication with students, families, and colleagues.

**Verbal Communication with Students:** Clarity is kindness. Use simple, precise language appropriate for Grade ${g}. Avoid educational jargon in student-facing communication. Give one instruction at a time. Check comprehension with: 'Can someone paraphrase what I just asked?' not 'Does everyone understand?' (students rarely admit they don't).

**Non-Verbal Communication:** Research by Albert Mehrabian suggests 55% of communication is non-verbal (body language, facial expression), 38% is vocal tone, and only 7% is words. For Grade ${g} teachers: scan the room regularly with warm, acknowledging eye contact. Use open body posture (uncrossed arms, relaxed shoulders, slight lean forward). Position yourself at student eye level during 1-on-1 interactions.

**Active Listening:** Students who feel truly heard engage more and behave better. Active listening practices: face the speaker, reduce distractions, paraphrase back ('So what I'm hearing is...'), validate feelings before problem-solving ('That sounds really frustrating'), ask open questions ('Tell me more about that').

**Giving Feedback:** Effective feedback is: specific (not 'good job' but 'your opening sentence creates real intrigue'), timely (as close to the work as possible), actionable (tells the student what to do next), and growth-oriented (focused on improvement, not final judgment). Use the 'sandwich' sparingly — leading with strengths, noting development areas, closing with encouragement.

**Delivering Difficult Messages:** For Grade ${g}, you will sometimes need to have uncomfortable conversations — about behavior, progress, or sensitive topics. Key principles: private settings (never humiliate publicly), calm tone regardless of your internal state, factual rather than emotional language ('I noticed you...'), and a focus on behavior not character ('You pushed [student]' not 'You are aggressive').

**Communication with Families:** Families are your greatest allies. Communication principles: regular positive contact before any negative contact, clarity about purpose (informative vs. problem-solving), cultural sensitivity, translated materials for non-English-speaking families, and multiple channels (note, phone, digital platform). For Grade ${g}, a weekly communication habit prevents most crises.

**Parent-Teacher Conferences:** Prepare: have data, samples of work, and specific examples ready. Structure: start with positives, address concerns with evidence, invite parent perspective ('What do you notice at home?'), collaboratively agree on next steps, follow up in writing. Never surprise parents with major concerns they haven't heard before.

**Communication in Conflict:** When a parent or student is angry, use the LEAP technique: Listen (hear them out fully), Empathize ('I can understand why that's concerning'), Apologize where appropriate (not where not warranted), Plan (what we'll do differently). Never argue in kind — maintain professional composure always.

**Peer Communication and Collaboration:** Your colleagues are a resource. Communicate openly about what is and isn't working. Participate actively in team meetings. Share resources generously. Seek mentors and offer mentorship. Teaching can be an isolated profession — intentional peer communication combats professional isolation.

**Digital Communication Ethics:** Use professional language in all digital communication. School email is a professional document. Social media presence as a teacher requires careful boundaries. Never communicate with students through personal social media platforms. Follow your school's digital communication policy exactly.`,
      activity: {
        title: "Communication Self-Assessment",
        description:
          "Honestly assess your communication strengths and growth areas as a teacher.",
        tasks: [
          "Rate yourself 1-5 on: clarity of instructions (1=unclear, 5=very clear)",
          "Identify one verbal habit you want to change",
          "Practice writing one piece of student feedback using the sandwich model",
          "Plan one way to improve your non-verbal communication in the classroom",
        ],
      },
      moduleQuiz: [
        {
          question: "The communication iceberg refers to?",
          options: [
            "Only the words we say matter",
            "Most communication is non-verbal and below the surface",
            "Cold communication in winter",
            "Ice-breaking activities",
          ],
          answer: 1,
        },
        {
          question: "Wait time after asking a question should be?",
          options: [
            "Immediate",
            "3-7 seconds",
            "30 seconds",
            "As long as needed",
          ],
          answer: 1,
        },
        {
          question: "Which feedback model is most constructive?",
          options: [
            "Only negative feedback",
            "Positive only",
            "Sandwich model - positive-grow-positive",
            "No feedback at all",
          ],
          answer: 2,
        },
        {
          question: "Para-language includes?",
          options: [
            "Body language",
            "Tone, pitch and pace of voice",
            "Written communication",
            "Facial expressions",
          ],
          answer: 1,
        },
        {
          question: "Active listening means?",
          options: [
            "Listening while doing something else",
            "Giving full attention, nodding, and reflecting",
            "Waiting to respond",
            "Taking detailed notes",
          ],
          answer: 1,
        },
      ],
    },
    {
      id: "m9",
      videoUrl: "https://www.youtube.com/embed/p6e4oE4YpkQ",
      title: "Assessment for Learning",
      duration: "70 min",
      content: `Assessment is one of the most powerful tools a teacher has — and one of the most misunderstood. Assessment of Learning (summative) tells you what a student has learned. Assessment for Learning (formative) actively improves learning while it is happening. For Grade ${g}, the emphasis must shift strongly toward the latter.

**The Assessment Triangle:** All valid assessment rests on three corners: the cognition we want to assess, the observation (task or activity), and the interpretation (what the evidence means about learning). Misalignment at any corner produces misleading data. Before designing an assessment, clarify: exactly what cognitive process are we measuring?

**Formative Assessment Strategies for Grade ${g}:** Exit tickets (1-3 questions at lesson end), traffic light self-assessment (red/orange/green understanding), mini whiteboards (students write answers simultaneously), show of hands (for quick checks — though unreliable alone), observation checklists during work time, peer assessment with structured criteria, and cold-calling with wait time.

**Summative Assessment Design:** Clear success criteria shared before the assessment (not after). Questions/tasks that span all levels of Bloom's Taxonomy. ${g <= 5 ? "Avoid over-reliance on written tests — include oral, practical, and creative demonstrations of understanding." : "Balance written responses with oral, practical, and project-based demonstrations."} Moderation: have a colleague review your assessment before it is given to check alignment and fairness.

**Feedback That Moves Learning Forward:** Dylan Wiliam's research shows that grades alone — without narrative feedback — produce no improvement and can actually reduce motivation. Written feedback should: describe what the student did well, identify 1-2 specific improvements, and set a next action step. Students should respond to feedback (by acting on it), not just receive it.

**Rubrics — Designing and Using Them:** A good rubric: has 3-5 criteria aligned to the learning intention, uses descriptive language (not just 'good/satisfactory/poor'), and has been modeled with exemplars. Involve students in co-creating rubrics — this builds understanding of expectations and ownership of quality.

**Standards-Based Assessment:** Rather than percentage grades, standards-based assessment reports mastery of specific skills: 'Mastery / Developing / Beginning.' For Grade ${g}, this approach communicates more precisely what a student knows and can do, and avoids averaging behaviors (attendance, effort) with academic performance.

**The Data Cycle:** Assess → Analyze → Adjust → Re-assess. Assessment data should directly inform your teaching decisions. If 60% of students got question 3 wrong, re-teach that concept before moving on. If 90% mastered all objectives, accelerate and extend. Let data drive instruction, not intuition alone.

**Accommodations in Assessment:** Students with learning needs may require: extended time, quiet environment, oral rather than written response, scribe, text-to-speech, reduced question length, or familiar examples. These accommodations do not compromise the assessment's validity — they remove barriers so the target skill can be demonstrated.

**Self and Peer Assessment:** Meta-analysis shows self-assessment has one of the highest effect sizes in education. Teach students to self-assess honestly against specific criteria. Teach peer assessment as a professional skill (not judgment). Use structured sentence starters: 'What I notice about your work is...' 'One suggestion I have is...'

**Communicating Assessment Results:** Grades and reports should never surprise students or families. Regular informal feedback should prepare them for formal results. Use parent conferences, student-led conferences, and portfolio share sessions to bring assessment to life as a tool for growth, not judgment.`,
      activity: {
        title: "Assessment Design Practice",
        description:
          "Create or improve one assessment using principles from this module.",
        tasks: [
          "Identify one upcoming lesson and write a clear learning intention",
          "Design one formative check you will use during that lesson",
          "Write one success criterion students can use to self-assess",
          "Reflect: How will you use the data from this assessment to adjust your teaching?",
        ],
      },
      moduleQuiz: [
        {
          question:
            "Assessment FOR learning (formative) is primarily used for?",
          options: [
            "Giving final grades",
            "Guiding ongoing instruction and learning",
            "Ranking students",
            "Reporting to parents",
          ],
          answer: 1,
        },
        {
          question: "Assessment OF learning (summative) examples include?",
          options: [
            "Exit tickets and observations",
            "End-of-term exams and projects",
            "Daily check-ins",
            "Peer feedback",
          ],
          answer: 1,
        },
        {
          question: "Rubrics help students by?",
          options: [
            "Making grading easier for teachers",
            "Clarifying expectations and supporting self-assessment",
            "Reducing the number of questions",
            "Replacing exams",
          ],
          answer: 1,
        },
        {
          question: "Peer assessment is valuable because?",
          options: [
            "It reduces teacher workload",
            "It develops critical thinking and ownership of learning",
            "It is always more accurate",
            "It replaces teacher feedback",
          ],
          answer: 1,
        },
        {
          question: "Diagnostic assessment is done?",
          options: [
            "At the end of a unit",
            "During a lesson",
            "Before instruction to understand prior knowledge",
            "Only for struggling students",
          ],
          answer: 2,
        },
      ],
    },
    {
      id: "m10",
      videoUrl: "https://www.youtube.com/embed/nKIu9yen5nc",
      title: "Professional Reflection & Growth",
      duration: "60 min",
      content: `Teaching is a profession of perpetual learning. The most effective teachers in the world are not those who have arrived at mastery — they are those who continuously reflect, seek feedback, and grow. This final module for Grade ${g} training focuses on building a sustainable, flourishing professional practice.

**The Reflective Practitioner:** Donald Schön's concept of the 'Reflective Practitioner' describes professionals who think during action (reflection-in-action) and after action (reflection-on-action). For Grade ${g} teachers, this means: in the moment, asking 'Is this working? What do I notice?' and after lessons, asking 'What went well? What would I change? What does student work tell me about my teaching?'

**Reflection Protocols:** Structured reflection is more productive than general rumination. Use: the 5-Minute Journal (3 things that went well, 1 thing to improve, 1 intention for tomorrow), video self-analysis (record yourself teaching once per term and review), the 'One Student Focus' (select one student per week and observe their engagement closely), or the Lesson Study model (design, teach, observe, debrief with a colleague).

**Professional Learning Communities (PLCs):** The most powerful professional development is collaborative. PLCs are small teams of teachers who: share a focus question about student learning, collect classroom data, analyze it together, and implement changes. Research by Richard DuFour shows PLCs are the most effective driver of school-wide improvement.

**Feedback from Students:** Regularly invite anonymous student feedback: 'What helps you learn in this class? What makes it harder? What's one thing you'd like more of?' For Grade ${g}, use age-appropriate formats — drawings, sentence starters, or simple rating scales. Student voice is the most direct data source you have. Act on what you receive.

**Classroom Observation and Coaching:** Invite a trusted colleague or instructional coach to observe your teaching. Brief them on a specific focus ('I want feedback on my questioning strategies' not 'Just watch anything'). Debrief within 24 hours. Observation is a professional gift — receive it with curiosity, not defensiveness.

**Professional Reading and Research:** Stay current with educational research. Subscribe to journals, follow evidence-based educators online, attend webinars, and read broadly. Translate research into practice: 'This study found X works — let me try it in my Grade ${g} context and see.' Practitioner inquiry bridges research and reality.

**Setting Professional Goals:** Use the SMART framework for annual professional goals: Specific, Measurable, Achievable, Relevant, Time-bound. For Grade ${g} teachers: goals might be 'By end of Term 2, I will implement formative assessment exit tickets in every lesson and track results to adjust my teaching.' Review and revise goals with your mentor or appraiser.

**Teacher Wellbeing:** You cannot pour from an empty cup. Teaching is high-demand, emotionally intensive work. Protect your wellbeing deliberately: maintain boundaries between school and personal time, develop a support network of trusted colleagues, engage in activities that restore your energy, seek help early when overwhelmed, and recognize that sustainable teaching requires a sustainable teacher.

**Mentoring and Being Mentored:** Seek a mentor — an experienced colleague who will give you honest, supportive guidance. Be a mentor — sharing your experience accelerates both the mentee's and your own professional growth. Mentoring relationships are among the most powerful in the profession.

**Your Legacy:** The best teachers are remembered decades later by their students — not for what they taught, but for how they made students feel, what they believed about students' potential, and the confidence they instilled. Reflect regularly on the kind of teacher you want to be remembered as. Let that vision guide every daily decision in your Grade ${g} classroom.`,
      activity: {
        title: "My Professional Growth Plan",
        description:
          "Create a personal development commitment based on your learning journey.",
        tasks: [
          "Write one professional strength you discovered or confirmed in this training",
          "Identify one area you want to grow in over the next 3 months",
          "Name one colleague you can partner with for peer learning",
          "Write your personal teaching motto or mantra in one sentence",
        ],
      },
      moduleQuiz: [
        {
          question: "Reflective practice in teaching means?",
          options: [
            "Only thinking about what went wrong",
            "Regularly examining your practice to improve it",
            "Writing reports for administration",
            "Following the same routine always",
          ],
          answer: 1,
        },
        {
          question: "A growth mindset teacher believes?",
          options: [
            "Teaching ability is fixed",
            "Students either have ability or they do not",
            "Their own practice can always improve",
            "Professional development is optional",
          ],
          answer: 2,
        },
        {
          question: "PLCs (Professional Learning Communities) are?",
          options: [
            "Parent-teacher associations",
            "Teacher support groups for shared learning and improvement",
            "Admin meetings",
            "Online courses",
          ],
          answer: 1,
        },
        {
          question: "Reflective journaling helps teachers by?",
          options: [
            "Creating paperwork",
            "Building self-awareness and tracking growth",
            "Impressing administrators",
            "Replacing lesson planning",
          ],
          answer: 1,
        },
        {
          question: "The best professional development is?",
          options: [
            "One-off workshops",
            "Continuous, job-embedded, and collaborative",
            "Self-directed only",
            "Externally mandated",
          ],
          answer: 1,
        },
      ],
    },
  ];
}

export const GRADE_CONTENT: GradeContent[] = Array.from(
  { length: 10 },
  (_, i) => {
    const grade = i + 1;
    return {
      grade,
      title: `Grade ${grade} Teacher Training`,
      modules: buildModules(grade),
      videos: [
        {
          title: "E-Classroom Management",
          url: "https://www.youtube.com/embed/oSm1WJ-a_KM",
        },
        {
          title: "How to Conduct Activities",
          url: "https://www.youtube.com/embed/pGS_P8-dIvY",
        },
        {
          title: "Child Behaviour & Psychology",
          url: "https://www.youtube.com/embed/0daMC9OIXaI",
        },
        {
          title: "Managing Classroom Environment",
          url: "https://www.youtube.com/embed/mHHy9WW9qxo",
        },
        {
          title: "Building Positive Relationships",
          url: "https://www.youtube.com/embed/l7ToNT0cHiA",
        },
        {
          title: "Inclusive Education Practices",
          url: "https://www.youtube.com/embed/HoVd6tlAVXs",
        },
        {
          title: "Student Engagement Strategies",
          url: "https://www.youtube.com/embed/3-SHCRrJ3Ew",
        },
        {
          title: "Effective Communication",
          url: "https://www.youtube.com/embed/HEyd-_8jbs0",
        },
        {
          title: "Assessment for Learning",
          url: "https://www.youtube.com/embed/vJsJFBMFgXo",
        },
        {
          title: "Professional Reflection & Growth",
          url: "https://www.youtube.com/embed/h-BEYEnfA6I",
        },
      ],
      quiz: [
        {
          question: `Which behavior management approach is most effective for Grade ${grade} students?`,
          options: [
            "Punitive consequences only",
            "Relationship-based, proactive management",
            "Ignoring misbehavior",
            "Strict silence policies",
          ],
          answer: 1,
        },
        {
          question: "What does UDL stand for in inclusive education?",
          options: [
            "Universal Design for Learning",
            "Unified Development of Literacy",
            "Unique Differentiated Lessons",
            "Universal Daily Learning",
          ],
          answer: 0,
        },
        {
          question: "What is the 5:1 ratio in relationship-based teaching?",
          options: [
            "5 lessons per day",
            "5 positive interactions for every 1 correction",
            "5 students per group",
            "5 minutes of feedback per student",
          ],
          answer: 1,
        },
        {
          question: "What is Assessment FOR Learning (formative assessment)?",
          options: [
            "End-of-year exams",
            "Grades in a report card",
            "Ongoing feedback that improves learning while it happens",
            "Standardized national testing",
          ],
          answer: 2,
        },
        {
          question: "What is the Behaviour Iceberg model?",
          options: [
            "A classroom seating plan",
            "Visible behavior is only the surface; triggers and unmet needs lie beneath",
            "A cooling-down strategy",
            "A science lesson model",
          ],
          answer: 1,
        },
        {
          question:
            "Which room arrangement best supports whole-class discussion?",
          options: [
            "Rows facing front",
            "Circle or horseshoe",
            "Clusters of 6",
            "Individual pods",
          ],
          answer: 1,
        },
        {
          question: "What is the Zeigarnik Effect in teaching?",
          options: [
            "Students learn better with music",
            "Unresolved problems create intellectual tension that pulls students into learning",
            "Students forget overnight",
            "Short lessons are always better",
          ],
          answer: 1,
        },
        {
          question: "What is trauma-informed teaching?",
          options: [
            "Teaching students who are injured",
            "Adjusting practice to recognize and respond sensitively to trauma's effects on learning",
            "A crisis response procedure",
            "Therapy delivered in classrooms",
          ],
          answer: 1,
        },
        {
          question:
            "What should professional feedback to students always include?",
          options: [
            "A grade and a rank",
            "Specific strengths, one improvement area, and a next step",
            "A comparison to peers",
            "Only positive comments",
          ],
          answer: 1,
        },
        {
          question:
            "What is the most powerful professional development model according to research?",
          options: [
            "One-day workshops",
            "Online self-paced courses only",
            "Professional Learning Communities (PLCs) with shared data and reflection",
            "Annual performance reviews",
          ],
          answer: 2,
        },
      ],
    };
  },
);

export { MODULE_TITLES };
