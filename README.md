# 💰 Finova — Personal Finance Dashboard

<p align="center">
  <strong>Track your money. Understand your habits. Build better financial decisions.</strong>
</p>

<p align="center">
  A modern, responsive personal finance dashboard built with HTML, CSS, JavaScript and Firebase.
</p>

<p align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Finova-FFD700?style=for-the-badge)](https://finova-a6602.web.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/oishipaul45-engineer/Finova-Financial-Dashboard)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

</p>

---

## 🌐 Live Demo

### 🚀 [Open Finova](https://finova-a6602.web.app/)

Finova is deployed using **Firebase Hosting** and uses Firebase Authentication and Cloud Firestore for its backend.

---

## 📸 Preview

<p align="center">
  <img src="Screenshot%202026-11-12%20225531.png" width="48%" />
  <img src="Screenshot%202026-11-12%20225547.png" width="48%" />
</p>

<p align="center">
  <img src="Screenshot%202026-11-12%20225603.png" width="48%" />
  <img src="Screenshot%202026-11-12%20225625.png" width="48%" />
</p>

---

## ✨ What is Finova?

**Finova** is a personal finance management dashboard designed to bring everyday financial tracking into one clean interface.

Instead of maintaining separate notes, spreadsheets, or basic expense lists, Finova brings together:

- 💵 Income tracking
- 💳 Expense management
- 📊 Financial analytics
- 🎯 Savings goals
- 📅 Monthly budgets
- 🔎 Transaction search and filtering
- 📥 CSV export
- 🔐 Secure authentication
- ☁️ Cloud-based financial data
- 🌙 Dark and light themes

The goal is simple:

> **Turn financial data into something easy to understand and act upon.**

---

# 🚀 Key Features

## 🔐 Secure Authentication

Finova uses **Firebase Authentication** to provide individual user accounts.

- Email/password authentication
- Secure user sessions
- User-specific financial records
- Firebase-managed authentication

---

## 💳 Transaction Management

Manage everyday financial activity from a single dashboard.

- Add income
- Add expenses
- Edit transactions
- Delete transactions
- Automatic balance calculation
- Automatic income calculation
- Automatic expense calculation
- Savings tracking
- Transaction history

---

## 📊 Financial Analytics

Finova transforms transaction data into visual financial insights.

- Income vs. expense analysis
- Expense category breakdown
- Overall financial summary
- Spending analysis
- Financial insights
- Dynamic dashboard statistics

---

## 🎯 Budgets & Savings Goals

Set financial targets and monitor progress.

### Budgets

- Create monthly budgets
- Track spending progress
- Monitor budget usage
- Budget alerts

### Savings Goals

- Create savings goals
- Set target amounts
- Track progress
- Monitor remaining amounts

---

## 🔎 Smart Transaction Tools

Finding financial information should be quick.

- Search transactions
- Filter transactions
- Categorize transactions
- Export transaction data as CSV

---

## 🎨 Modern User Experience

Finova is designed to work across different screen sizes.

- Responsive interface
- Mobile-friendly layout
- Dark mode
- Light mode
- Clean dashboard
- Interactive visualizations
- Intuitive navigation

---

# 🧠 Why Finova?

Finova focuses on more than simply recording expenses.

The dashboard is designed around three questions:

### 1. Where is my money going?

Transaction categorization and analytics help identify spending patterns.

### 2. Am I staying within my limits?

Budget tracking makes it easier to monitor monthly spending.

### 3. Am I moving toward my goals?

Savings goals provide a clear view of financial progress.

This makes Finova a **decision-support dashboard**, rather than just an expense tracker.

---

# 🏗️ System Architecture

Finova follows a simple client-cloud architecture:

```text
                     ┌──────────────────────┐
                     │       Finova UI      │
                     │   HTML + CSS + JS    │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Firebase             │
                     │ Authentication       │
                     └──────────┬───────────┘
                                │
                              UID
                                │
                                ▼
                     ┌──────────────────────┐
                     │    Cloud Firestore   │
                     │                      │
                     │  Transactions        │
                     │  Budgets             │
                     │  Goals               │
                     └──────────────────────┘
```

---

# 🔥 Firebase Architecture

Finova uses Firebase for authentication, database management and deployment.

## Authentication

Users authenticate using Firebase Email/Password Authentication.

After authentication, each user receives a unique Firebase UID.

## Firestore Structure

Financial information is organized under the authenticated user's UID:

```text
users/
└── {uid}/
    ├── transactions/
    │   └── {transactionId}
    │
    ├── budgets/
    │   └── {budgetId}
    │
    └── goals/
        └── {goalId}
```

This structure keeps each user's financial records separated.

---

# 🔒 Security

Security is an important part of the Finova architecture.

Firestore access is controlled using authentication-based security rules.

The core access model is:

```text
User
  ↓
Firebase Authentication
  ↓
Authenticated UID
  ↓
User-specific Firestore data
```

A user can access their own financial records only when the authenticated UID matches the corresponding user document.

This helps prevent unauthorized access to another user's transactions, budgets or goals.

---

# 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Application structure |
| **CSS3** | Styling and responsive design |
| **JavaScript** | Application logic and interactions |
| **Firebase Authentication** | User authentication |
| **Cloud Firestore** | Cloud database |
| **Firebase Hosting** | Production deployment |
| **Git** | Version control |
| **GitHub** | Source code hosting |

---

# 📁 Project Structure

```text
Finova-Financial-Dashboard/
│
├── index.html
├── finova.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   └── firebase.js
│
├── firestore.rules
├── firebase.json
├── .firebaserc
├── .gitignore
├── Codes.code-workspace
│
├── Screenshot 2026-11-12 225531.png
├── Screenshot 2026-11-12 225547.png
├── Screenshot 2026-11-12 225603.png
├── Screenshot 2026-11-12 225625.png
│
└── README.md
```

---

# 💻 Run Finova Locally

## 1. Clone the repository

```bash
git clone https://github.com/oishipaul45-engineer/Finova-Financial-Dashboard.git
```

## 2. Enter the project directory

```bash
cd Finova-Financial-Dashboard
```

## 3. Start a local server

For example, using Python:

```bash
python -m http.server 5500
```

## 4. Open the application

Visit:

```text
http://localhost:5500
```

> **Important:** Finova should be served through a local web server rather than opened directly using `file://`, because the application uses JavaScript modules and Firebase services.

---

# ☁️ Firebase Setup

The project uses the Firebase project:

```text
finova-a6602
```

Firebase services used:

- Firebase Authentication
- Cloud Firestore
- Firebase Hosting

The Firestore security rules are stored in:

```text
firestore.rules
```

Firebase Hosting configuration is stored in:

```text
firebase.json
```

---

# 🚀 Deployment

Finova is deployed using **Firebase Hosting**.

### Production URL

```text
https://finova-a6602.web.app/
```

### Deploy the latest version

After making changes:

```bash
firebase deploy --only hosting
```

Or deploy all configured Firebase services:

```bash
firebase deploy
```

---

# 🔄 Development Workflow

A typical development workflow is:

```text
1. Modify the application
        ↓
2. Test locally
        ↓
3. Verify Firebase functionality
        ↓
4. Commit changes
        ↓
5. Push to GitHub
        ↓
6. Deploy to Firebase Hosting
```

Example:

```bash
git add .
git commit -m "Update Finova dashboard"
git push
firebase deploy --only hosting
```

---

# 📈 Roadmap

Future improvements planned for Finova include:

- [ ] Recurring transactions
- [ ] Advanced financial reports
- [ ] More detailed analytics
- [ ] Custom transaction categories
- [ ] Financial reminders
- [ ] Improved budget recommendations
- [ ] Advanced spending insights
- [ ] PWA / offline support
- [ ] Custom domain
- [ ] Enhanced mobile experience
- [ ] More powerful financial visualizations

---

# 🎓 Project Highlights

Finova demonstrates practical implementation of:

- Frontend web development
- Responsive UI design
- JavaScript application logic
- Firebase Authentication
- Cloud Firestore
- User-specific database architecture
- Firestore security rules
- Data visualization
- CRUD operations
- Search and filtering
- CSV data export
- Cloud deployment
- Git and GitHub workflow

---

# 👩‍💻 Author

## Oishi Paul

Computer Science / Technology Student & Developer

Finova was developed as a practical project to explore modern web development, cloud-based application architecture and personal finance technology.

### Connect

- GitHub: [@oishipaul45-engineer](https://github.com/oishipaul45-engineer)
- Project Repository: [Finova-Financial-Dashboard](https://github.com/oishipaul45-engineer/Finova-Financial-Dashboard)

---

# 📄 License

This project is available for **educational and personal use**.

---

<p align="center">

### 💰 Finova

**Personal Finance. Smarter Decisions.**

Built with ❤️ using HTML, CSS, JavaScript & Firebase.

</p>
