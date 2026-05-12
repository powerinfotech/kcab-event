-- event.notice_news — Notice & News 게시판
--
-- 컨벤션은 event.events / event.users / event.tb_file 와 동일하게 정리한다:
--   - PK:     BIGINT GENERATED ALWAYS AS IDENTITY
--   - 감사컬럼: created_by/at, updated_by/at, deleted_at (TIMESTAMPTZ)
--   - 플래그:  CHAR(1) Y/N (top_yn, use_yn) — com_grp_cd / tb_file 와 동일
--   - 첨부:   file_seq → event.tb_file(file_seq) FK
CREATE TABLE IF NOT EXISTS event.notice_news (
     notice_news_seq BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
    ,post_type       VARCHAR(20)  NOT NULL
    ,title           VARCHAR(500) NOT NULL
    ,content         TEXT
    ,post_date       DATE         NOT NULL DEFAULT CURRENT_DATE
    ,view_count      INTEGER      NOT NULL DEFAULT 0
    ,top_yn          CHAR(1)      NOT NULL DEFAULT 'N'
    ,use_yn          CHAR(1)      NOT NULL DEFAULT 'Y'
    ,file_seq        BIGINT
    ,created_by      BIGINT       REFERENCES event.users(user_seq) ON DELETE SET NULL
    ,created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    ,updated_by      BIGINT       REFERENCES event.users(user_seq) ON DELETE SET NULL
    ,updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    ,deleted_at      TIMESTAMPTZ
    ,CONSTRAINT notice_news_type_chk CHECK (post_type IN ('NEWS', 'NOTICE'))
    ,CONSTRAINT notice_news_top_chk  CHECK (top_yn IN ('Y', 'N'))
    ,CONSTRAINT notice_news_use_chk  CHECK (use_yn IN ('Y', 'N'))
    ,CONSTRAINT notice_news_file_seq_fkey
        FOREIGN KEY (file_seq) REFERENCES event.tb_file(file_seq) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_notice_news_post_date
    ON event.notice_news (post_date DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notice_news_post_type
    ON event.notice_news (post_type)
    WHERE deleted_at IS NULL;

COMMENT ON TABLE  event.notice_news IS 'Notice & News 통합 게시판';
COMMENT ON COLUMN event.notice_news.post_type IS '게시구분: NEWS=뉴스, NOTICE=공지사항';
COMMENT ON COLUMN event.notice_news.post_date IS '게시일자 (관리자가 지정하는 표시용 날짜)';
COMMENT ON COLUMN event.notice_news.top_yn   IS '상단 고정 여부 (Y/N)';
COMMENT ON COLUMN event.notice_news.use_yn   IS '노출 여부 (Y/N)';
COMMENT ON COLUMN event.notice_news.file_seq IS '첨부파일 그룹 (event.tb_file.file_seq)';
