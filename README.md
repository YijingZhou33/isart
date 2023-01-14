# iSART - Safety Assistant Radiotherapy Tool

**iSART** is a tool that aims at promoting patient safety in radiotherapy by means of proactive hazard analysis techniques FMEA. It should accomplish the following functionalities: 

1. It allows user authentication and permissions.
2. It collects failure modes derived from real-world proactive risk assessments published by the radiotherapy departments from Europe or USA, or from literature reviews, or from incident learning systems like [SAFRON](https://rpop.iaea.org/safron/process-steps) and [NHS](https://www.nhs.uk/).
3. It semi-automates the identification and removal of duplicated failure modes with the guidance of radiotherapy experts. 
4. It provides a failure modes search engine enhanced with ordering and filtering features.
5. It visualizes the statistical summary of different databases (i.e., failure modes database, user database, user-entered failure modes database) via charts.
6. It allows administrators to add, update, delete user-entered failure modes.

## Techniques

### Frontend 

- [Vue 3](https://vuejs.org/):  Javascript-based Framework

- [Element Plus](https://element-plus.org/en-US/): Vue 3 based component library
- [Vue-ECharts](https://github.com/ecomfe/vue-echarts): Vue chart component library
- [tailwindcss](https://tailwindcss.com/): packed CSS framework

### Backend

- [Django](https://www.djangoproject.com/): high-level Python framework
- [Django REST framework](https://www.django-rest-framework.org/): build RESTful APIs

- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/): authentication plugin JSON Web Token
- [django-filter](https://django-filter.readthedocs.io/en/stable/): customize advanced filter queries
- [django-auditlog (Auditlog)](https://django-auditlog.readthedocs.io/en/latest/): log changes of records along with the user who made the change

### Database

- [MySQL](https://docs.djangoproject.com/en/4.1/ref/databases/#mysql-notes): database

## Environment

Currently we are using Ubuntu 20.04 along with Python 3.10 and Nginx. 

## Quick Start

### Install necessary dependencies

-  **npm**
  - Install npm: `sudo apt install npm`
  - Verify npm installation: `npm -v`
- **pip**
  - Install pip: `sudo apt-get install python3-pip `
  - Verify pip installation: `pip3 --version`
- **mysql-server**
  - Install mysql: `sudo apt install mysql-server`
  - Give the **password**, hit **ENTER**, press "**y**" to continue
  - Verify mysql installation: `mysql --version`
- **libmysqlclient-dev**
  - Install libmysqlclient-dev: `sudo apt install libmysqlclient-dev`
  - Verify libmysqlclient-dev: `libmysqlclient-dev --version`
- **mysqlclient**
  - Install mysqlclient: `sudo apt install mysqlclient`
  - Verify mysqlclient: `mysqlclient --version`
- **git**
  - Install git: `sudo apt install git`
  - Verify libmysqlclient-dev: `git --version`
- **tmux**
  - Install tmux: `sudo apt-get install tmux`
  - Verify tmux: `tmux --version`

> 💡You can do it in one command: `sudo apt install mysql-server libmysqlclient-dev npm python3-pip tmux git`

### Set up the application

Copy and paste `git clone https://github.com/YijingZhou33/isart.git` to the Linux terminal after navigating to the desired environment.  

#### Database

- Open the local terminal
  - Export the database: `mysqldump -u username -p --databases isart_db > isart_db.sql`
  - Transfer ***isart_db.sql*** to the server: `scp ABSOLUTE_PATH/isart_db.sql [user@]DEST_HOST:]DESTINATION`
- In the Linux terminal 
  - Create a new admin user and password for Django
    - `CREATE USER '[username]'@'localhost' IDENTIFIED BY '[password]';`
    - `GRANT ALL PRIVILEGES ON isart_db.* TO '[username]'@'localhost';`
    - `FLUSH PRIVILEGES;`
  - Create the database on the server
    - `mysql -u root -p`
    - `mysql > source isart_db.sql`

#### Frontend

In the Linux terminal, redirect to ***frontend*** folder

- `npm install`
- `npm run build`

#### Backend

In the Linux terminal, redirect to ***isart*** folder

- Create a virtual environment: `python3 -m venv env`
- Activate it with `source env/bin/activate`
- Install python libraries: `pip3 install -r requirements.txt`
- Open another window within the current terminal, start the Django server
  - `tmux new -s [name] `
  - `python manage.py runserver`
- Update ***nginx.conf*** as required
- Restart nginx: `sudo systemctl restart nginx`

### Update the application

In the Linux terminal, run `git pull` to get the latest updates

#### Database [if updated] 

- Open the local terminal
  - Export the database: `mysqldump -u username -p --databases isart_db > isart_db.sql`
  - Transfer ***isart_db.sql*** to the server: `scp ABSOLUTE_PATH/isart_db.sql [user@]DEST_HOST:]DESTINATION`
- In the Linux terminal 
  - Create the database on the server
    - `mysql -u root -p`
    - `mysql > source isart_db.sql`

#### Frontend [if updated]

In the Linux terminal, redirect to ***frontend*** folder

- `npm run build`

#### Backend [if updated] 

In the Linux terminal, redirect to ***isart*** folder

- Activate it with `source /env/bin/activate`
- Open another window within the current terminal, restart the Django server
  - Stop the server: `tmux a -t [name] ` + `CRTL + C`
  - Restart the server: `python manage.py runserver`



### 