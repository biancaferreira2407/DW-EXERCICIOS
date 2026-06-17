CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE TABLE public.estado (
    sigla_estado CHAR(2) PRIMARY KEY,
    nome_estado VARCHAR(60) NOT NULL
);
CREATE TABLE public.cidade (
    id_cidade SERIAL PRIMARY KEY,
    nome_cidade VARCHAR(60) NOT NULL,
	sigla_estado VARCHAR(3) NOT NULL,
	FOREIGN KEY (sigla_estado) REFERENCES public.estado(sigla_estado)
);
INSERT INTO public.estado (sigla_estado, nome_estado) VALUES
('PR', 'PARANÁ'),
('AC', 'ACRE'),
('CE', 'CEARÁ'),
('BA', 'BAHIA'),
('AL', 'ALAGOAS'),
('AM', 'AMAZONAS'),
('AP', 'AMAPÁ'),
('GO', 'GOIÁS');
INSERT INTO public.estado (sigla_estado, nome_estado) VALUES ('PI', 'PIAUÍ');

INSERT INTO public.cidade (nome_cidade, sigla_estado) VALUES
('CURITIBA', 'PR'),
('CAMPO MOURÃO', 'PR'),
('ARARUNA', 'PR'),
('JANIÓPOLIS', 'PR'),
('ARIRANHA DO IVAÍ', 'PR'),
('RIO BRANCO', 'AC'),
('CAPIXABA', 'AC'),
('TERESINA', 'PI'),
('CURRALINHOS', 'PI'),
('GUADALUPE', 'PI'),
('FORTALEZA', 'CE'),
('JIJOCA DE JERICOACOARA', 'CE'),
('SALVADOR', 'BA'),
('XIQUE-XIQUE', 'BA'),
('MACEIÓ', 'AL'),
('MINADOR DO NEGRÃO', 'AL'),
('PIRANHAS', 'AL'),
('PARICONHA', 'AL'),
('PALESTINA', 'AL'),
('MESSIAS', 'AL'),
('COITÉ DO NÓIA', 'AM'),
('ATALAIA', 'AP'),
('TARTARUGALZINHO', 'AP'),
('CUTIAS', 'AP'),
('GOIÂNIA', 'GO');