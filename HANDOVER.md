# Finance Dashboard: Handover Guide

This guide explains what the Finance Dashboard is, how to set it up on your own computer, how to use it every day, and how to improve it later.

You do not need to be a programmer to follow it. Take the steps in order, and copy and paste the commands exactly as shown.

> **Project details**
>
> | Item | Value |
> |---|---|
> | Frontend repository link | <https://github.com/nielton-didi/finance-dashboard-fe.git> |
> | Backend repository link | <https://github.com/nielton-didi/finance-dashboard-be.git> |
> | Handover date | 25 November 2026 |

## Contents

**Getting started**

1. [What this project is](#1-what-this-project-is)
2. [What you need before you start](#2-what-you-need-before-you-start)
3. [Step 1: Download the project](#3-step-1-download-the-project)
4. [Step 2: Prepare the database](#4-step-2-prepare-the-database)
5. [Step 3: Set up the backend](#5-step-3-set-up-the-backend)
6. [Step 4: Set up the frontend](#6-step-4-set-up-the-frontend)
7. [Step 5: Run the project](#7-step-5-run-the-project)
8. [Step 6: First-time setup inside the app](#8-step-6-first-time-setup-inside-the-app)

**Using and looking after it**

9. [Features](#9-features)
10. [Where the numbers come from](#10-where-the-numbers-come-from)
11. [Checks to make before relying on the figures](#11-checks-to-make-before-relying-on-the-figures)
12. [Keeping it safe: backups and passwords](#12-keeping-it-safe-backups-and-passwords)
13. [Updating to a newer version](#13-updating-to-a-newer-version)
14. [Troubleshooting](#14-troubleshooting)
15. [Putting it online for other people](#15-putting-it-online-for-other-people)

**Improving it**

16. [Known limitations](#16-known-limitations)
17. [Ideas for further improvement](#17-ideas-for-further-improvement)
18. [Using AI to make changes](#18-using-ai-to-make-changes)
19. [Technical reference](#19-technical-reference)
20. [Glossary](#20-glossary)
21. [Handover checklist](#21-handover-checklist)

---

## 1. What this project is

The Finance Dashboard is a private website that reads your **AutoCount** accounting data and shows it as financial reports. It **only reads** from AutoCount and never changes anything there.

It has three parts. All three must be running for the website to work:

| Part | What it does | Comparable to |
|---|---|---|
| **Frontend** (`finance-dashboard-fe`) | The pages you see in your web browser | The shop front |
| **Backend** (`finance-dashboard-be`) | Checks who you are, reads AutoCount and does the calculations | The office behind it |
| **Database** (`finance-dashboard-db`) | Stores users, organizations and settings | The filing cabinet |

AutoCount keeps its own separate database for each company:

```
Your browser  ->  Frontend  ->  Backend  ->  finance-dashboard-db   (users and settings)
                                        ->  AutoCount database     (read only, one per company)
```

Your accounting figures are not copied into this project. Each time you open a report, they are read fresh from AutoCount.

---

## 2. What you need before you start

### Software to install

Install these on the computer that will run the project. They are all free.

| Software | Why | Where to get it |
|---|---|---|
| **Node.js**, version 24 (choose "LTS") | Runs the frontend and backend | <https://nodejs.org> |
| **Git** | Downloads the project | <https://git-scm.com/downloads> |
| **SQL Server Express** | Holds the project's own database | <https://www.microsoft.com/sql-server/sql-server-downloads> |
| **SQL Server Management Studio (SSMS)** | A window for working with SQL Server (Windows only) | <https://learn.microsoft.com/ssms> |
| **Visual Studio Code** (recommended) | Opens and edits the project's files | <https://code.visualstudio.com> |

Use a recent Node.js: version 24.11 or newer, 22.13 or newer in version 22, or 20.19 or newer in version 20. The project was tested with 24.15.

If your AutoCount computer already has SQL Server, you can use that one and skip installing SQL Server Express.

### Information to collect

- [ ] Access to the two repositories. If you cannot open the links, send your GitHub username to the developer and ask for access.
- [ ] The administrator password of the SQL Server you will use.
- [ ] For each company: the address of the computer that holds its AutoCount database, and the database name (usually starting with `AED_`).

### How to open a command window

You will type commands into a command window:

- **Windows:** press the Start key, type `cmd`, and open **Command Prompt**. Use Command Prompt, not PowerShell, because PowerShell can block some of these commands.
- **Mac:** open **Terminal** from Applications > Utilities.

Check that the software is ready. Each command should print a version number:

```bash
node -v
npm -v
git --version
```

If you see "not recognized" or "command not found", restart the computer and try again.

---

## 3. Step 1: Download the project

Downloading a project with Git is called **cloning**. Both parts must be cloned **into the same folder**.

**Windows:**

```bat
cd %USERPROFILE%\Documents
mkdir finance-dashboard
cd finance-dashboard
git clone https://github.com/nielton-didi/finance-dashboard-be.git finance-dashboard-be
git clone https://github.com/nielton-didi/finance-dashboard-fe.git finance-dashboard-fe
```

**Mac:**

```bash
cd ~/Documents
mkdir finance-dashboard
cd finance-dashboard
git clone https://github.com/nielton-didi/finance-dashboard-be.git finance-dashboard-be
git clone https://github.com/nielton-didi/finance-dashboard-fe.git finance-dashboard-fe
```

Git may ask you to sign in to GitHub. When it finishes, you should have:

```
finance-dashboard
  finance-dashboard-be
  finance-dashboard-fe
```

---

## 4. Step 2: Prepare the database

This creates the project's own empty database. You only do it once.

### 4.1 Turn on the settings SQL Server needs (Windows)

1. Open **SQL Server Configuration Manager** from the Start menu.
2. Go to **SQL Server Network Configuration** > **Protocols for** your server.
3. Right-click **TCP/IP** and choose **Enable**.
4. Double-click **TCP/IP**, open the **IP Addresses** tab, and scroll to **IPAll** at the bottom. Clear **TCP Dynamic Ports** and set **TCP Port** to `1433`.
   If this server already has a port number there because AutoCount uses it, do not change it. Write the number down and use it instead of `1433` in this guide.
5. Open **SSMS** and connect to your server. Right-click the server name at the top left > **Properties** > **Security**, and choose **SQL Server and Windows Authentication mode**.
6. Restart SQL Server: in Configuration Manager, under **SQL Server Services**, right-click your server and choose **Restart**. If AutoCount uses this server, do this when nobody is working in AutoCount.

### 4.2 Create the database and its login

In SSMS click **New Query**, paste the text below, **replace the password with your own strong one**, and click **Execute**:

```sql
CREATE DATABASE [finance-dashboard-db];
GO
CREATE LOGIN finance_dashboard_app WITH PASSWORD = 'PUT-A-STRONG-PASSWORD-HERE', CHECK_POLICY = ON;
GO
USE [finance-dashboard-db];
CREATE USER finance_dashboard_app FOR LOGIN finance_dashboard_app;
ALTER ROLE db_owner ADD MEMBER finance_dashboard_app;
GO
```

Keep the login name and password. You will need them in Step 3. The login can only use this one database.

### 4.3 If you use a Mac

SQL Server does not install directly on a Mac. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/), open it, and run this on one line, with your own password:

```bash
docker run -d --name mssql -e ACCEPT_EULA=Y -e "MSSQL_SA_PASSWORD=PUT-A-STRONG-PASSWORD-HERE" -p 127.0.0.1:1433:1433 -v mssql-data:/var/opt/mssql mcr.microsoft.com/mssql/server:2022-latest
```

Wait about a minute, then open the database tool inside it:

```bash
docker exec -it mssql /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa
```

Type the same password when asked, paste the text from section 4.2, and type `exit` to leave. After restarting the Mac, start the database again with `docker start mssql`.

---

## 5. Step 3: Set up the backend

### 5.1 Install its parts

**Windows:**

```bat
cd %USERPROFILE%\Documents\finance-dashboard\finance-dashboard-be
npm install
copy .env.example .env
```

**Mac:**

```bash
cd ~/Documents/finance-dashboard/finance-dashboard-be
npm install
cp .env.example .env
```

`npm install` downloads everything the backend needs and can take a few minutes. Messages starting with `warn` are normal.

### 5.2 Create your two secret keys

The project needs two secret values that **you generate yourself**. Nobody gives them to you, and they should be different from anyone else's. Run each command and copy the line it prints.

**Key 1, the encryption key** (for `CREDENTIALS_ENCRYPTION_KEY`):

```bash
npm run generate:encryption-key
```

The key is the last line, about 44 characters, usually ending in `=`. Copy all of it, including the `=`.

**Key 2, the login key** (for `JWT_SECRET`):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

It prints one long line of letters and numbers. Copy all of it.

> **Keep both keys in a password manager.**
> If you lose or change the **encryption key**, the AutoCount passwords saved in the app can no longer be read and must be typed in again for every organization. If you change the **login key**, everyone is logged out and has to log in again.

### 5.3 Fill in the `.env` file

The `.env` file holds your private settings. Open it:

- **Windows:** `notepad .env`
- **Mac:** `open -e .env`

Fill in the values, then save. Do not put spaces around the `=` sign.

| Setting | What to put | Where it comes from |
|---|---|---|
| `APP_DB_HOST` | `localhost` if SQL Server is on this computer; otherwise that computer's address | Your setup |
| `APP_DB_PORT` | `1433` | Section 4.1 |
| `APP_DB_USERNAME` | `finance_dashboard_app` | Section 4.2 |
| `APP_DB_PASSWORD` | The password you chose, inside double quotes | Section 4.2 |
| `APP_DB_NAME` | `finance-dashboard-db` | Leave as it is |
| `JWT_SECRET` | Key 2 | Section 5.2 |
| `JWT_EXPIRES_IN` | `1d` (people stay logged in for up to one day) | Leave as it is |
| `CREDENTIALS_ENCRYPTION_KEY` | Key 1 | Section 5.2 |
| `CORS_ORIGIN` | `http://localhost:3000` | Leave as it is on your own computer |
| `PORT` | `3001` | Leave as it is |

At the bottom are three lines for the **first administrator**. Remove the `# ` at the start of each, and fill them in. The password needs at least 8 characters:

```ini
ADMIN_EMAIL=you@yourcompany.com
ADMIN_FULL_NAME="Your Name"
ADMIN_PASSWORD="choose-a-strong-password"
```

The lines starting with `# AUTOCOUNT_` are optional fine-tuning. Leave them alone.

A finished file looks like this (these are examples, use your own values):

```ini
APP_DB_HOST=localhost
APP_DB_PORT=1433
APP_DB_USERNAME=finance_dashboard_app
APP_DB_PASSWORD="your-database-password"
APP_DB_NAME=finance-dashboard-db

JWT_SECRET=paste-key-2-here
JWT_EXPIRES_IN=1d

CREDENTIALS_ENCRYPTION_KEY=paste-key-1-here

CORS_ORIGIN=http://localhost:3000

PORT=3001

ADMIN_EMAIL=you@yourcompany.com
ADMIN_FULL_NAME="Your Name"
ADMIN_PASSWORD="choose-a-strong-password"
```

> **Never share the `.env` file** or upload it to GitHub, email or chat. Whoever has it can get into your system.

### 5.4 Create the tables and the first administrator

Still in the `finance-dashboard-be` folder:

```bash
npm run migration:run
npm run bootstrap:admin
```

- The first ends with `has been executed successfully` followed by `COMMIT`.
- The second prints `Created admin user ...`.

Then open `.env` again and **delete the three `ADMIN_` lines**. They are no longer needed.

---

## 6. Step 4: Set up the frontend

**Windows:**

```bat
cd %USERPROFILE%\Documents\finance-dashboard\finance-dashboard-fe
npm install
copy .env.example .env.local
```

**Mac:**

```bash
cd ~/Documents/finance-dashboard/finance-dashboard-fe
npm install
cp .env.example .env.local
```

The file `.env.local` has one setting, which tells the frontend where the backend is:

| Setting | What to put |
|---|---|
| `BACKEND_API_URL` | `http://localhost:3001` (already filled in; leave it unless the backend runs elsewhere) |

The frontend needs no keys.

---

## 7. Step 5: Run the project

You need **two command windows**, both left open while you use the website.

**Window 1, the backend.** Go to the `finance-dashboard-be` folder and run:

```bash
npm run build
npm run start:prod
```

Wait for `Application running on http://localhost:3001`.

**Window 2, the frontend.** Go to the `finance-dashboard-fe` folder and run:

```bash
npm run build
npm run start
```

Wait for `Ready`, then open **<http://localhost:3000>** in your browser and log in with the administrator email and password from section 5.3.

### Every day after that

- **Start:** make sure SQL Server is running, then run `npm run start:prod` in the backend folder and `npm run start` in the frontend folder. `npm run build` is only needed after an update or a change.
- **Stop:** click each window and press `Ctrl` + `C`.
- **Check the backend:** open <http://localhost:3001/health>. It should show `"status":"ok"`.

### While making changes to the code

Use these instead. They reload by themselves when a file is saved:

| Folder | Command |
|---|---|
| `finance-dashboard-be` | `npm run start:dev` |
| `finance-dashboard-fe` | `npm run dev` |

---

## 8. Step 6: First-time setup inside the app

### 8.1 Create a read-only login in AutoCount's SQL Server

Give the dashboard a login that **can read but cannot change** AutoCount. On the SQL Server that holds the company's AutoCount database, open SSMS, click **New Query** and run this, with your own password and database name:

```sql
CREATE LOGIN dashboard_reader WITH PASSWORD = 'PUT-ANOTHER-STRONG-PASSWORD-HERE', CHECK_POLICY = ON;
GO
USE [AED_YOURCOMPANY];
CREATE USER dashboard_reader FOR LOGIN dashboard_reader;
ALTER ROLE db_datareader ADD MEMBER dashboard_reader;
GO
```

If several companies are on the same server, create the login once, then repeat only the last part, from `USE`, for each database.

That server must also:

- have **TCP/IP** enabled and **SQL Server and Windows Authentication mode** on (see section 4.1). AutoCount's server is often named `A2006`. The dashboard connects by **port number**, not by that name, so note the port shown under **IPAll**. If only a dynamic port is shown, set a fixed one.
- allow that port through its firewall, if it is a different computer.

Please ask your IT or AutoCount support to help if you are not sure. Changing these settings needs a short restart of AutoCount's SQL Server.

### 8.2 Add an organization

1. Log in as an administrator and click **New Organization**.
2. Enter the company name and click **Create Organization**.

### 8.3 Connect it to AutoCount

1. Open the organization, then **Settings** > **Database**.
2. Fill in the form:

   | Field | Example |
   |---|---|
   | Host | `localhost`, or the AutoCount computer's address such as `192.168.1.10` |
   | Port | `1433`, or the port you noted |
   | Database Name | `AED_YOURCOMPANY` |
   | Username | `dashboard_reader` |
   | Password | The password from section 8.1 |

3. Click **Save**, then **Test Connection**. You should see *Connection successful*.
4. Open **Dashboard**. Your figures should appear. If they are all zero, choose a date when the company had transactions.

Connect each AutoCount database to **one** organization only. Otherwise the group totals count it twice (the app warns you).

### 8.4 Add users

1. Go to **Users** and add a user. The account is created straight away with the password you type, so pass it on safely and ask them to change it under **Account**. No email is sent.
2. Choose a role:

   | Role | Can do |
   |---|---|
   | **Admin** | See every organization; manage organizations, users and AutoCount connections |
   | **Staff** | Only view reports, and only for organizations given to them |

3. For a staff user, open their page and use **Organization Assignment** > **Grant Access**.

To block someone, change their status from *Active* to *Invited* (they can no longer log in) or delete them. Anyone already logged in can stay in until their login expires, at most one day.

---

## 9. Features

### For each organization

| Screen | What it shows |
|---|---|
| **Dashboard** | Sales and profit for the month, year and last 12 months against last year; cash and working capital; sales trend; largest expenses; cash flow summary; latest transactions |
| **Profit & Loss Statement** | Full statement with % of sales, prior-year or budget comparison, variance, taxation, and monthly or quarterly columns |
| **Balance Sheet** | Assets, liabilities and equity on any date, prior-year comparison, and a warning if it does not balance |
| **Cash Flow** | Operating, investing and financing cash flow (indirect method), tied to the bank and cash balances |
| **Settings** (admin only) | Organization details, AutoCount connection, audit log (see [Known limitations](#16-known-limitations)) |

### Across organizations

These appear for people who can see more than one organization.

| Screen | What it shows |
|---|---|
| **Group Overview** | Sales and profit of every company, with group totals |
| **Consolidated** | Sales, profit, assets, equity and cash of every company for a date range |

### Things you can do in the reports

- **Choose dates** from quick options or a calendar.
- **Filter by project or department**, if you use them in AutoCount (Profit & Loss, Balance Sheet and Cash Flow).
- **Click an underlined amount** to see the transactions behind it.
- **Search accounts, collapse sections and hide zero rows.**
- **Export** to CSV or Excel. The two group screens also export to PDF.
- **Share a view:** filters are kept in the page address, so you can copy the link to a colleague who has access.
- **Follow links between reports**, for example from current-year profit on the Balance Sheet to the Profit & Loss.
- **Read the notes** under a report. They explain when a figure is approximate or something looks wrong.

### Administration

- Login with email and password; two roles (admin and staff).
- Add, edit and delete users and organizations; choose which organizations staff can see.
- AutoCount passwords are stored encrypted and are never shown again.
- Light and dark themes, and layouts for phones.

---

## 10. Where the numbers come from

| Figure | Where it comes from in AutoCount |
|---|---|
| Sales, costs, expenses, tax | The general ledger, grouped by AutoCount's own account types |
| Opening and closing stock | Month-end stock values. If a month has none, the most recent earlier value is used and a note says so |
| Budget | AutoCount's own budgets |
| Opening balances | AutoCount's opening balance records |
| Retained profit | Calculated, split at the start of AutoCount's fiscal year |
| Cash flow sections | AutoCount's cash flow category on each account |
| Cash and bank | Accounts AutoCount marks as bank or cash |

Amounts are in the company's home currency and shown as RM.

- **Year to date:** on the Dashboard and Group Overview it starts at the company's fiscal year. The quick option on the Profit & Loss, Cash Flow and Consolidated pages starts on 1 January.
- **Group totals:** companies are simply added together. Sales **between** your companies are not removed.

---

## 11. Checks to make before relying on the figures

The reports were tested against an AutoCount test database and made-up sample data. They agree with each other, but some situations could only be assumed. **Before using the figures for decisions, compare these with AutoCount's own reports, for at least one company:**

- [ ] **Profit & Loss** for one full month and one full year.
- [ ] **Balance Sheet** at your last year end.
- [ ] **Stock:** gross profit in a month with stock values, and the **first month stock was ever recorded**. In that first month the whole stock value appears as profit, because there is no earlier value to compare it with.
- [ ] **Budget:** amounts should have the right sign (the project assumes budgets are entered as positive numbers).
- [ ] **"Other liabilities" accounts:** shown as non-current. Ask your accountant whether that suits you.
- [ ] **Cash flow categories:** new AutoCount accounts default to "operating". The report lists accounts that look wrong; correct them in AutoCount.
- [ ] **Fixed deposits:** counted as cash only if AutoCount marks the account as bank or cash.
- [ ] **Extraordinary items and dividends:** not included in the Profit & Loss. The Balance Sheet and Cash Flow show them separately.

If a figure differs, note the company, report, dates, both figures and the account, and pass them to your developer, or use the "Something looks wrong" request in section 18.

---

## 12. Keeping it safe: backups and passwords

### Back up

| What | Why | How often |
|---|---|---|
| The `finance-dashboard-db` database | Users, organizations and connections | Weekly, and before every update |
| The backend `.env` file | Contains your keys | Once, and whenever it changes. Keep it somewhere secure |

To back up the database in SSMS: right-click `finance-dashboard-db` > **Tasks** > **Back Up**. Your AutoCount data needs its own normal backups, because this project does not store it.

### Good habits

- Use a strong, different password for each login.
- Always connect to AutoCount with the **read-only** login from section 8.1.
- Never put `.env` files on GitHub, in email, in chat or into an AI tool.
- Remove users who leave.
- If a key or password may have leaked, change it. After changing the encryption key, re-enter every AutoCount password.

### If someone forgets a password

There is no "forgot password" page yet. An admin can delete the user and add them again. If the **only** admin is locked out, put the three `ADMIN_` lines back in the backend `.env` with a **different email**, run `npm run bootstrap:admin`, log in with it, and remove the lines again.

---

## 13. Updating to a newer version

1. Back up the database (section 12).
2. Stop both windows with `Ctrl` + `C`.
3. In the `finance-dashboard-be` folder:

   ```bash
   git pull
   npm install
   npm run migration:run
   npm run build
   npm run start:prod
   ```

4. In the `finance-dashboard-fe` folder:

   ```bash
   git pull
   npm install
   npm run build
   npm run start
   ```

Always update **both** parts together. `migration:run` is safe when there is nothing new to apply.

---

## 14. Troubleshooting

| What you see | Likely reason | What to do |
|---|---|---|
| `npm` or `git` is "not recognized" | Not installed, or the computer needs a restart | Install it (section 2) and restart |
| PowerShell says running scripts is disabled | PowerShell blocks npm | Use Command Prompt |
| `git clone` says repository not found | No access, or wrong link | Check the link and ask for access |
| `JWT_SECRET env var is required` | `.env` is missing or not filled in | Section 5.3. Check the file is named `.env`, not `.env.txt` |
| `CREDENTIALS_ENCRYPTION_KEY must decode to exactly 32 bytes` | Key copied incompletely | Generate it again and copy the whole line |
| `Login failed for user` | Wrong database login or password, or SQL logins are off | Section 4.1 point 5, and section 5.3. A password containing `#` must be in double quotes |
| `Could not connect` or `ECONNREFUSED` on port 1433 | SQL Server is not running, TCP/IP is off, or wrong port | Section 4.1 |
| `EADDRINUSE` | That part is already running | Close the other window, or restart the computer |
| Login says invalid credentials | Wrong email or password, or the user is not *Active* | Check with an admin |
| The website opens but shows an error | The backend is not running | Check <http://localhost:3001/health> |
| "AutoCount database hasn't been set up yet" | No connection saved | Section 8.3 |
| "AutoCount database isn't reachable" | That computer is off, wrong details, or firewall | Use **Test Connection** in Settings > Database |
| Reports are all zero | No transactions in those dates | Choose other dates |
| Connection fails right after changing the encryption key | Old passwords cannot be read with a new key | Re-enter the AutoCount password in Settings > Database |
| A page takes long to open | A large or slow AutoCount database, or one that is off (the app waits about 8 seconds) | Check the AutoCount computer |
| Login returns to the login page on another computer | Login needs a secure (`https`) address | Section 15 |

When asking for help, send the exact error text, what you were doing, and a screenshot. **Never send the `.env` file.**

---

## 15. Putting it online for other people

The steps above are for **one computer**. To let colleagues use it, ask an IT person or developer to host it. This is what they need to know:

- **HTTPS is required.** In production mode the login cookie only works on a secure (`https`) address, or on `localhost`. Put a web server such as IIS, Nginx or Caddy with a certificate in front of the frontend.
- **Only the frontend should be public.** It talks to the backend itself. Keep the backend and both databases on a private network.
- **Settings:** set the frontend's `BACKEND_API_URL` to the backend's private address, and the backend's `CORS_ORIGIN` to the website address.
- **Reaching AutoCount:** the backend must reach each AutoCount computer. Use a VPN or private network. **Never open SQL Server to the internet**, as the connection to it is not encrypted.
- **Keep it running:** use a service manager such as PM2, or run it as a Windows service, so it restarts after a reboot.
- **Before opening it to the internet,** add the security items in section 17 (login attempt limits, password reset).

---

## 16. Known limitations

| Limitation | Effect |
|---|---|
| The **Audit Log page is always empty** | The page and table exist, but the app does not record anything yet |
| No forgotten-password page, and admins cannot reset a password | See section 12 |
| No invitation emails | Admins share passwords themselves |
| No limit on wrong login attempts | Add before opening to the internet |
| Blocking a user takes effect when their login expires | Up to one day |
| No EBITDA and no grouped expenses | Needs account mapping, see section 17 |
| Group totals do not remove transactions between companies | Totals can be higher than true consolidated figures |
| Currency is always shown as RM | Companies in other currencies show the wrong label, and group totals are not converted |
| PDFs cannot print Chinese and other non-Latin letters | They show as `?`. Excel and CSV are fine |
| Reports read AutoCount live | Very large databases may be slow, and reports need AutoCount to be switched on |
| A breakdown covers at most 36 months; a transaction list shows the latest 1,000 lines | Totals still cover every line |
| The Excel library (`xlsx`) has known security notices | They concern reading files. This project only creates them, so the risk is low |
| On phones, the top bar is slightly wider than the screen on organization pages | Cosmetic |

---

## 17. Ideas for further improvement

Sizes are rough: **Small** is a few focused changes, **Medium** is a feature, **Large** is several features together. "New tables" means a change to `finance-dashboard-db`, never to AutoCount.

### Recommended first

| Improvement | Why | Size | New tables |
|---|---|---|---|
| Record audit log entries | The page is already there but empty | Small | No |
| Admin password reset, and a forgotten-password email | Avoids deleting and re-adding users | Medium | Yes, for the email link |
| Limit login attempts | Security before going online | Small | No |
| Block users immediately | Closes the one-day gap | Small | No |
| Fix the first stock month | See section 11; confirm with AutoCount first | Small | No |

### Reports

| Improvement | What it gives you | Size | New tables |
|---|---|---|---|
| **Account mapping** | Assign each expense account to a group such as payroll or finance costs | Medium | Yes |
| **EBITDA and grouped expenses** | Needs account mapping | Small to medium | No |
| **Remove transactions between companies** | True consolidated figures | Large | Yes |
| **Multiple currencies** | Correct labels and converted group totals | Medium | Yes, for rates |
| **Comments on report lines** | Discuss a figure inside the report | Medium | Yes |
| **Budget import from CSV** | Only if you do not use AutoCount's budgets | Medium | Yes |
| **Monthly columns on Cash Flow and Balance Sheet** | Like the Profit & Loss | Small to medium | No |
| **Debtor and creditor ageing** | Who owes you, and for how long | Medium | No |
| **PDF for every report** | Same as the group screens | Small | No |
| **Industry figures** (for example hotel occupancy) | Needs operating data AutoCount does not hold | Medium | Yes |

### Convenience and growth

| Improvement | What it gives you | Size | New tables |
|---|---|---|---|
| Rearrangeable dashboard | Each user arranges their own cards | Medium | Yes |
| Scheduled email reports | Reports sent weekly or monthly | Medium | Yes |
| Alerts | For example, when cash falls below an amount | Medium | Yes |
| Invitation emails | New users set their own password | Medium | Yes |
| Login with Microsoft or Google | No separate passwords | Medium | Yes |
| More roles | For example, an accountant who can see but not manage | Medium | Possibly |
| Saved copies of figures | Faster reports, and they work when AutoCount is off, but can be out of date | Large | Yes |
| Automatic deployment and packaging (Docker) | Easier hosting and updates | Medium | No |

### A sensible order

1. Complete the checks in section 11.
2. Audit log, login limits and password reset.
3. Host it securely (section 15).
4. Account mapping, then EBITDA.
5. Whatever your team asks for most.

---

## 18. Using AI to make changes

You can ask an AI coding assistant, such as Claude Code, Cursor or GitHub Copilot, to make changes. AI is helpful but **makes mistakes that can look convincing**, especially with accounting figures. These rules keep you safe.

### Before you start

1. Open the parent `finance-dashboard` folder in the AI tool, so it can see both parts.
2. Make sure your work is saved in Git, so you can go back.
3. Create a separate branch in **each** part you will change. Never let AI work directly on `main`:

   ```bash
   git checkout -b improve-something
   ```

4. Use a **test copy** of your AutoCount database if you can, with the read-only login.

### Rules to give the AI

Paste this at the start of every conversation:

```text
Read finance-dashboard-fe/HANDOVER.md, finance-dashboard-fe/AGENTS.md and
finance-dashboard-be/README.md first, then look at the code before changing it.

Rules:
1. AutoCount databases are READ ONLY. Never write SQL that inserts, updates,
   deletes, or changes tables in AutoCount.
2. Every AutoCount query must use parameters. Never join user input into SQL.
3. Never show, log, commit or ask me for passwords, keys or .env contents.
4. Keep access checks on every backend endpoint: RequirePermissions, plus
   OrgAccessGuard for anything belonging to one organization.
5. Use the HomeDR and HomeCR columns for amounts, and AutoCount's account types
   (AccType, AccGroup, SpecialAccType). Never guess from account names.
6. The reports must keep agreeing with each other: current-year profit on the
   Balance Sheet equals the Profit & Loss, closing cash on the Cash Flow equals
   the Balance Sheet, and the Dashboard and group screens match the reports.
7. Changes to our own database need a new migration. Do not edit old ones.
8. The frontend uses a newer Next.js than you may know. Read the guides in
   finance-dashboard-fe/node_modules/next/dist/docs before writing code.
9. Reuse components/statement and the existing backend builders. Add tests for
   calculations.
10. Explain your plan in plain language and wait for my approval before
    changing anything. I am not a programmer.
```

### How to ask

Describe **what you want and how you will check it**, one change at a time.

Less useful: *"Improve the dashboard."*

Better:

```text
On the Profit & Loss page, add a PDF option to the Export menu, like the one on
the Group Overview page. It must contain the same rows and columns as the Excel
export. Do not change any calculation. Tell me which files you will change first.
```

### Ready-made requests

**Audit log**

```text
The audit_log table, AuditLogService and the Audit Log page exist, but nothing
writes entries. Record an entry when an organization is created, changed or
deleted, when AutoCount settings are saved, and when a user is added, changed,
deleted or given or refused access. Never record passwords. A failed audit entry
must not stop the action. Add tests. No new tables should be needed.
```

**Account mapping and EBITDA**

```text
Add account mapping. In finance-dashboard-db, add a table with organization,
account code and category (payroll, administrative, selling and distribution,
finance costs, depreciation, other), using a new migration. Add an admin-only
page under an organization's Settings listing its AutoCount expense accounts
(AccType EP) with a category for each. You may suggest categories from names, but
only use what the admin saves. On the Profit & Loss, group expenses by category
with an "Unassigned" group, and show EBITDA as net profit before tax plus finance
costs plus depreciation, with a note while any account is unassigned. No existing
total may change. Add tests.
```

**Login protection**

```text
Limit failed logins on POST /auth/login, for example 5 attempts per 15 minutes
per email and address. Also make blocking or deleting a user take effect at once,
by checking the user's status on each request in JwtStrategy. Add tests.
```

**Something looks wrong**

```text
For organization <name>, the <report> from <date> to <date> shows <figure> for
<line>, but AutoCount shows <figure>. Find out why. Show me the query and the
steps of the calculation. Do not change code until we agree on the cause.
```

### Check the result

Run these, and ask the AI to fix anything that fails.

In `finance-dashboard-be`:

```bash
npm test
npm run lint
npm run build
```

In `finance-dashboard-fe`:

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run lint` in the backend also tidies files by itself. In the frontend it currently reports one old problem in `hooks/use-mobile.ts`; anything else is new.

Then check it yourself:

- [ ] The change does what you asked, with real dates you know.
- [ ] Total sales and net profit are unchanged for a month you already checked.
- [ ] The Balance Sheet still balances, and the Cash Flow shows no warning.
- [ ] A **staff** user still sees only their own organizations.
- [ ] Nothing secret was added. Ask: *"List every file you changed and confirm none contains passwords or keys."*

**Save it, once you are happy:**

```bash
git add -A
git commit -m "Describe the change"
git push -u origin improve-something
```

**Throw it away, if it went wrong and you have not committed.** This permanently deletes every uncommitted change in that folder:

```bash
git restore .
git clean -fd
```

### Get a person to check

Ask a developer or accountant to review anything that changes **calculations, logins and permissions, the database, or hosting**.

---

## 19. Technical reference

For a developer, or an AI assistant.

### Technology

| Part | Built with |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui on Base UI |
| Backend | NestJS 11, TypeScript, TypeORM (own database only), `mssql` for AutoCount, JWT login |
| Database | Microsoft SQL Server |

### How a report is made

1. A page in `finance-dashboard-fe/app/(protected)/` reads filters from the page address.
2. It calls the backend from the server through `lib/api.ts`, sending the login token kept in an httpOnly cookie.
3. A backend module in `src/modules/` checks access, queries AutoCount through `AutocountConnectionManagerService`, and passes rows to a *builder* that does the calculation.
4. The page shows the result with shared components from `components/statement/`.

### Backend modules (`finance-dashboard-be/src/modules`)

| Module | Purpose |
|---|---|
| `auth`, `users`, `organizations` | Login, users, organizations and access |
| `autocount-connections` | Connections to AutoCount, one pool per organization |
| `profit-loss` | Statement, breakdown, trend, transactions, filter options; period and stock helpers used by the others |
| `balance-sheet` | Balance sheet, opening balances, fiscal year, account grouping |
| `cash-flow` | Indirect cash flow |
| `dashboard` | One organization's summary, built from the three reports |
| `group` | Group Overview and Consolidated |
| `audit-log`, `health` | Audit log (reading only, so far) and status check |

Calculations are in files ending `.builder.ts` and in `profit-loss-stock.ts`, `profit-loss-periods.ts`, `fiscal-year.ts`, `dashboard-ranges.ts` and `group-totals.ts`. Tests end in `.spec.ts`. SQL for AutoCount is in files ending `.queries.ts`.

### Frontend folders (`finance-dashboard-fe`)

| Folder | Purpose |
|---|---|
| `app/(protected)` | Pages that need a login |
| `app/(public)`, `app/api/auth` | Login page, and setting or clearing the login cookie |
| `components/statement` | Shared report parts: table, filters, KPI cards, export, transactions |
| `components/profit-loss`, `balance-sheet`, `cash-flow`, `dashboard`, `group` | Parts for each report |
| `lib` | Data loading, URL filters, row building, exports |
| `config/nav.ts` | Organization menu |
| `proxy.ts` | Sends people who are not logged in to the login page |

### Project database tables

`users`, `organizations`, `organization_access`, `organization_autocount_credentials`, `audit_log`, and `migrations` (kept by TypeORM).

### AutoCount tables read

`GLDTL`, `GLMast`, `AccGroup`, `AccType`, `OBalance`, `FiscalYear`, `StockPBalance`, `StockSet`, `Budget`, `BudgetPBalance`, `Project`, `Dept`.

Useful facts:

- Period numbers are `year * 12 + month`.
- Opening balances are in `OBalance`, not in the ledger.
- Profit is not posted to retained earnings, so it is calculated.
- `AccGroup.Group`: `AS` and `FN` are balance sheet groups; the rest are profit and loss.
- `GLMast.CashFlowCategory` is `O`, `I` or `F`, with `O` as the column default.
- `SpecialAccType`: `SBK` bank, `SCH` cash, `SBS` stock, `SDC`/`SDR` debtors, `SCC`/`SCR` creditors, `SAD` accumulated depreciation, `SRE` retained earnings.

### API

The endpoint list is under **Full API reference** in [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md). The rest of that file is an earlier planning note and is partly out of date; where it differs from this guide or the code, follow this guide and the code.

---

## 20. Glossary

| Term | Meaning |
|---|---|
| **Backend / frontend** | The part that does the work / the part you see |
| **Branch** | A separate copy of the code for trying changes |
| **Clone** | Download a project with Git |
| **Commit** | Save a set of changes in Git |
| **Dependencies** | Ready-made parts a project needs, installed by `npm install` |
| **EBITDA** | Profit before interest, tax, depreciation and amortisation |
| **`.env` file** | A private settings file that stays on your computer |
| **Environment variable** | One setting inside that file |
| **Localhost** | This computer |
| **Migration** | A step that creates or changes tables in the project's database |
| **Port** | A numbered door a program listens on, such as 3000 |
| **Repository (repo)** | The place on GitHub where the code is kept |
| **SSMS** | SQL Server Management Studio |
| **Variance** | The difference between two figures |

---

## 21. Handover checklist

**From the developer**

- [ ] The latest version of **both** parts is on the `main` branch
- [ ] Repository access or ownership has been given
- [ ] A walkthrough of the app has been done

**From the client**

- [ ] The project runs on your own computer
- [ ] You can log in as an administrator
- [ ] At least one organization is connected with the read-only login
- [ ] Both keys and the `.env` file are stored safely
- [ ] The first database backup is done
- [ ] The checks in section 11 are done with your accountant
