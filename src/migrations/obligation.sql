CREATE TABLE IF NOT EXISTS todo (
	ID BIGSERIAL primary key, 
	title varchar(255) NULL,
	description varchar(255) NULL,
	postedat date NULL,
	finished bool NULL
);