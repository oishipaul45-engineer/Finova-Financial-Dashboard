# Finova

Finova is a personal finance dashboard built with HTML, CSS, JavaScript, Firebase Authentication and Cloud Firestore.

## Features

- Firebase email/password authentication
- User-specific Firestore data
- Add, edit and delete transactions
- Automatic balance, income, expense and savings calculations
- Income vs expense analytics
- Expense category breakdown
- Search and filter transactions
- CSV export
- Monthly budgets with spending progress
- Budget alerts
- Savings goals
- Smart financial insights
- Dark/light mode
- Responsive mobile layout

## Project structure

```text
Finova/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── firebase.js
│   └── app.js
├── firestore.rules
├── .gitignore
└── README.md
```

## Firebase setup

1. Open the Firebase Console for the `finova-a6602` project.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create/enable **Cloud Firestore Database**.
4. Publish the rules in `firestore.rules`.
5. Serve the project from a local web server or deploy it with GitHub Pages/Firebase Hosting.

The Firebase web configuration is already included in `js/firebase.js`.

## Run locally

Do not open `index.html` directly with `file://` if your browser blocks ES modules.

Using VS Code, install Live Server and open `index.html` with it.

Or use any static server, for example:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial Finova release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## GitHub Pages

After pushing:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Select `main` and `/root`.
5. Save.
6. Open the generated GitHub Pages URL.

## Firestore data structure

```text
users/
  {uid}/
    transactions/
    budgets/
    goals/
```

Each user's Firestore data is protected by the supplied rules so users cannot read or modify another user's records.
