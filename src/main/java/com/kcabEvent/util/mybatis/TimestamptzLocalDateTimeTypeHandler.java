package com.kcabEvent.util.mybatis;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;

/**
 * PostgreSQL의 {@code TIMESTAMPTZ} (timestamp with time zone) 컬럼을 {@link LocalDateTime}로 안전하게 매핑한다.
 *
 * <p>PostgreSQL JDBC 42.7+ 부터 timestamptz → LocalDateTime 자동 변환이 제거되어
 * {@code "Cannot convert the column of type TIMESTAMPTZ to requested type java.time.LocalDateTime"}
 * 예외가 발생한다. 이 핸들러는 timestamptz는 KST(Asia/Seoul)로 변환 후 LocalDateTime으로,
 * 일반 timestamp는 그대로 LocalDateTime으로 매핑한다.</p>
 *
 * <p>{@code mybatis-config.xml}의 {@code <typeHandlers>}에 등록되어 모든 LocalDateTime 매핑에 사용된다.</p>
 */
@MappedTypes(LocalDateTime.class)
public class TimestamptzLocalDateTimeTypeHandler extends BaseTypeHandler<LocalDateTime> {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, LocalDateTime parameter, JdbcType jdbcType) throws SQLException {
        ps.setObject(i, parameter);
    }

    @Override
    public LocalDateTime getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return convert(rs.getObject(columnName));
    }

    @Override
    public LocalDateTime getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return convert(rs.getObject(columnIndex));
    }

    @Override
    public LocalDateTime getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return convert(cs.getObject(columnIndex));
    }

    /**
     * JDBC 드라이버가 반환한 시간 객체를 {@link LocalDateTime}으로 정규화한다.
     * timestamptz는 KST 벽시계 시간으로 변환한다.
     */
    private LocalDateTime convert(Object value) throws SQLException {
        if (value == null) return null;
        if (value instanceof OffsetDateTime odt) return odt.atZoneSameInstant(KST).toLocalDateTime();
        if (value instanceof Timestamp ts) return ts.toLocalDateTime();
        if (value instanceof LocalDateTime ldt) return ldt;
        throw new SQLException("Unsupported value type for LocalDateTime mapping: " + value.getClass());
    }
}
