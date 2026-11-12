# 💰 Finova — Personal Finance Dashboard

**Finova** is a modern personal finance dashboard designed to help users track income, expenses, budgets, savings goals, and overall financial activity in one place.

Built with **HTML, CSS, JavaScript, Firebase Authentication, and Cloud Firestore**, Finova provides a secure, responsive, and user-friendly experience for managing personal finances.

### 🌐 Live Demo

**[Open Finova](https://finova-a6602.web.app/)**

---

## ✨ Features

### 🔐 Authentication
- Firebase Email/Password Authentication
- Secure user accounts
- User-specific financial data

### 💳 Transaction Management
- Add income and expenses
- Edit existing transactions
- Delete transactions
- Automatic balance calculation
- Automatic income and expense calculation
- Savings tracking

### 📊 Financial Analytics
- Income vs. expense analysis
- Expense category breakdown
- Financial overview dashboard
- Smart financial insights

### 🎯 Budget & Savings Management
- Create monthly budgets
- Track spending progress
- Budget alerts
- Create savings goals
- Monitor goal progress

### 🔎 Productivity
- Search transactions
- Filter transactions
- Export transactions as CSV

### 🎨 User Experience
- Dark/Light mode
- Responsive design
- Mobile-friendly layout
- Clean and intuitive dashboard

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Application structure |
| **CSS3** | Styling and responsive design |
| **JavaScript** | Application logic |
| **Firebase Authentication** | User authentication |
| **Cloud Firestore** | Database |
| **Firebase Hosting** | Production deployment |
| **Git & GitHub** | Version control |

---

## 🏗️ Project Structure

```text
Finova/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── firebase.js
│   └── app.js
├── firestore.rules
├── firebase.json
├── .gitignore
└── README.md
```

---

## 🔥 Firebase Architecture

Finova uses Firebase for authentication, database management, and hosting.

### Authentication

Users authenticate using Firebase Email/Password Authentication.

### Firestore

Financial information is stored under each authenticated user's UID:

```text
users/
└── {uid}/
    ├── transactions/
    ├── budgets/
    └── goals/
```

Firestore security rules ensure that authenticated users can only access their own financial records.

---

## 🔒 Security

Finova uses Firestore security rules based on the authenticated user's UID.

The application follows the principle:

```text
User → Authentication → UID → User-specific Firestore data
```

This prevents one authenticated user from accessing another user's financial records.

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/oishipaul45-engineer/Finova-Financial-Dashboard.git
```

### 2. Enter the project directory

```bash
cd Finova-Financial-Dashboard
```

### 3. Start a local server

For example:

```bash
python -m http.server 5500
```

### 4. Open Finova

Visit:

```text
http://localhost:5500
```

> Finova should be served through a local web server rather than opened directly using `file://`, because the application uses JavaScript modules.

---

## 🌐 Deployment

Finova is deployed using **Firebase Hosting**.

Production URL:

**https://finova-a6602.web.app**

To deploy an updated version:

```bash
firebase deploy --only hosting
```

---

## 📦 Firebase Configuration

The project uses the Firebase project:

```text
finova-a6602
```

Firebase services used:

- Firebase Authentication
- Cloud Firestore
- Firebase Hosting

---

## 📈 Future Improvements

Possible future improvements include:

- Recurring transactions
- Advanced financial reports
- More detailed analytics
- Custom categories
- Financial reminders
- Improved budget recommendations
- PWA/offline support
- Custom domain support

---

## 👩‍💻 Author

**Oishi Paul**

Built as a personal finance management project using modern web technologies and Firebase.

---

## 📄 License

This project is available for educational and personal use.
