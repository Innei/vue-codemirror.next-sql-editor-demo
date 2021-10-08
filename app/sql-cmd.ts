const sqlInit = `
CREATE TABLE "users" ("id" integer,"name" varchar,"age" int, PRIMARY KEY (id));

INSERT INTO "users" ("id", "name", "age") VALUES
('1', 'John', '12'),
('2', 'Tom', '24'),
('3', 'Adriana Barco', '24'),
('4', 'John Richardson', '24'),
('5', 'Martha Dawson', '24'),
('6', 'Niels Wilmsen', '24'),
('7', '杨红', '24'),
('8', 'Mercedes Pereira Roselló', '24')


;


CREATE TABLE "books" ("id" integer,"name" varchar,"price" float, PRIMARY KEY (id));

INSERT INTO "books" ("id", "name", "price") VALUES
('1', '码农翻身', '12.00'),
('2', '编码 - 隐匿于计算机背后的语言', '24.00');

`
export { sqlInit }
