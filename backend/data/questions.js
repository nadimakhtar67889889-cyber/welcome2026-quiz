/**
 * WELCOME 2026 — QUIZ QUESTION BANK
 * -----------------------------------------------------------------
 * This is the ONLY file you need to edit once Suresh Sir / the
 * professor shares the real questions. Everything else in the app
 * reads from this list automatically.
 *
 * Fields:
 *  id            unique string, keep as "q1", "q2" ... or anything unique
 *  section       "lecture" | "fundamentals" | "scenario" | "final"
 *                (only used for labelling / analytics, doesn't affect scoring)
 *  question      the question text
 *  options       exactly 4 strings
 *  correctIndex  0-based index into options[] of the correct answer
 *  points        points awarded for a correct answer
 *  timeLimitSec  seconds students get to answer this question
 *
 * Keep exactly 20 questions for Welcome 2026, or change TOTAL below
 * if you add/remove any — nothing else needs to change.
 *
 * Questions marked "[PLACEHOLDER — replace after lecture]" are
 * dummy questions. Swap their text/options once you have the real
 * lecture content from the professor. Everything else (AWS
 * fundamentals + scenario questions) is usable as-is.
 */

const questions = [
  // ---------- LECTURE-BASED (replace after Suresh Sir's talk) ----------
  {
    id: "q1",
    section: "lecture",
    question: "[PLACEHOLDER — replace after lecture] According to the lecture, what is the main idea behind the 'builder mindset'?",
    options: [
      "Waiting for perfect conditions before starting a project",
      "Learning by building real things and iterating",
      "Only using paid tools and services",
      "Avoiding teamwork on technical projects"
    ],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 20
  },
  {
    id: "q2",
    section: "lecture",
    question: "[PLACEHOLDER — replace after lecture] Which cloud deployment model gives the most control over underlying infrastructure?",
    options: ["Software as a Service (SaaS)", "Platform as a Service (PaaS)", "Infrastructure as a Service (IaaS)", "Function as a Service (FaaS)"],
    correctIndex: 2,
    points: 1,
    timeLimitSec: 20
  },
  {
    id: "q3",
    section: "lecture",
    question: "[PLACEHOLDER — replace after lecture] What did the speaker identify as a key benefit of cloud computing for students?",
    options: ["Free unlimited resources forever", "Low barrier to start building real projects", "No need to learn programming", "Guaranteed job placement"],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 20
  },
  {
    id: "q4",
    section: "lecture",
    question: "[PLACEHOLDER — replace after lecture] Fill in from the lecture: cloud computing lets you pay for compute resources ______.",
    options: ["only once a year", "as you use them", "before you use them, in bulk", "only in physical currency"],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 20
  },
  {
    id: "q5",
    section: "lecture",
    question: "[PLACEHOLDER — replace after lecture] What example project did the speaker mention while explaining cloud scalability?",
    options: ["A static offline calculator", "A website handling sudden traffic spikes", "A printed brochure", "A single-user desktop app"],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 20
  },
  {
    id: "q6",
    section: "lecture",
    question: "[PLACEHOLDER — replace after lecture] According to the lecture, what should student builders focus on first?",
    options: ["Perfect UI design", "Shipping a working first version", "Raising funding", "Hiring a large team"],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 20
  },
  {
    id: "q7",
    section: "lecture",
    question: "[PLACEHOLDER — replace after lecture] Which AWS program was mentioned in relation to student builders?",
    options: ["AWS Educate / AWS Student Builder communities", "AWS Marketplace only", "AWS Retail stores", "AWS Physical data tours"],
    correctIndex: 0,
    points: 1,
    timeLimitSec: 20
  },
  {
    id: "q8",
    section: "lecture",
    question: "[PLACEHOLDER — replace after lecture] What mindset did the speaker contrast with the 'builder mindset'?",
    options: ["Consumer-only mindset", "Growth mindset", "Team mindset", "Research mindset"],
    correctIndex: 0,
    points: 1,
    timeLimitSec: 20
  },

  // ---------- AWS / CLOUD FUNDAMENTALS (usable as-is) ----------
  {
    id: "q9",
    section: "fundamentals",
    question: "Which AWS service is primarily used for scalable object storage?",
    options: ["Amazon EC2", "Amazon S3", "Amazon RDS", "AWS Lambda"],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 15
  },
  {
    id: "q10",
    section: "fundamentals",
    question: "Which AWS service provides resizable virtual servers in the cloud?",
    options: ["Amazon S3", "Amazon EC2", "AWS IAM", "Amazon Route 53"],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 15
  },
  {
    id: "q11",
    section: "fundamentals",
    question: "What does IAM primarily manage in AWS?",
    options: ["Network bandwidth", "Users, groups, and permissions", "Physical server temperature", "Domain name registration"],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 15
  },
  {
    id: "q12",
    section: "fundamentals",
    question: "What is an AWS Region?",
    options: [
      "A single physical server",
      "A geographic area containing multiple isolated data centers",
      "A type of storage bucket",
      "A billing plan"
    ],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 15
  },
  {
    id: "q13",
    section: "fundamentals",
    question: "What is an Availability Zone (AZ)?",
    options: [
      "A marketing region for AWS sales",
      "One or more isolated data centers within an AWS Region",
      "A free tier account type",
      "A code editor"
    ],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 15
  },
  {
    id: "q14",
    section: "fundamentals",
    question: "Which AWS service lets you run code without provisioning or managing servers?",
    options: ["Amazon EC2", "AWS Lambda", "Amazon S3", "AWS Direct Connect"],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 15
  },
  {
    id: "q15",
    section: "fundamentals",
    question: "Which AWS service is a managed relational database service?",
    options: ["Amazon RDS", "Amazon S3", "Amazon CloudFront", "AWS Snowball"],
    correctIndex: 0,
    points: 1,
    timeLimitSec: 15
  },
  {
    id: "q16",
    section: "fundamentals",
    question: "What is the main purpose of Auto Scaling in AWS?",
    options: [
      "Automatically encrypting all S3 buckets",
      "Automatically adjusting compute capacity based on demand",
      "Automatically writing application code",
      "Automatically renewing domain names"
    ],
    correctIndex: 1,
    points: 1,
    timeLimitSec: 15
  },

  // ---------- SCENARIO / APPLIED THINKING ----------
  {
    id: "q17",
    section: "scenario",
    question: "A website suddenly receives 10x its normal traffic during a sale. Which cloud concept helps it handle the spike smoothly?",
    options: ["Manual server upgrades once a year", "Elastic scalability", "Turning the website offline", "Reducing image quality permanently"],
    correctIndex: 1,
    points: 2,
    timeLimitSec: 20
  },
  {
    id: "q18",
    section: "scenario",
    question: "A student wants to store thousands of user-uploaded images cheaply and reliably. Which AWS service fits best?",
    options: ["Amazon EC2", "Amazon S3", "AWS IAM", "Amazon Route 53"],
    correctIndex: 1,
    points: 2,
    timeLimitSec: 20
  },
  {
    id: "q19",
    section: "scenario",
    question: "A team wants only specific employees to access their production database, not everyone in the company. What should they configure?",
    options: ["Public S3 bucket for everyone", "Fine-grained IAM permissions", "Disable login entirely", "Share one shared admin password"],
    correctIndex: 1,
    points: 2,
    timeLimitSec: 20
  },

  // ---------- FINAL CHALLENGE ----------
  {
    id: "q20",
    section: "final",
    question: "🔥 FINAL CHALLENGE: Your app's traffic is unpredictable, you don't want to manage servers, and you only want to pay for actual usage. Which combination fits best?",
    options: [
      "A single always-on EC2 instance with fixed capacity",
      "AWS Lambda + Amazon S3, paying only for what you use",
      "A physical on-premise server in your college lab",
      "Manually restarting a server every time traffic grows"
    ],
    correctIndex: 1,
    points: 5,
    timeLimitSec: 30
  }
];

module.exports = questions;
