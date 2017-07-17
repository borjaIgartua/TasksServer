**Users**

+----------+-----------------+------+-----+---------+----------------+
| Field    | Type            | Null | Key | Default | Extra          |
+----------+-----------------+------+-----+---------+----------------+
| id       | int(6) unsigned | NO   | PRI | NULL    | auto_increment |
| username | varchar(20)     | NO   | UNI | NULL    |                |
| password | char(60)        | NO   |     | NULL    |                |
| email    | varchar(50)     | YES  |     | NULL    |                |
+----------+-----------------+------+-----+---------+----------------+

**Tasks**

+---------+-----------------+------+-----+---------+----------------+
| Field   | Type            | Null | Key | Default | Extra          |
+---------+-----------------+------+-----+---------+----------------+
| id      | int(6) unsigned | NO   | PRI | NULL    | auto_increment |
| title   | varchar(30)     | NO   |     | NULL    |                |
| message | varchar(50)     | YES  |     | NULL    |                |
| done    | tinyint(1)      | YES  |     | NULL    |                |
| user_id | int(6) unsigned | NO   | MUL | NULL    |                |
+---------+-----------------+------+-----+---------+----------------+