CREATE USER 'mailuser'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'adminMailuser@#$';
GRANT ALL ON mailserver.* TO 'mailuser'@'localhost';

-- Remove test database and user
DROP DATABASE IF EXISTS test;
DROP USER IF EXISTS 'test'@'%';
