COPY megasena FROM '/dados.csv'
WITH (
  FORMAT csv,
  DELIMITER ';',
  HEADER,
  NULL 'NULL',
  ENCODING 'UTF8'
);

SELECT COUNT(*) FROM megasena;