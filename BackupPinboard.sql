--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-11 13:34:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: administrador
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO administrador;

--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: administrador
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 847 (class 1247 OID 16424)
-- Name: tipo_transporte_enum; Type: TYPE; Schema: public; Owner: administrador
--

CREATE TYPE public.tipo_transporte_enum AS ENUM (
    'BUS',
    'TROLE',
    'BICI',
    'PIE',
    'AUTO',
    'OTRO'
);


ALTER TYPE public.tipo_transporte_enum OWNER TO administrador;

--
-- TOC entry 222 (class 1255 OID 16449)
-- Name: actualizar_fecha_modificacion(); Type: FUNCTION; Schema: public; Owner: administrador
--

CREATE FUNCTION public.actualizar_fecha_modificacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_fecha_modificacion() OWNER TO administrador;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16492)
-- Name: reserva; Type: TABLE; Schema: public; Owner: administrador
--

CREATE TABLE public.reserva (
    viaje_id integer NOT NULL,
    pasajero_id integer NOT NULL,
    fecha_reserva timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reserva OWNER TO administrador;

--
-- TOC entry 216 (class 1259 OID 16438)
-- Name: ruta; Type: TABLE; Schema: public; Owner: administrador
--

CREATE TABLE public.ruta (
    id integer NOT NULL,
    titulo character varying(200) NOT NULL,
    descripcion text NOT NULL,
    punto_inicio character varying(255) NOT NULL,
    punto_destino character varying(255) NOT NULL,
    tipo_transporte public.tipo_transporte_enum DEFAULT 'BUS'::public.tipo_transporte_enum NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_actualizacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    creador_id integer
);


ALTER TABLE public.ruta OWNER TO administrador;

--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN ruta.titulo; Type: COMMENT; Schema: public; Owner: administrador
--

COMMENT ON COLUMN public.ruta.titulo IS 'Ej: Ruta Segura desde la PUCE al CCI en Trole';


--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN ruta.descripcion; Type: COMMENT; Schema: public; Owner: administrador
--

COMMENT ON COLUMN public.ruta.descripcion IS 'Describe los pasos, paradas, y cualquier consejo útil.';


--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN ruta.punto_inicio; Type: COMMENT; Schema: public; Owner: administrador
--

COMMENT ON COLUMN public.ruta.punto_inicio IS 'Ej: ''Universidad PUCE (Av. 12 de Octubre)''';


--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN ruta.punto_destino; Type: COMMENT; Schema: public; Owner: administrador
--

COMMENT ON COLUMN public.ruta.punto_destino IS 'Ej: ''Centro Comercial Iñaquito (CCI)''';


--
-- TOC entry 215 (class 1259 OID 16437)
-- Name: ruta_id_seq; Type: SEQUENCE; Schema: public; Owner: administrador
--

CREATE SEQUENCE public.ruta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ruta_id_seq OWNER TO administrador;

--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 215
-- Name: ruta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: administrador
--

ALTER SEQUENCE public.ruta_id_seq OWNED BY public.ruta.id;


--
-- TOC entry 218 (class 1259 OID 16452)
-- Name: usuario; Type: TABLE; Schema: public; Owner: administrador
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    correo character varying(100) NOT NULL,
    cedula character varying(10) NOT NULL,
    conductor boolean DEFAULT false NOT NULL,
    placa character varying(10),
    capacidadvehiculo integer,
    password_hash character varying(72) NOT NULL,
    CONSTRAINT chk_usuario_correo_puce CHECK (((correo)::text ~~ '%@puce.edu.ec'::text))
);


ALTER TABLE public.usuario OWNER TO administrador;

--
-- TOC entry 217 (class 1259 OID 16451)
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: administrador
--

ALTER TABLE public.usuario ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16477)
-- Name: viajecompartido; Type: TABLE; Schema: public; Owner: administrador
--

CREATE TABLE public.viajecompartido (
    id integer NOT NULL,
    origen text NOT NULL,
    destino text NOT NULL,
    fecha_hora_salida timestamp with time zone NOT NULL,
    asientos_ofrecidos integer NOT NULL,
    estado character varying(20) DEFAULT 'PROGRAMADO'::character varying NOT NULL,
    id_conductor integer,
    CONSTRAINT chk_asientos_positivos CHECK ((asientos_ofrecidos > 0)),
    CONSTRAINT chk_estado_valido CHECK (((estado)::text = ANY ((ARRAY['PROGRAMADO'::character varying, 'EN_CURSO'::character varying, 'COMPLETADO'::character varying, 'CANCELADO'::character varying])::text[])))
);


ALTER TABLE public.viajecompartido OWNER TO administrador;

--
-- TOC entry 219 (class 1259 OID 16476)
-- Name: viajecompartido_id_seq; Type: SEQUENCE; Schema: public; Owner: administrador
--

ALTER TABLE public.viajecompartido ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.viajecompartido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3225 (class 2604 OID 16441)
-- Name: ruta id; Type: DEFAULT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.ruta ALTER COLUMN id SET DEFAULT nextval('public.ruta_id_seq'::regclass);


--
-- TOC entry 3251 (class 2606 OID 16497)
-- Name: reserva reserva_pkey; Type: CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_pkey PRIMARY KEY (viaje_id, pasajero_id);


--
-- TOC entry 3236 (class 2606 OID 16448)
-- Name: ruta ruta_pkey; Type: CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.ruta
    ADD CONSTRAINT ruta_pkey PRIMARY KEY (id);


--
-- TOC entry 3238 (class 2606 OID 16461)
-- Name: usuario usuario_cedula_key; Type: CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cedula_key UNIQUE (cedula);


--
-- TOC entry 3240 (class 2606 OID 16459)
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- TOC entry 3242 (class 2606 OID 16527)
-- Name: usuario usuario_password_hash_key; Type: CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_password_hash_key UNIQUE (password_hash);


--
-- TOC entry 3244 (class 2606 OID 16457)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 16511)
-- Name: usuario usuario_placa_key; Type: CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_placa_key UNIQUE (placa);


--
-- TOC entry 3248 (class 2606 OID 16486)
-- Name: viajecompartido viajecompartido_pkey; Type: CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.viajecompartido
    ADD CONSTRAINT viajecompartido_pkey PRIMARY KEY (id);


--
-- TOC entry 3249 (class 1259 OID 16508)
-- Name: idx_reserva_pasajero; Type: INDEX; Schema: public; Owner: administrador
--

CREATE INDEX idx_reserva_pasajero ON public.reserva USING btree (pasajero_id);


--
-- TOC entry 3256 (class 2620 OID 16450)
-- Name: ruta trigger_actualizar_fecha; Type: TRIGGER; Schema: public; Owner: administrador
--

CREATE TRIGGER trigger_actualizar_fecha BEFORE UPDATE ON public.ruta FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_modificacion();


--
-- TOC entry 3252 (class 2606 OID 16543)
-- Name: ruta fk_creador; Type: FK CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.ruta
    ADD CONSTRAINT fk_creador FOREIGN KEY (creador_id) REFERENCES public.usuario(id);


--
-- TOC entry 3253 (class 2606 OID 16512)
-- Name: viajecompartido fk_id_conductor; Type: FK CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.viajecompartido
    ADD CONSTRAINT fk_id_conductor FOREIGN KEY (id_conductor) REFERENCES public.usuario(id);


--
-- TOC entry 3254 (class 2606 OID 16503)
-- Name: reserva reserva_pasajero_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_pasajero_id_fkey FOREIGN KEY (pasajero_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 3255 (class 2606 OID 16498)
-- Name: reserva reserva_viaje_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrador
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_viaje_id_fkey FOREIGN KEY (viaje_id) REFERENCES public.viajecompartido(id) ON DELETE CASCADE;


-- Completed on 2025-08-11 13:35:11

--
-- PostgreSQL database dump complete
--

